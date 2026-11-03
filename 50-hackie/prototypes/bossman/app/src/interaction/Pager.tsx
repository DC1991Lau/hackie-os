/* INTERACTION — the app layer: Views pager, dots, stories handle, notebook arrow.
   One manual pan decides the axis after 8px and routes the drag (D10, D11):
   horizontal → views; vertical → the view's own scroll first; then, with the scroll at its top,
   down from the top third → stories; with the scroll at its end, up from the bottom third → notebook. */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { GestureDetector, GestureStateManager, usePanGesture, useTapGesture, Pressable } from 'react-native-gesture-handler';
import Animated, { Easing, cancelAnimation, interpolate, useAnimatedReaction, useAnimatedStyle, useSharedValue, withDecay, withRepeat, withSequence, withSpring, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FakeStatusBar, HandleLook, NotebookHintLook } from '../ui/chrome';
import { useTheme } from '../ui/theme';
import { VIEW_COUNT, ViewContent, type ComponentSlot } from '../ui/views';
import { axisSlop, notebook as NB, pager as P, springs, stories as ST } from './physics';
import { blockTaps, clamp, rubber, tapAllowed, useStore } from './store';
import { inBottomThird, inSystemEdge, inTopThird } from './zones';

const MODE = { none: 0, x: 1, stories: 2, notebook: 3, scroll: 4, fail: -1 };

