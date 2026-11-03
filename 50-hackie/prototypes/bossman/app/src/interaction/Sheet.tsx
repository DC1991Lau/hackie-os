/* INTERACTION — bottom sheet: closed / half / full screen.
   Scroll first: dragging down returns the content to the top before the sheet moves.
   D5: from full screen a swipe down stops at half. D12: tap the handle to toggle size. */
import { useEffect, useState } from 'react';
import {StyleSheet, View } from 'react-native';
import { GestureDetector, usePanGesture, Pressable } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, useAnimatedReaction, useAnimatedStyle, useSharedValue, withDecay, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { CloseLook, HandleLook } from '../ui/chrome';
import { SheetContent } from '../ui/sheet-content';
import { useTheme } from '../ui/theme';
import { sheet as SH, springs } from './physics';
import { clamp, useStore } from './store';

const TOP = 64; // content starts below the handle and the close button

export function SheetLayer() {
  const t = useTheme();
  const { H, sheetK, actions } = useStore();
  const [accent, setAccent] = useState<string | null>(null);
  const ty = useSharedValue(10000);       // translateY of the sheet; CLOSED = H + 30
  const scroll = useSharedValue(0);
  const maxScroll = useSharedValue(0);
  const contentH = useSharedValue(0);
  const state = useSharedValue(0);        // 0 closed, 1 half, 2 full
  const from = useSharedValue(0);
  const mode = useSharedValue(0);         // 0 sheet, 1 scroll

  const HALF = () => { 'worklet'; return H.value * SH.half; };
  const CLOSED = () => { 'worklet'; return H.value + 30; };

  const to = (target: number, v = 0) => {
    'worklet';
    const tgt = target === 2 ? 0 : target === 1 ? HALF() : CLOSED();
    state.value = target;
    cancelAnimation(scroll);
    ty.value = withSpring(tgt, { ...springs.sheet, velocity: clamp(v, -SH.maxVelocity, SH.maxVelocity) }, done => {
      if (done && target === 0) { scroll.value = 0; scheduleOnRN(setAccent, null); }
    });
  };

  useEffect(() => {
    actions.current.openSheet = (a: string) => {
      setAccent(a);
      scroll.value = 0;
      ty.value = H.value + 30;
      to(1);
    };
  });

  // drives the app layer behind (scale back + scrim)
  useAnimatedReaction(() => ty.value, y => {
    const k1 = clamp((CLOSED() - y) / (CLOSED() - HALF()), 0, 1), k2 = clamp((HALF() - y) / HALF(), 0, 1);
    sheetK.value = k1 * 0.6 + k2 * 0.4;
  });

  const pan = usePanGesture({
    activeOffsetY: [-8, 8],
    failOffsetX: [-20, 20],
    onBegin: () => { 'worklet'; cancelAnimation(ty); cancelAnimation(scroll); from.value = state.value; },
    onUpdate: e => {
      'worklet';
      let d = e.changeY;
      const max = maxScroll.value;
      if (d < 0) {
        if (ty.value > 0) { const use = Math.max(d, -ty.value); ty.value += use; d -= use; mode.value = 0; }
        if (d < 0 && scroll.value < max) { scroll.value = Math.min(max, scroll.value - d); mode.value = 1; }
      } else if (d > 0) {
        if (scroll.value > 0) { const use = Math.min(d, scroll.value); scroll.value -= use; d -= use; mode.value = 1; }
        if (d > 0) { ty.value += d; mode.value = 0; }
      }
    },
    onDeactivate: e => {
      'worklet';
      if (mode.value === 1 && ty.value <= 0.5) {
        state.value = 2;
        scroll.value = withDecay({ velocity: -e.velocityY, clamp: [0, maxScroll.value] });
        return;
      }
      const proj = ty.value + e.velocityY * SH.projection;
      const snaps = [0, HALF(), CLOSED()];
      let best = 0;
      for (let i = 1; i < 3; i++) if (Math.abs(snaps[i] - proj) < Math.abs(snaps[best] - proj)) best = i;
      let target = best === 0 ? 2 : best === 1 ? 1 : 0;
      if (from.value === 2 && target === 0) target = 1;   // D5
      to(target, e.velocityY);
    },
  });

  const sheetStyle = useAnimatedStyle(() => {
    const f = clamp((HALF() - ty.value) / HALF(), 0, 1), m = SH.inset * (1 - f);
    return {
      left: m, right: m, height: H.value - m,
      borderRadius: SH.radius * (1 - f),
      opacity: ty.value >= CLOSED() - 1 ? 0 : 1,
      transform: [{ translateY: ty.value }],
    };
  });
  const borderStyle = useAnimatedStyle(() => ({ opacity: 1 - clamp((HALF() - ty.value) / HALF(), 0, 1) }));
  const grabStyle = borderStyle;
  const innerStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -scroll.value }] }));
  const scrimStyle = useAnimatedStyle(() => {
    const k1 = clamp((CLOSED() - ty.value) / (CLOSED() - HALF()), 0, 1), k2 = clamp((HALF() - ty.value) / HALF(), 0, 1);
    return { opacity: k1 * 0.7 + k2 * 0.3 };
  });

  const open = accent !== null;
  return (
    <>
      <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 7, backgroundColor: t.scrim }, scrimStyle]} pointerEvents={open ? 'auto' : 'none'}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => to(0)} accessibilityLabel="Fechar" />
      </Animated.View>
      {open && (
        <GestureDetector gesture={pan}>
          <Animated.View style={[st.sheet, { backgroundColor: t.sheet }, sheetStyle]} accessibilityViewIsModal accessibilityLabel="Detalhe">
            <Animated.View style={[StyleSheet.absoluteFill, st.border, { borderColor: t.line }, borderStyle]} pointerEvents="none" />
            <Pressable style={st.grab} onPress={() => to(state.value === 2 ? 1 : 2)} accessibilityRole="button" accessibilityLabel="Alternar entre meio ecrã e ecrã inteiro">
              <Animated.View style={grabStyle}><HandleLook /></Animated.View>
            </Pressable>
            <Pressable style={st.close} hitSlop={5} onPress={() => to(state.value === 2 ? 1 : 0)} accessibilityRole="button" accessibilityLabel="Fechar">
              <CloseLook />
            </Pressable>
            <View style={st.body}>
              <Animated.View style={[st.inner, innerStyle]}
                onLayout={e => { contentH.value = e.nativeEvent.layout.height; maxScroll.value = Math.max(0, e.nativeEvent.layout.height - (H.value - TOP)); }}>
                <SheetContent accent={accent} />
              </Animated.View>
            </View>
          </Animated.View>
        </GestureDetector>
      )}
    </>
  );
}

const st = StyleSheet.create({
  sheet: { position: 'absolute', top: 0, zIndex: 8, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 25, shadowOffset: { width: 0, height: -10 } },
  border: { borderWidth: 1.5, borderRadius: SH.radius },
  grab: { height: 30, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: 120, zIndex: 2 },
  close: { position: 'absolute', top: 14, left: 16, zIndex: 3 },
  body: { position: 'absolute', top: TOP, left: 0, right: 0, bottom: 0, overflow: 'hidden' },
  // bottom padding keeps the last rows clear of the orb (D7: the orb stays over the sheet)
  inner: { paddingTop: 4, paddingHorizontal: 16, paddingBottom: 130 },
});
