/* UI — stories, grouped by theme (docs/decisions/2026-11-03-stories-origem.md). Diogo's file. */
import { StyleSheet, View } from 'react-native';
import { Bar, Placeholder } from './primitives';
import { useTheme } from './theme';

/** Number of slides per theme; one cube face per theme. */
export const STORY_GROUPS = [3, 2, 4, 3, 2];

const mix = (a: string, b: string, k: number) => {
  const p = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v * k + y[i] * (1 - k))).join(',')})`;
};

export function StorySlide({ group, slide }: { group: number; slide: number }) {
  const t = useTheme();
  const tone = (6 + ((group * 3 + slide * 5) % 5) * 4) / 100;
  const v = (group + slide) % 3;
  const ring = { position: 'absolute' as const, borderRadius: 999, borderWidth: 1.5, borderColor: t.line, backgroundColor: t.card };
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: mix(t.fg, t.ink, tone) }]}>
      {v === 0 && <><View style={[ring, { width: 260, height: 260, top: '26%', alignSelf: 'center' }]} /><View style={[ring, { width: 70, height: 70, right: 40, top: '18%' }]} /></>}
      {v === 1 && <><Placeholder style={{ position: 'absolute', left: '14%', right: '14%', top: '20%', height: '46%', borderRadius: 24, borderWidth: 1.5, borderColor: t.line, transform: [{ rotate: '-4deg' }] }} /><View style={[ring, { width: 84, height: 84, right: 24, top: '58%' }]} /></>}
      {v === 2 && (
        <View style={{ position: 'absolute', left: 40, right: 40, top: '22%', flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {[0, 1, 2, 3].map(i => <Placeholder key={i} style={{ width: '46%', aspectRatio: 1, borderRadius: 18, borderWidth: 1.5, borderColor: t.line }} />)}
        </View>
      )}
      <View style={{ position: 'absolute', left: 24, bottom: 120, width: '62%', gap: 10 }}>
        <Bar w={`${60 + ((group * 7 + slide * 11) % 30)}%`} h={14} color={t.fg} />
        <Bar w={`${35 + ((group * 5 + slide * 3) % 25)}%`} h={11} color={t.boneStrong} />
      </View>
    </View>
  );
}

/** The row under the progress bars: theme icon + title bars (the close button is added by interaction). */
export function StoryHeader({ group }: { group: number }) {
  const t = useTheme();
  return (
    <>
      <View style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: t.fg, backgroundColor: t.fill }} />
      <Bar w={70 + ((group * 13) % 40)} h={10} color={t.fg} />
      <Bar w={28} h={10} color={t.boneStrong} />
    </>
  );
}
