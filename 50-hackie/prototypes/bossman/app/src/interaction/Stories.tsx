/* INTERACTION — stories: one cube face per theme, auto-advance, hold to pause,
   tap left third = back, tap elsewhere = next, swipe sideways = change theme (3D cube),
   swipe down / close button = exit. D6: the reply field opens the conversation over the story. */
import { useEffect, useRef, useState } from 'react';
import {StyleSheet, View } from 'react-native';
import { GestureDetector, GestureStateManager, useLongPressGesture, usePanGesture, useSimultaneousGestures, useTapGesture, Pressable } from 'react-native-gesture-handler';
import Animated, { Easing, cancelAnimation, useAnimatedReaction, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseLook } from '../ui/chrome';
import { STORY_GROUPS, StoryHeader, StorySlide } from '../ui/story-slide';
import { useTheme } from '../ui/theme';
import { springs, stories as ST } from './physics';
import { clamp, rubber, useStore } from './store';
import { inSystemEdge } from './zones';

const G = STORY_GROUPS.length;

export function StoriesLayer() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const { W, H, stP, stDragY, chatTop, actions } = useStore();
  const [open, setOpen] = useState(false);
  const [g, setG] = useState(0);
  const [seg, setSeg] = useState<number[]>(() => STORY_GROUPS.map(() => 0));
  const [held, setHeld] = useState(false);
  const [chatOver, setChatOver] = useState(false);
  const cubeX = useSharedValue(0);
  const progress = useSharedValue(0);
  const axis = useSharedValue(0);   // 1 x (cube), 2 y (close)
  const cubeBase = useSharedValue(0);
  const state = useRef({ g: 0, seg: STORY_GROUPS.map(() => 0) });

  // open/closed follows stP (driven by the pager pull or the handle button)
  useAnimatedReaction(() => stP.value > 0.001, (vis, prev) => { if (vis !== prev) scheduleOnRN(setOpen, vis); });
  useAnimatedReaction(() => chatTop.value, v => scheduleOnRN(setChatOver, v === 1));

  const reset = () => {
    state.current = { g: 0, seg: STORY_GROUPS.map(() => 0) };
    setG(0); setSeg(state.current.seg); cubeX.value = 0; progress.value = 0; stDragY.value = 0;
  };
  useEffect(() => {
    actions.current.openStories = () => { reset(); stP.value = withSpring(1, springs.storiesPull); };
  });
  useEffect(() => { if (open) reset(); }, [open]);

  const close = (v = 0) => {
    'worklet';
    stDragY.value = withSpring(H.value * 1.1, { ...springs.storiesClose, velocity: Math.max(0, v) }, done => {
      if (done) { stP.value = 0; stDragY.value = 0; }
    });
  };

  const goGroup = (to: number) => {
    state.current.g = to; setG(to); progress.value = 0;
    cubeX.value = withSpring(to * W.value, springs.cube);
  };
  const next = () => {
    const { g: cur, seg: s } = state.current;
    if (s[cur] < STORY_GROUPS[cur] - 1) { s[cur]++; setSeg([...s]); progress.value = 0; }
    else if (cur < G - 1) goGroup(cur + 1);
    else close();
  };
  const prev = () => {
    const { g: cur, seg: s } = state.current;
    if (s[cur] > 0) { s[cur]--; setSeg([...s]); progress.value = 0; }
    else if (cur > 0) goGroup(cur - 1);
    else progress.value = 0;
  };

  // auto-advance: 4.5 s per story, paused while held or while the conversation is open
  const fullyOpen = open && !held && !chatOver;
  useEffect(() => {
    if (!fullyOpen) { cancelAnimation(progress); return; }
    progress.value = withTiming(1, { duration: ST.slideMs * (1 - progress.value), easing: Easing.linear }, done => { if (done) scheduleOnRN(next); });
    return () => cancelAnimation(progress);
  }, [fullyOpen, g, seg]);

  const pan = usePanGesture({
    activeOffsetX: [-10, 10],
    activeOffsetY: 10,
    failOffsetY: -10,
    onBegin: e => {
      'worklet';
      const f = { width: W.value, height: H.value, insetTop: insets.top, insetBottom: insets.bottom };
      if (inSystemEdge(e.x, e.y, f)) GestureStateManager.fail(e.handlerTag);   // D11
    },
    onActivate: e => {
      'worklet';
      axis.value = Math.abs(e.translationX) > Math.abs(e.translationY) ? 1 : 2;
      cancelAnimation(cubeX); cubeBase.value = cubeX.value;
    },
    onUpdate: e => {
      'worklet';
      if (axis.value === 1) {
        let x = cubeBase.value - e.translationX; const max = (G - 1) * W.value;
        if (x < 0) x = -rubber(-x, W.value); else if (x > max) x = max + rubber(x - max, W.value);
        cubeX.value = x;
      } else stDragY.value = Math.max(0, e.translationY);
    },
    onDeactivate: e => {
      'worklet';
      if (axis.value === 1) {
        const cur = Math.round(cubeBase.value / W.value);
        let to = cur;
        if (e.translationX < -W.value * 0.25 || e.velocityX < -500) to++;
        else if (e.translationX > W.value * 0.25 || e.velocityX > 500) to--;
        to = clamp(to, 0, G - 1);
        if (to !== cur) scheduleOnRN(goGroup, to);
        else cubeX.value = withSpring(to * W.value, { ...springs.cube, velocity: -e.velocityX });
      } else if (stDragY.value > ST.closeDistance || e.velocityY > ST.closeVelocity) close(e.velocityY);
      else stDragY.value = withSpring(0, { stiffness: 340, damping: 32, velocity: e.velocityY });
      axis.value = 0;
    },
  });
  const tap = useTapGesture({
    maxDuration: 180,
    onActivate: e => {
      'worklet';
      if (e.y < 100 + insets.top || e.y > H.value - 90 - insets.bottom) return;  // chrome and footer have their own buttons
      if (e.x < W.value * 0.3) scheduleOnRN(prev); else scheduleOnRN(next);
    },
  });
  const hold = useLongPressGesture({
    minDuration: ST.holdMs,
    onActivate: () => { 'worklet'; scheduleOnRN(setHeld, true); },
    onFinalize: () => { 'worklet'; scheduleOnRN(setHeld, false); },
  });
  const gestures = useSimultaneousGestures(pan, tap, hold);

  const layerStyle = useAnimatedStyle(() => {
    const p = Math.min(stP.value, 1), y = stDragY.value;
    return {
      opacity: Math.min(1, p * 1.6) * (1 - clamp((y - H.value * 0.3) / (H.value * 0.5), 0, 1)),
      borderRadius: p < 1 || y > 0 ? 30 : 0,
      transform: [{ translateY: (p - 1) * 70 + y * 0.9 }, { scale: (0.9 + 0.1 * p) * (1 - Math.min(y / H.value, 1) * 0.3) }],
    };
  });

  if (!open) return null;
  return (
    <GestureDetector gesture={gestures}>
      <Animated.View style={[StyleSheet.absoluteFill, st.layer, { backgroundColor: t.ink }, layerStyle]} accessibilityViewIsModal accessibilityLabel="Stories">
        {STORY_GROUPS.map((n, gi) => (
          <Face key={gi} gi={gi} active={gi === g} cubeX={cubeX} W={W} reduce={reduce}>
            <StorySlide group={gi} slide={seg[gi]} />
            <View style={[st.chrome, { paddingTop: 14 + insets.top }, held && { opacity: 0 }]}>
              <View style={st.bars}>
                {Array.from({ length: n }, (_, si) => <Bar key={si} state={si < seg[gi] ? 1 : si > seg[gi] || gi !== g ? 0 : -1} progress={progress} />)}
              </View>
              <View style={st.who}>
                <Pressable onPress={() => close()} hitSlop={5} accessibilityRole="button" accessibilityLabel="Fechar stories"><CloseLook /></Pressable>
                <StoryHeader group={gi} />
              </View>
            </View>
            <View style={[st.foot, { bottom: 24 + insets.bottom }, held && { opacity: 0 }]}>
              <Pressable onPress={() => actions.current.openChat(true)} style={[st.reply, { borderColor: t.line }]} accessibilityRole="button" accessibilityLabel="Perguntar ao orb sobre este story" />
              <View style={[st.ic, { borderColor: t.fg }]} />
              <View style={[st.ic, { borderColor: t.fg }]} />
            </View>
          </Face>
        ))}
      </Animated.View>
    </GestureDetector>
  );
}