export function AppLayer() {
  const s = useStore();
  // destructure: a worklet that captures `s` would freeze `actions` on native (sheets would stop opening)
  const { W, H, sheetK, stP, stDragY, nbP, pagerPos, actions, insetTop, tapBlockUntil } = s;
  const [index, setIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const px = useSharedValue(0);
  const idx = useSharedValue(0);
  const startX = useSharedValue(0), startY = useSharedValue(0), mode = useSharedValue(0), base = useSharedValue(0), startIdx = useSharedValue(0);
  // each View scrolls vertically (VIEW_COUNT is a constant, so the hook order is stable)
  const scrolls = Array.from({ length: VIEW_COUNT }, () => useSharedValue(0));
  const maxes = Array.from({ length: VIEW_COUNT }, () => useSharedValue(0));

  const goTo = (t: number, v = 0) => {
    'worklet';
    idx.value = t;
    px.value = withSpring(-t * W.value, { ...springs.pager, velocity: v });
    scheduleOnRN(setIndex, t);
  };
  useEffect(() => { actions.current.goToView = (t: number) => goTo(clamp(t, 0, VIEW_COUNT - 1)); });

  const pan = usePanGesture({
    manualActivation: true,
    onTouchesDown: e => {
      'worklet';
      const t = e.allTouches[0];
      startX.value = t.x; startY.value = t.y; mode.value = MODE.none;
      cancelAnimation(scrolls[idx.value]);
    },
    onTouchesMove: e => {
      'worklet';
      if (mode.value !== MODE.none) return;
      const t = e.allTouches[0];
      const dx = t.x - startX.value, dy = t.y - startY.value;
      if (Math.hypot(dx, dy) < axisSlop) return;
      const f = { width: W.value, height: H.value, insetTop: insetTop.value, insetBottom: insets.bottom };
      let m = MODE.fail;
      const sc = scrolls[idx.value].value, max = maxes[idx.value].value;
      if (!inSystemEdge(startX.value, startY.value, f)) {                       // D11
        if (Math.abs(dx) > Math.abs(dy)) m = MODE.x;
        else if (dy > 0 && sc > 0.5) m = MODE.scroll;                           // D10: scroll first
        else if (dy < 0 && sc < max - 0.5) m = MODE.scroll;
        else if (dy > 0 && inTopThird(startY.value, f)) m = MODE.stories;      // at the top of the scroll
        else if (dy < 0 && inBottomThird(startY.value, f) && Math.abs(px.value + idx.value * W.value) < 1) m = MODE.notebook; // at the end (D4: any view)
      }
      mode.value = m;
      if (m === MODE.fail) { GestureStateManager.fail(e.handlerTag); return; }
      if (m === MODE.x) { cancelAnimation(px); base.value = px.value; startIdx.value = Math.round(-px.value / W.value); }
      if (m === MODE.scroll) base.value = sc;
      blockTaps(tapBlockUntil, true);
      GestureStateManager.activate(e.handlerTag);
    },
    onUpdate: e => {
      'worklet';
      if (mode.value === MODE.x) {
        let x = base.value + e.translationX; const min = -(VIEW_COUNT - 1) * W.value;
        if (x > 0) x = rubber(x, W.value); else if (x < min) x = min - rubber(min - x, W.value);
        px.value = x;
      } else if (mode.value === MODE.stories) {
        const d = Math.max(0, e.translationY);
        stP.value = (d < ST.pull ? d : ST.pull + (d - ST.pull) * 0.3) / ST.pull;
      } else if (mode.value === MODE.notebook) {
        nbP.value = clamp(-e.translationY / (H.value * NB.depth), 0, 1);
      } else if (mode.value === MODE.scroll) {
        const i = idx.value;
        scrolls[i].value = clamp(base.value - e.translationY, 0, maxes[i].value);
      }
    },
    onDeactivate: e => {
      'worklet';
      if (mode.value === MODE.x) {
        const proj = -(px.value + e.velocityX * P.projection) / W.value;
        goTo(clamp(Math.round(proj), Math.max(0, startIdx.value - 1), Math.min(VIEW_COUNT - 1, startIdx.value + 1)), e.velocityX);
      } else if (mode.value === MODE.stories) {
        const open = stP.value > ST.open || e.velocityY > ST.velocity;
        stDragY.value = 0;
        stP.value = withSpring(open ? 1 : 0, { ...springs.storiesPull, velocity: e.velocityY / ST.pull });
      } else if (mode.value === MODE.notebook) {
        const open = nbP.value > NB.open || e.velocityY < -NB.velocity;
        nbP.value = withSpring(open ? 1 : 0, { ...springs.notebook, velocity: -e.velocityY / (H.value * NB.depth) });
      } else if (mode.value === MODE.scroll) {
        const i = idx.value;
        scrolls[i].value = withDecay({ velocity: -e.velocityY, clamp: [0, maxes[i].value] });
      }
    },
    onFinalize: () => {
      'worklet';
      if (mode.value > 0) blockTaps(tapBlockUntil, false);
      // a rejected drag must still let the page land
      if (mode.value !== MODE.x && Math.abs(px.value + idx.value * W.value) > 0.5) goTo(idx.value);
    },
  });

  // keep the track aligned on rotation / resize
  useAnimatedReaction(() => W.value, (w, prev) => { if (prev !== null && w !== prev) px.value = -idx.value * w; });

  const appStyle = useAnimatedStyle(() => {
    const stK = Math.min(stP.value, 1) * (1 - Math.min(stDragY.value / (H.value * 0.7), 1));
    const n = Math.min(nbP.value, 1);
    const k = sheetK.value;
    const pull = Math.min(stP.value, 1) * ST.pull;
    return {
      opacity: 1 - n,
      borderRadius: k > 0.005 || stK > 0.005 || n > 0.005 ? 30 : 0,
      transform: [{ translateY: pull * 0.3 + k * 8 - n * 70 }, { scale: (1 - 0.07 * k - 0.08 * stK) * (1 - 0.08 * n) }],
    };
  });
  useAnimatedReaction(() => -px.value / (W.value || 1), pos => { pagerPos.value = pos; });
  const trackStyle = useAnimatedStyle(() => ({ transform: [{ translateX: px.value }] }));
  const dotsStyle = useAnimatedStyle(() => {
    const stK = Math.min(stP.value, 1);
    return { opacity: 1 - Math.max(sheetK.value, stK) };
  });

  const C: ComponentSlot = ViewComponent;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }, appStyle]}>
      <View style={[st.status, { top: 16 + insets.top }]} pointerEvents="none" accessibilityElementsHidden><FakeStatusBar /></View>
      <GestureDetector gesture={pan}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <Animated.View style={[st.track, { width: `${VIEW_COUNT * 100}%` }, trackStyle]}>
            {Array.from({ length: VIEW_COUNT }, (_, i) => (
              <ViewPage key={i} index={i} current={index === i} scroll={scrolls[i]} max={maxes[i]} H={H}>
                <ViewContent index={i} C={C} />
              </ViewPage>
            ))}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
      <Pressable style={[st.storiesBtn, { top: 24 + insets.top }]} onPress={() => actions.current.openStories()} accessibilityRole="button" accessibilityLabel="Abrir stories">
        <HandleLook width={36} />
      </Pressable>
      <NotebookArrow bottom={118 + insets.bottom} onPress={() => actions.current.openNotebook()} />
      <Animated.View style={[st.dots, { bottom: 98 + insets.bottom }, dotsStyle]} accessibilityRole="tablist">
        {Array.from({ length: VIEW_COUNT }, (_, i) => <DotButton key={i} i={i} onPress={() => goTo(i)} current={index === i} />)}
      </Animated.View>
    </Animated.View>
  );
}

