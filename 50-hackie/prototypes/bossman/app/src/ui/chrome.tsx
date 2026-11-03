/* UI — small controls shared by every layer: close button, handles, hint arrow, status bar. Diogo's file. */
import { View } from 'react-native';
import { ChevronDown, ChevronUp } from './primitives';
import { useTheme } from './theme';

/** The same close button on every overlay (R7): circle with a down chevron. */
export function CloseLook() {
  const t = useTheme();
  return (
    <View style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, borderColor: t.line, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center' }}>
      <ChevronDown color={t.fg} />
    </View>
  );
}

export function HandleLook({ width = 40 }: { width?: number }) {
  const t = useTheme();
  return <View style={{ width, height: 5, borderRadius: 3, backgroundColor: t.boneStrong }} />;
}

export function NotebookHintLook() {
  const t = useTheme();
  return <ChevronUp color={t.boneStrong} />;
}

export function FakeStatusBar() {
  const t = useTheme();
  const bar = (w: number) => <View style={{ width: w, height: 10, borderRadius: 6, backgroundColor: t.fg }} />;
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      {bar(42)}
      <View style={{ flexDirection: 'row', gap: 6 }}>{bar(18)}{bar(16)}{bar(26)}</View>
    </View>
  );
}
