/* ============================================================
   UI — the 4 Views = 4 data patterns (docs/decisions/2026-11-03-views.md).
   Diogo's file: change layout and looks freely. Views scroll vertically,
   so add as much content as you like.

   Contract: build each View with the `C` component you receive.
   <C accent depth style>…</C> is one tappable floating component:
   interaction adds the tap (opens the sheet), the press scale and the
   parallax. `depth` 0..1 = how much it lags while paging.
   ============================================================ */
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Bar, Dot, Placeholder, useCardStyle } from './primitives';
import { useTheme } from './theme';

export type ComponentSlot = (p: { accent: string; depth: number; style?: StyleProp<ViewStyle>; children?: ReactNode }) => ReactNode;

export const VIEW_COUNT = 4;

/** Image that fills the whole card, with the user + title on top (no background). */
function ImageCard({ title = '55%', sub, dot = 28 }: { title?: `${number}%`; sub?: `${number}%`; dot?: number }) {
  return (
    <>
      <Placeholder style={StyleSheet.absoluteFill} />
      <View style={s.caption}>
        <Dot size={dot} />
        <View style={{ flex: 1, gap: 7 }}><Bar w={title} strong />{sub && <Bar w={sub} />}</View>
      </View>
    </>
  );
}

export function ViewContent({ index, C }: { index: number; C: ComponentSlot }) {
  const t = useTheme();
  const card = [useCardStyle(), { overflow: 'hidden' as const }];
  const chev = <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: t.bone }} />;
  const chip = <View style={{ width: 46, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: t.line }} />;
  const pill = (accent: string, depth: number, w: `${number}%`) => (
    <C accent={accent} depth={depth} style={[card, s.pill]}><Dot size={36} /><View style={{ flex: 1 }}><Bar w={w} strong /></View>{chev}</C>
  );
  const squares = (a: string, b: string, d: number) => (
    <View style={s.row2}>
      <C accent={a} depth={d} style={[card, s.sq]}><Dot /><View style={{ gap: 9 }}><Bar w="70%" strong /><Bar w="45%" /></View></C>
      <C accent={b} depth={d + 0.18} style={[card, s.sq]}><Dot /><View style={{ gap: 9 }}><Bar w="60%" strong /><Bar w="80%" /></View></C>
    </View>
  );

  if (index === 0) return ( // Destaque
    <>
      <C accent="g1" depth={0.12} style={[card, s.hero]}><ImageCard title="55%" sub="80%" /></C>
      {squares('g2', 'g3', 0.4)}
      {pill('g4', 0.85, '55%')}
      <C accent="g2" depth={0.3} style={[card, s.hero]}><ImageCard title="45%" sub="65%" /></C>
      {squares('g1', 'g4', 0.5)}
      {pill('g3', 0.7, '40%')}
    </>
  );

  if (index === 1) return ( // Lista
    <>
      <View style={{ gap: 9, paddingHorizontal: 4, paddingTop: 6 }}><Bar w="42%" strong /><Bar w="24%" /></View>
      {[[62, 40], [48, 70], [70, 35], [55, 60], [40, 52], [66, 44], [52, 58], [74, 38], [45, 62], [58, 50]].map(([a, b], i) => (
        <C key={i} accent={['g1', 'g2', 'g3', 'g4'][i % 4]} depth={0.15 + (i % 5) * 0.17} style={[card, s.row]}>
          <Dot /><View style={{ flex: 1, gap: 9 }}><Bar w={`${a}%`} strong /><Bar w={`${b}%`} /></View>{chip}
        </C>
      ))}
    </>
  );

  if (index === 2) { // Mural
    const tile = (accent: string, depth: number, tall: boolean, title: `${number}%`) => (
      <C accent={accent} depth={depth} style={[card, tall ? s.tall : s.short]}><ImageCard title={title} dot={22} /></C>
    );
    return (
      <>
        <View style={s.row2}>
          <View style={s.col}>{tile('g3', 0.15, true, '75%')}{tile('g4', 0.5, false, '60%')}{tile('g1', 0.3, true, '55%')}</View>
          <View style={s.col}>{tile('g2', 0.3, false, '65%')}{tile('g1', 0.65, true, '80%')}{tile('g3', 0.45, false, '50%')}</View>
        </View>
        <C accent="g1" depth={0.9} style={[card, s.wide]}>
          <View style={{ flexDirection: 'row' }}>
            {[t.g1, t.g2, t.g3].map((c, i) => <View key={i} style={{ width: 40, height: 40, borderRadius: 20, marginRight: -12, borderWidth: 3, borderColor: t.card, backgroundColor: c }} />)}
          </View>
          <View style={{ flex: 1, gap: 9, marginLeft: 16 }}><Bar w="60%" strong /><Bar w="35%" /></View>
        </C>
        <View style={s.row2}>
          <View style={s.col}>{tile('g2', 0.2, false, '70%')}{tile('g4', 0.55, true, '45%')}</View>
          <View style={s.col}>{tile('g1', 0.35, true, '60%')}{tile('g3', 0.6, false, '55%')}</View>
        </View>
      </>
    );
  }

  const stats = (d: number) => (
    <View style={[s.row2, { gap: 12 }]}>
      {['g4', 'g2', 'g1'].map((a, i) => (
        <C key={a} accent={a} depth={d + i * 0.2} style={[card, s.stat]}>
          <View style={{ gap: 9 }}><Bar w="70%" strong /><Bar w="45%" /></View>
          <View style={s.spark}>{[40, 70, 55, 90, 65].map((h, j) => <View key={j} style={{ flex: 1, height: `${(h + i * 13) % 100 || 30}%`, borderRadius: 3, backgroundColor: t.boneStrong }} />)}</View>
        </C>
      ))}
    </View>
  );
  return ( // Indicadores
    <>
      <C accent="g3" depth={0.15} style={[card, s.ring]}>
        <Svg width={170} height={170} viewBox="0 0 140 140" style={{ transform: [{ rotate: '-90deg' }] }}>
          <Circle cx={70} cy={70} r={54} stroke={t.bone} strokeWidth={16} fill="none" />
          <Circle cx={70} cy={70} r={54} stroke={t.g1} strokeWidth={16} fill="none" strokeLinecap="round" strokeDasharray="120 400" />
          <Circle cx={70} cy={70} r={54} stroke={t.g2} strokeWidth={16} fill="none" strokeLinecap="round" strokeDasharray="70 400" strokeDashoffset={-136} />
          <Circle cx={70} cy={70} r={54} stroke={t.g3} strokeWidth={16} fill="none" strokeLinecap="round" strokeDasharray="60 400" strokeDashoffset={-222} />
        </Svg>
      </C>
      {stats(0.4)}
      {pill('g2', 0.95, '48%')}
      {stats(0.3)}
      {pill('g1', 0.6, '62%')}
    </>
  );
}

const s = StyleSheet.create({
  hero: { height: 230 },
  caption: { position: 'absolute', left: 16, right: 16, bottom: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  row2: { flexDirection: 'row', gap: 14 },
  sq: { flex: 1, aspectRatio: 1, padding: 16, justifyContent: 'space-between' },
  pill: { height: 72, borderRadius: 36, paddingLeft: 18, paddingRight: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  row: { height: 76, borderRadius: 24, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  col: { flex: 1, gap: 14 },
  tall: { height: 220 },
  short: { height: 130 },
  wide: { height: 96, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center' },
  ring: { height: 260, alignItems: 'center', justifyContent: 'center' },
  stat: { flex: 1, height: 130, paddingVertical: 14, paddingHorizontal: 12, justifyContent: 'space-between' },
  spark: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 46 },
});
