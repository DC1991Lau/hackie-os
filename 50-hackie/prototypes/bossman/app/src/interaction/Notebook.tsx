/* INTERACTION — notebook: opens from any View (D4), 4 layouts with animated reflow,
   reorder by long press 400 ms (D9) or instantly in edit mode (D12), pull down at the top to close. */
import { useEffect, useRef, useState } from 'react';
import {StyleSheet, View, useWindowDimensions } from 'react-native';
import { GestureDetector, GestureStateManager, usePanGesture, Pressable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import Animated, { LinearTransition, cancelAnimation, useAnimatedReaction, useAnimatedStyle, useSharedValue, withDecay, withSpring, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseLook } from '../ui/chrome';
import { NOTEBOOK_LAYOUTS, NotebookCardContent, cardBox, useNotebookCardStyle, type NotebookLayout } from '../ui/notebook-card';
import { Bar, LayoutIcon, Lines, Plus } from '../ui/primitives';
import { useTheme } from '../ui/theme';
import { notebook as NB, springs } from './physics';
import { blockTaps, tapAllowed, useStore, type NbCard } from './store';

const HEAD = 158;
type Rect = { x: number; y: number; w: number; h: number };

export function NotebookLayer() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { H, nbP, sheetK, actions, cards, setCards, tapBlockUntil } = useStore();
  const [open, setOpen] = useState(false);
  const [layout, setLayout] = useState<NotebookLayout>('grid');
  const [edit, setEdit] = useState(false);
  const editing = useSharedValue(false);
  const scroll = useSharedValue(0), maxScroll = useSharedValue(0), pull = useSharedValue(0);
  const rects = useRef(new Map<number, Rect>());
  const [dragId, setDragId] = useState<number | null>(null);

  useAnimatedReaction(() => nbP.value > 0.001, (v, p) => { if (v !== p) scheduleOnRN(setOpen, v); });
  useEffect(() => { editing.value = edit; }, [edit]);

  const to = (target: number, v = 0) => {
    'worklet';
    nbP.value = withSpring(target, { ...springs.notebook, velocity: v }, done => {
      if (done && target === 0) { scroll.value = 0; scheduleOnRN(setEdit, false); }
    });
  };
  useEffect(() => { actions.current.openNotebook = () => to(1); });

  const pan = usePanGesture({
    activeOffsetY: [-8, 8],
    failOffsetX: [-15, 15],
    onBegin: () => { 'worklet'; cancelAnimation(scroll); pull.value = 0; },
    onActivate: () => { 'worklet'; blockTaps(tapBlockUntil, true); },
    onFinalize: (_e, ) => { 'worklet'; if (tapBlockUntil.value > Date.now() + 1000) blockTaps(tapBlockUntil, false); },
    onUpdate: e => {
      'worklet';
      let d = e.changeY; const max = maxScroll.value;
      if (d > 0) {
        if (scroll.value > 0) { const u = Math.min(d, scroll.value); scroll.value -= u; d -= u; }
        if (d > 0) pull.value += d;
      } else if (d < 0) {
        if (pull.value > 0) { const u = Math.max(d, -pull.value); pull.value += u; d -= u; }
        if (d < 0 && scroll.value < max) scroll.value = Math.min(max, scroll.value - d);
      }
      nbP.value = 1 - pull.value / (H.value * NB.depth);
    },
    onDeactivate: e => {
      'worklet';
      if (pull.value > 0) {
        const close = pull.value > NB.closeDistance || e.velocityY > NB.velocity;
        pull.value = 0;
        to(close ? 0 : 1, -e.velocityY / (H.value * NB.depth));
        return;
      }
      scroll.value = withDecay({ velocity: -e.velocityY, clamp: [0, maxScroll.value] });
    },
  });

  const layerStyle = useAnimatedStyle(() => {
    // slides up with the finger like an app drawer
    const n = Math.min(nbP.value, 1);
    return {
      opacity: Math.min(1, n * 4),
      transform: [{ translateY: (1 - n) * H.value + sheetK.value * 8 }, { scale: 1 - 0.07 * sheetK.value }],
    };
  });
  const innerStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -scroll.value }] }));

  const rowW = useWindowDimensions().width - 36;
  // which card sits under a point (grid coordinates)
  const moveTo = (id: number, cx: number, cy: number) => {
    for (const [other, r] of rects.current) {
      if (other === id) continue;
      if (cx > r.x && cx < r.x + r.w && cy > r.y && cy < r.y + r.h) {
        setCards(cs => {
          const from = cs.findIndex(c => c.id === id), at = cs.findIndex(c => c.id === other);
          if (from < 0 || at < 0 || from === at) return cs;
          const next = [...cs]; const [m] = next.splice(from, 1); next.splice(at, 0, m); return next;
        });
        return;
      }
    }
  };

  if (!open) return null;
  return (
    <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 4 }, layerStyle]} accessibilityLabel="Notebook">
      <GestureDetector gesture={pan}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <View style={[st.head, { top: 54 + insets.top }]}>
            <View style={st.top}>
              <Pressable onPress={() => to(0)} hitSlop={5} accessibilityRole="button" accessibilityLabel="Fechar notebook"><CloseLook /></Pressable>
              <Bar w="34%" h={16} color={t.fg} />
              <View style={{ flex: 1 }} />
              <Pressable onPress={() => setEdit(e => !e)} hitSlop={4} accessibilityRole="button" accessibilityLabel="Reordenar cartões" accessibilityState={{ selected: edit }}
                style={[st.icon, { borderColor: t.line, backgroundColor: edit ? t.fg : t.card }]}>
                <Lines color={edit ? t.ink : t.fg} />
              </Pressable>
              <View style={[st.icon, { borderColor: t.line, backgroundColor: t.card }]} accessibilityElementsHidden><Plus color={t.fg} /></View>
            </View>
            <View style={st.bar}>
              <View style={[st.search, { borderColor: t.line, backgroundColor: t.card }]}>
                <View style={{ position: 'absolute', left: 14, top: 14, width: 13, height: 13, borderRadius: 7, borderWidth: 2, borderColor: t.boneStrong }} />
              </View>
              <View style={[st.tools, { borderColor: t.line, backgroundColor: t.card }]}>
                {NOTEBOOK_LAYOUTS.map(l => (
                  <Pressable key={l} onPress={() => setLayout(l)} style={[st.tool, layout === l && { backgroundColor: t.fg }]} accessibilityRole="button" accessibilityLabel={l} accessibilityState={{ selected: layout === l }}>
                    <LayoutIcon kind={l} color={layout === l ? t.ink : t.fg} />
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
          <View style={[st.body, { top: HEAD + insets.top }]}>
            <Animated.View style={[st.inner, innerStyle]}
              onLayout={e => { maxScroll.value = Math.max(0, e.nativeEvent.layout.height - (H.value - HEAD - insets.top)); }}>
              <View style={[st.grid, { gap: cardBox(layout, 0, rowW).gap }]}>
                {cards.map((c, i) => (
                  <Card key={c.id} card={c} seed={i} layout={layout} rowW={rowW} editing={editing} dragging={dragId === c.id}
                    onRect={r => rects.current.set(c.id, r)}
                    onLift={() => { setDragId(c.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); }}
                    onMove={(cx, cy) => moveTo(c.id, cx, cy)}
                    onDrop={() => { setDragId(null); tapBlockUntil.value = Date.now() + 300; }}
                    onOpen={() => { if (tapAllowed(tapBlockUntil)) actions.current.openSheet('g1'); }} />
                ))}
              </View>
            </Animated.View>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

type CardProps = {
  card: NbCard; seed: number; layout: NotebookLayout; rowW: number; editing: SharedValue<boolean>; dragging: boolean;
  onRect: (r: Rect) => void; onLift: () => void; onMove: (cx: number, cy: number) => void; onDrop: () => void; onOpen: () => void;
};

/** A card: tap opens the sheet; long press (or touch in edit mode) lifts it to reorder. */
function Card({ card, seed, layout, rowW, editing, dragging, onRect, onLift, onMove, onDrop, onOpen }: CardProps) {
  const look = useNotebookCardStyle();
  const box = cardBox(layout, card.kind, rowW);
  const tx = useSharedValue(0), ty = useSharedValue(0), lift = useSharedValue(0), lifted = useSharedValue(0);
  const ox = useSharedValue(0), oy = useSharedValue(0);       // layout origin in grid coordinates
  const adjX = useSharedValue(0), adjY = useSharedValue(0);   // keeps the card under the finger when its slot changes
  const w = useSharedValue(box.width), h = useSharedValue(box.height);

  const pan = usePanGesture({
    activateAfterLongPress: NB.longPressMs,   // D9
    manualActivation: editing,               // edit mode: activate on touch, no long press
    onTouchesDown: e => { 'worklet'; if (editing.value) GestureStateManager.activate(e.handlerTag); },
    onActivate: () => {
      'worklet';
      adjX.value = 0; adjY.value = 0;
      lift.value = withTiming(1, { duration: 150 });
      lifted.value = 1;
      scheduleOnRN(onLift);
    },
    onUpdate: e => {
      'worklet';
      tx.value = e.translationX + adjX.value; ty.value = e.translationY + adjY.value;
      scheduleOnRN(onMove, ox.value + w.value / 2 + tx.value, oy.value + h.value / 2 + ty.value);
    },
    onFinalize: () => {
      'worklet';
      if (!lifted.value) return;
      lifted.value = 0;
      lift.value = withTiming(0, { duration: 200 });
      tx.value = withSpring(0, springs.sheet); ty.value = withSpring(0, springs.sheet);
      scheduleOnRN(onDrop);
    },
  });

  const a = useAnimatedStyle(() => ({
    zIndex: lift.value > 0 ? 5 : 0,
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: 1 + 0.06 * lift.value }],
    shadowOpacity: 0.3 * lift.value,
  }));

  return (
    <Animated.View layout={dragging ? undefined : LinearTransition.duration(NB.reflowMs)}
      style={[{ width: box.width, height: box.height }, a]}
      onLayout={e => {
        const { x, y, width, height } = e.nativeEvent.layout;
        if (dragging) { adjX.value -= x - ox.value; adjY.value -= y - oy.value; tx.value -= x - ox.value; ty.value -= y - oy.value; }
        ox.value = x; oy.value = y; w.value = width; h.value = height;
        onRect({ x, y, w: width, h: height });
      }}>
      <GestureDetector gesture={pan}>
        <Pressable onPress={onOpen} style={[look, { flex: 1 }]} accessibilityRole="button" accessibilityLabel="Abrir cartão">
          <NotebookCardContent kind={card.kind} layout={layout} seed={seed} />
        </Pressable>
      </GestureDetector>
    </Animated.View>
  );
}

const st = StyleSheet.create({
  head: { position: 'absolute', left: 18, right: 18, gap: 14 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 2 },
  icon: { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  bar: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  search: { flex: 1, height: 44, borderRadius: 22, borderWidth: 1.5 },
  tools: { flexDirection: 'row', borderRadius: 23, borderWidth: 1.5 },
  tool: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  body: { position: 'absolute', left: 0, right: 0, bottom: 0, overflow: 'hidden' },
  inner: { paddingTop: 8, paddingHorizontal: 18, paddingBottom: 130 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
});