function ViewPage({ index, current, scroll, max, H, children }: { index: number; current: boolean; scroll: SharedValue<number>; max: SharedValue<number>; H: SharedValue<number>; children: ReactNode }) {
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: -scroll.value }] }));
  return (
    <ViewIndex.Provider value={index}>
      <View style={st.view} importantForAccessibility={current ? 'auto' : 'no-hide-descendants'} accessibilityElementsHidden={!current}>
        <Animated.View style={[st.viewInner, a]} onLayout={e => { max.value = Math.max(0, e.nativeEvent.layout.height - H.value); }}>{children}</Animated.View>
      </View>
    </ViewIndex.Provider>
  );
}

const ViewIndex = createContext(0);

/** One floating component: tap opens the sheet, press scales, lags while paging (parallax), floats. */
function ViewComponent({ accent, depth, style, children }: { accent: string; depth: number; style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  const { pagerPos, actions, tapBlockUntil } = useStore();
  const i = useContext(ViewIndex);
  const pressed = useSharedValue(0);
  const float = useSharedValue(0);
  useEffect(() => {
    float.value = withRepeat(withSequence(withTiming(-5, { duration: 3000, easing: Easing.inOut(Easing.ease) }), withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })), -1);
  }, []);
  const a = useAnimatedStyle(() => {
    const o = i - pagerPos.value;
    return {
      opacity: 1 - Math.min(1, Math.abs(o)) * 0.5,
      transform: [{ translateX: o * depth * P.parallax }, { translateY: float.value * (0.6 + depth * 0.4) }, { scale: interpolate(pressed.value, [0, 1], [1, 0.965]) }],
    };
  });
  // a Gesture Handler tap (not a Pressable): on Android a Pressable under the pager's pan never gets the touch
  const open = () => { if (tapAllowed(tapBlockUntil)) actions.current.openSheet(accent); };
  const tap = useTapGesture({
    maxDistance: 10,
    onBegin: () => { 'worklet'; pressed.value = withTiming(1, { duration: 120 }); },
    onActivate: () => { 'worklet'; scheduleOnRN(open); },
    onFinalize: () => { 'worklet'; pressed.value = withTiming(0, { duration: 250 }); },
  });
  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[style, a]} accessible accessibilityRole="button" accessibilityLabel="Abrir componente" onAccessibilityTap={open}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

function DotButton({ i, current, onPress }: { i: number; current: boolean; onPress: () => void }) {
  const t = useTheme();
  const { pagerPos } = useStore();
  const a = useAnimatedStyle(() => {
    const k = Math.max(0, 1 - Math.abs(i - pagerPos.value));
    return { width: 6 + 14 * k, opacity: 0.3 + 0.7 * k };
  });
  return (
    <Pressable onPress={onPress} style={st.dotHit} accessibilityRole="tab" accessibilityLabel={`View ${i + 1}`} accessibilityState={{ selected: current }}>
      <Animated.View style={[{ height: 6, borderRadius: 3, backgroundColor: t.fg }, a]} />
    </Pressable>
  );
}

function NotebookArrow({ bottom, onPress }: { bottom: number; onPress: () => void }) {
  const y = useSharedValue(0);
  useEffect(() => { y.value = withRepeat(withSequence(withTiming(-5, { duration: 1200 }), withTiming(0, { duration: 1200 })), -1); }, []);
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Pressable onPress={onPress} style={[st.nbBtn, { bottom }]} accessibilityRole="button" accessibilityLabel="Abrir notebook">
      <Animated.View style={a}><NotebookHintLook /></Animated.View>
    </Pressable>
  );
}

const st = StyleSheet.create({
  status: { position: 'absolute', left: 28, right: 28 },
  track: { flexDirection: 'row', height: '100%' },
  view: { flex: 1, overflow: 'hidden' },
  // bottom padding keeps the last components clear of the dots and the orb
  viewInner: { paddingTop: 68, paddingHorizontal: 18, paddingBottom: 170, gap: 14 },
  storiesBtn: { position: 'absolute', alignSelf: 'center', width: 72, height: 44, alignItems: 'center', justifyContent: 'center' },
  nbBtn: { position: 'absolute', alignSelf: 'center', width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  dots: { position: 'absolute', alignSelf: 'center', flexDirection: 'row' },
  dotHit: { minWidth: 24, height: 36, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
});
