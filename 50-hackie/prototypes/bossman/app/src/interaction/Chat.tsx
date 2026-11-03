/* INTERACTION — Orb + conversation overlay (R6).
   Tap the orb: it docks left and the composer opens to its right.
   D2: the answer card keeps the session's turns; closing clears them.
   D7: the orb stays over the sheet and hides for stories (unless the chat was opened from a story). */
import { useEffect, useRef, useState } from 'react';
import {Keyboard, Platform, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { GestureDetector, usePanGesture, Pressable } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AskBubble, Reply, Typing } from '../ui/answer';
import { OrbSphere } from '../ui/orb-sphere';
import { useTheme } from '../ui/theme';
import { chat as CH } from './physics';
import { useStore } from './store';

const ORB = 68;
const EASE = Easing.bezier(0.2, 0.9, 0.25, 1);
type Turn = { id: number; len: number; done: boolean; saved: boolean };

export function ChatLayer() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const winH = useWindowDimensions().height;
  const { W, H, stP, stDragY, chatOpen, chatTop, actions, setCards } = useStore();
  const [open, setOpen] = useState(false);
  const [top, setTop] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [text, setText] = useState('');
  const input = useRef<React.ComponentRef<typeof TextInput>>(null);
  const scroller = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const p = useSharedValue(0);        // 0 closed → 1 open (dock + composer)
  const dragY = useSharedValue(0);
  const hover = useSharedValue(0);
  const think = useSharedValue(0);

  useEffect(() => {
    hover.value = withRepeat(withSequence(withTiming(-7, { duration: 2000, easing: Easing.inOut(Easing.ease) }), withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })), -1);
  }, []);

  // keyboard: edge-to-edge Android does not resize the window, so lift the composer, the card and the orb ourselves
  const kb = useSharedValue(0);
  const [kbH, setKbH] = useState(0);
  useEffect(() => {
    const ios = Platform.OS === 'ios';
    const show = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', e => {
      const h = Math.max(0, e.endCoordinates.height - insets.bottom);
      setKbH(h);
      kb.value = withTiming(h, { duration: ios ? e.duration || 250 : 200, easing: EASE });
    });
    const hide = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', e => {
      setKbH(0);
      kb.value = withTiming(0, { duration: ios ? e.duration || 250 : 200, easing: EASE });
    });
    return () => { show.remove(); hide.remove(); };
  }, [insets.bottom]);

  const openChat = (fromStory = false) => {
    setTurns([]); setOpen(true); setTop(fromStory);
    chatOpen.value = 1; chatTop.value = fromStory ? 1 : 0;
    dragY.value = 0;
    p.value = withTiming(1, { duration: CH.dockMs, easing: EASE });
    setTimeout(() => input.current?.focus(), 250);
  };
  const closeChat = () => {
    if (timer.current) clearTimeout(timer.current);
    Keyboard.dismiss();
    think.value = 0;
    chatOpen.value = 0; chatTop.value = 0;
    p.value = withTiming(0, { duration: 450, easing: EASE }, done => { if (done) scheduleOnRN(setOpen, false); });
    setTop(false);
  };
  useEffect(() => { actions.current.openChat = openChat; });

  const send = () => {
    const len = text.trim().length;
    setText('');
    const id = Date.now();
    setTurns(ts => [...ts, { id, len, done: false, saved: false }]);
    think.value = withRepeat(withSequence(withTiming(1, { duration: 550 }), withTiming(0, { duration: 550 })), -1);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      think.value = withTiming(0);
      setTurns(ts => ts.map(x => (x.id === id ? { ...x, done: true } : x)));
    }, 1100);
  };
  const save = (id: number) => {
    setTurns(ts => ts.map(x => (x.id === id ? { ...x, saved: true } : x)));
    setCards(cs => [{ id: Date.now(), kind: 1 }, ...cs]);
  };

  // swipe down on the veil closes the conversation
  const pan = usePanGesture({
    activeOffsetY: 10,
    failOffsetY: -10,
    failOffsetX: [-20, 20],
    onUpdate: e => { 'worklet'; dragY.value = Math.max(0, e.translationY); },
    onDeactivate: e => {
      'worklet';
      if (dragY.value > CH.closeDistance || e.velocityY > CH.closeVelocity) scheduleOnRN(closeChat);
      else dragY.value = withTiming(0, { duration: 300, easing: EASE });
    },
  });

  const orbStyle = useAnimatedStyle(() => {
    const stK = chatTop.value ? 0 : Math.min(stP.value, 1) * (1 - Math.min(stDragY.value / (H.value * 0.7), 1));
    const closedX = (W.value - ORB) / 2, dockX = 16;
    return {
      opacity: 1 - stK,
      transform: [
        { translateX: closedX + (dockX - closedX) * p.value },
        { translateY: hover.value + stK * 150 + dragY.value - kb.value * p.value },
        { scale: (1 - 0.18 * p.value) * (1 - 0.05 * think.value) },
      ],
    };
  });
  const veilStyle = useAnimatedStyle(() => ({ opacity: p.value * (1 - Math.min(dragY.value / 400, 0.8)) }));
  const innerStyle = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: dragY.value - kb.value }] }));
  const composerStyle = useAnimatedStyle(() => ({ opacity: Math.min(1, p.value * 1.4), transform: [{ scaleX: 0.2 + 0.8 * p.value }] }));

  const z = top ? 13 : 10;
  return (
    <>
      {open && (
        <View style={[StyleSheet.absoluteFill, { zIndex: z }]}>
          <GestureDetector gesture={pan}>
            <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: t.veil }, veilStyle]}>
              <Pressable style={StyleSheet.absoluteFill} onPress={closeChat} accessibilityLabel="Fechar conversa" />
            </Animated.View>
          </GestureDetector>
          <Animated.View style={[StyleSheet.absoluteFill, innerStyle]} pointerEvents="box-none">
            {turns.length > 0 && (
              <View style={[st.answer, { bottom: 34 + 56 + 14 + insets.bottom, maxHeight: winH - 210 - kbH, backgroundColor: t.card, borderColor: t.line }]}>
                <ScrollView ref={scroller} contentContainerStyle={{ padding: 16, gap: 14 }} onContentSizeChange={() => scroller.current?.scrollToEnd({ animated: true })}>
                  {turns.map((x, i) => (
                    <View key={x.id} style={[{ gap: 14 }, i > 0 && { paddingTop: 14, borderTopWidth: 1.5, borderTopColor: t.fill }]}>
                      <AskBubble len={x.len} />
                      {x.done ? <Reply seed={x.id % 97} saved={x.saved} onSave={() => save(x.id)} /> : <Typing />}
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
            <Animated.View style={[st.composer, { bottom: 34 + insets.bottom, backgroundColor: t.card, borderColor: t.line, transformOrigin: 'left center' }, composerStyle]}>
              <TextInput ref={input} value={text} onChangeText={setText} onSubmitEditing={send} returnKeyType="send" blurOnSubmit={false}
                style={[st.input, { color: t.fg }]} cursorColor={t.fg} selectionColor={t.boneStrong} accessibilityLabel="Mensagem" />
              <Pressable onPress={send} style={[st.send, { backgroundColor: t.fg }]} accessibilityRole="button" accessibilityLabel="Enviar">
                <View style={{ width: 11, height: 11, marginTop: 4, borderLeftWidth: 2.5, borderTopWidth: 2.5, borderColor: t.ink, transform: [{ rotate: '45deg' }] }} />
              </Pressable>
            </Animated.View>
          </Animated.View>
        </View>
      )}
      <Animated.View style={[st.orb, { bottom: 28 + insets.bottom, zIndex: top ? 14 : open ? 11 : 9 }, orbStyle]}>
        <View style={[st.ground, { backgroundColor: t.orb.ground }]} />
        <Pressable onPress={() => (open ? closeChat() : openChat())} accessibilityRole="button" accessibilityLabel={open ? 'Fechar conversa' : 'Abrir conversa'} hitSlop={6}>
          <OrbSphere size={ORB} />
        </Pressable>
      </Animated.View>
    </>
  );
}

const st = StyleSheet.create({
  orb: { position: 'absolute', left: 0, width: ORB, height: ORB },
  ground: { position: 'absolute', left: 6, bottom: -18, width: 56, height: 12, borderRadius: 28, opacity: 0.6 },
  answer: { position: 'absolute', left: 16, right: 16, borderWidth: 1.5, borderRadius: 26, overflow: 'hidden' },
  composer: { position: 'absolute', left: 94, right: 16, height: 56, borderRadius: 28, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', paddingLeft: 18, paddingRight: 6, gap: 8 },
  input: { flex: 1, height: 44, fontSize: 16, outlineStyle: 'none' } as never,
  send: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
