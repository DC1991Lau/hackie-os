/* UI — pieces of the answer card (Cartão de resposta). Diogo's file. */
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bar, Placeholder } from './primitives';
import { useTheme } from './theme';

export function AskBubble({ len }: { len: number }) {
  const t = useTheme();
  const n = Math.min(2, Math.max(1, Math.ceil(len / 30)));
  return (
    <View style={{ alignSelf: 'flex-end', maxWidth: '80%', backgroundColor: t.fill, borderRadius: 16, borderBottomRightRadius: 6, paddingVertical: 11, paddingHorizontal: 14, gap: 6, alignItems: 'flex-end' }}>
      {Array.from({ length: n }, (_, i) => <Bar key={i} h={8} color={t.boneStrong} w={i === n - 1 ? Math.min(170, Math.max(50, 30 + len * 4)) : 170} />)}
    </View>
  );
}

export function Typing() {
  const t = useTheme();
  return <View style={{ flexDirection: 'row', gap: 5, padding: 4 }}>{[0, 1, 2].map(i => <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.boneStrong, opacity: 0.5 + i * 0.2 }} />)}</View>;
}

/** The reply. The first action circle saves the answer to the notebook. */
export function Reply({ seed, saved, onSave }: { seed: number; saved: boolean; onSave: () => void }) {
  const t = useTheme();
  const k = 3 + (seed % 4);
  return (
    <Animated.View entering={FadeInDown.duration(400)} style={{ gap: 14 }}>
      {seed % 2 === 0 && <Placeholder style={{ height: 120, borderRadius: 16 }} />}
      <View style={{ gap: 9 }}>
        {Array.from({ length: k }, (_, i) => <Bar key={i} h={9} color={t.boneStrong} w={i === k - 1 ? `${30 + ((seed * 7) % 30)}%` : `${82 + ((seed + i * 5) % 18)}%`} />)}
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable onPress={onSave} hitSlop={8} accessibilityRole="button" accessibilityLabel={saved ? 'Guardado no notebook' : 'Guardar no notebook'}
          style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: saved ? t.fg : t.bone, backgroundColor: saved ? t.fg : 'transparent' }} />
        <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: t.bone }} />
        <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: t.bone }} />
      </View>
    </Animated.View>
  );
}
