/* UI — what the bottom sheet shows. Diogo's file. `accent` = the component that opened it. */
import { View } from 'react-native';
import { Bar, Dot, Placeholder } from './primitives';
import { useTheme } from './theme';

export function SheetContent({ accent: _accent }: { accent: string }) {
  const t = useTheme();
  return (
    <View style={{ gap: 14 }}>
      <Placeholder style={{ height: 190, borderRadius: 20 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 2 }}>
        <Dot />
        <View style={{ flex: 1, gap: 9 }}><Bar w="62%" strong /><Bar w="38%" /></View>
        <View style={{ width: 84, height: 40, borderRadius: 20, backgroundColor: t.fg }} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[70, 92, 60, 80].map(w => <View key={w} style={{ width: w, height: 34, borderRadius: 17, borderWidth: 1.5, borderColor: t.line }} />)}
      </View>
      {[70, 50, 64, 42, 58, 74, 46, 60].map((w, i) => (
        <View key={i} style={{ height: 68, borderRadius: 18, borderWidth: 1.5, borderColor: t.bone, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 14 }}>
          <Placeholder style={{ width: 40, height: 40, borderRadius: 10 }} />
          <View style={{ flex: 1, gap: 9 }}><Bar w={`${w}%`} strong /><Bar w={`${w - 20}%`} /></View>
        </View>
      ))}
      <Placeholder style={{ height: 150, borderRadius: 20 }} />
      <Placeholder style={{ height: 150, borderRadius: 20 }} />
    </View>
  );
}