function Face({ gi, active, cubeX, W, reduce, children }: { gi: number; active: boolean; cubeX: SharedValue<number>; W: SharedValue<number>; reduce: boolean; children: React.ReactNode }) {
  const a = useAnimatedStyle(() => {
    const o = gi - cubeX.value / (W.value || 1);
    if (Math.abs(o) >= 0.999) return { opacity: 0, transform: [{ translateX: 0 }] };
    if (reduce) return { opacity: 1 - Math.abs(o), transform: [{ translateX: 0 }] };   // reduced motion: cross-fade
    return {
      opacity: 1,
      transformOrigin: o < 0 ? 'right center' : 'left center',
      transform: [{ perspective: 1100 }, { translateX: o * W.value }, { rotateY: `${o * 90}deg` }],
    };
  });
  const shade = useAnimatedStyle(() => ({ opacity: Math.min(1, Math.abs(gi - cubeX.value / (W.value || 1))) * 0.7 }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, { backfaceVisibility: 'hidden', overflow: 'hidden', zIndex: active ? 1 : 0 }, a]}
      pointerEvents={active ? 'box-none' : 'none'} accessibilityElementsHidden={!active} importantForAccessibility={active ? 'auto' : 'no-hide-descendants'}>
      {children}
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }, shade]} pointerEvents="none" />
    </Animated.View>
  );
}

function Bar({ state, progress }: { state: number; progress: SharedValue<number> }) {
  const t = useTheme();
  const a = useAnimatedStyle(() => ({ width: `${(state === -1 ? progress.value : state) * 100}%` }));
  return (
    <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: t.bone, overflow: 'hidden' }}>
      <Animated.View style={[{ height: '100%', backgroundColor: t.fg }, a]} />
    </View>
  );
}

const st = StyleSheet.create({
  layer: { zIndex: 12, overflow: 'hidden' },
  chrome: { position: 'absolute', left: 0, right: 0, top: 0, paddingHorizontal: 10 },
  bars: { flexDirection: 'row', gap: 4 },
  who: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, paddingHorizontal: 4 },
  foot: { position: 'absolute', left: 14, right: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  reply: { flex: 1, height: 48, borderRadius: 24, borderWidth: 1.5 },
  ic: { width: 30, height: 30, borderRadius: 15, borderWidth: 2 },
});
