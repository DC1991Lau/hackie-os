/* UI — lo-fi building blocks (R1: shapes only, no text). Diogo's file. */
import { StyleSheet, View, type ViewStyle, type StyleProp, type DimensionValue } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { useTheme } from './theme';

/** A text bar: `strong` = primary text, otherwise secondary. */
export function Bar({ w, strong, h, color }: { w: DimensionValue; strong?: boolean; h?: number; color?: string }) {
  const t = useTheme();
  return <View style={{ width: w, height: h ?? (strong ? 13 : 10), borderRadius: 6, backgroundColor: color ?? (strong ? t.boneStrong : t.bone) }} />;
}

export function Dot({ size = 44 }: { size?: number }) {
  const t = useTheme();
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: t.fill, borderWidth: 1.5, borderColor: t.line }} />;
}

/** Image placeholder: grey box with a cross. */
export function Placeholder({ style }: { style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <View style={[{ backgroundColor: t.fill, overflow: 'hidden' }, style]}>
      <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
        <Line x1="0" y1="0" x2="100" y2="100" stroke={t.boneStrong} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
        <Line x1="100" y1="0" x2="0" y2="100" stroke={t.boneStrong} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
      </Svg>
    </View>
  );
}

/** Card surface shared by view components and notebook cards. */
export function useCardStyle(): ViewStyle {
  const t = useTheme();
  return {
    backgroundColor: t.card, borderWidth: 1.5, borderColor: t.line, borderRadius: 22,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: 10 }, elevation: 3,
  };
}

/* ---------- icons ---------- */
export function ChevronDown({ color }: { color: string }) {
  return <View style={{ width: 10, height: 10, marginTop: -4, borderRightWidth: 2, borderBottomWidth: 2, borderColor: color, transform: [{ rotate: '45deg' }] }} />;
}
export function ChevronUp({ color }: { color: string }) {
  return <View style={{ width: 14, height: 14, marginTop: 8, borderLeftWidth: 2, borderTopWidth: 2, borderColor: color, transform: [{ rotate: '45deg' }] }} />;
}
export function Plus({ color }: { color: string }) {
  return (
    <View style={{ width: 14, height: 14 }}>
      <View style={{ position: 'absolute', top: 6, width: 14, height: 2, backgroundColor: color }} />
      <View style={{ position: 'absolute', left: 6, width: 2, height: 14, backgroundColor: color }} />
    </View>
  );
}
export function Lines({ color, w = 14 }: { color: string; w?: number }) {
  return (
    <View style={{ width: w, height: 10, justifyContent: 'space-between' }}>
      {[0, 1, 2].map(i => <View key={i} style={{ height: 2, backgroundColor: color }} />)}
    </View>
  );
}
/** Notebook layout icons: grid, cards, list, board. */
export function LayoutIcon({ kind, color }: { kind: 'grid' | 'cards' | 'list' | 'board'; color: string }) {
  const p = { stroke: color, strokeWidth: 1.8, fill: 'none', rx: 1 } as const;
  return (
    <Svg width={18} height={18} viewBox="0 0 20 20">
      {kind === 'grid' && [2.5, 8, 13.5].flatMap(y => [2.5, 8, 13.5].map(x => <Rect key={`${x}${y}`} x={x} y={y} width={4} height={4} {...p} />))}
      {kind === 'cards' && <><Rect x={2.5} y={2.5} width={6.5} height={15} {...p} rx={2} /><Rect x={11} y={2.5} width={6.5} height={15} {...p} rx={2} /></>}
      {kind === 'list' && [3, 8, 13].map(y => <Rect key={y} x={2.5} y={y} width={4} height={4} {...p} />)}
      {kind === 'list' && [5, 10, 15].map(y => <Line key={`l${y}`} x1={9} y1={y} x2={17.5} y2={y} stroke={color} strokeWidth={1.8} />)}
      {kind === 'board' && <><Rect x={2.5} y={2.5} width={4} height={15} {...p} /><Rect x={8} y={2.5} width={4} height={10} {...p} /><Rect x={13.5} y={2.5} width={4} height={12.5} {...p} /></>}
    </Svg>
  );
}
