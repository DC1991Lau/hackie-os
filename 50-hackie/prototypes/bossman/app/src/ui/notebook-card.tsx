/* UI — notebook cards and their 4 layouts. Diogo's file.
   kind 0 = image, 1 = text, 2 = icon. */
import { View } from 'react-native';
import { Bar, Placeholder } from './primitives';
import { useTheme } from './theme';

export const UI_NOTEBOOK_CARDS = [0, 1, 2, 0, 0, 1, 2, 0, 1, 0, 2, 0, 1, 0, 0, 2, 1, 0, 2, 0, 1];

export type NotebookLayout = 'grid' | 'cards' | 'list' | 'board';
export const NOTEBOOK_LAYOUTS: NotebookLayout[] = ['grid', 'cards', 'list', 'board'];

/** Card box size for a layout. `width` = available row width. */
export function cardBox(layout: NotebookLayout, kind: number, width: number) {
  if (layout === 'grid') { const w = (width - 20) / 3; return { width: w, height: w, gap: 10 }; }
  if (layout === 'cards') return { width: (width - 12) / 2, height: kind === 1 ? 130 : 190, gap: 12 };
  if (layout === 'list') return { width, height: 64, gap: 8 };
  return { width: (width - 16) / 3, height: kind === 1 ? 96 : kind === 2 ? 112 : 150, gap: 8 };
}

export function NotebookCardContent({ kind, layout, seed }: { kind: number; layout: NotebookLayout; seed: number }) {
  const t = useTheme();
  const w = (a: number, b: number) => `${a + ((seed * 37 + a) % (b - a))}%` as const;
  const list = layout === 'list';

  // image cards: the image fills the whole card, user + title sit on it with no background
  if (kind === 0 && !list) {
    const small = layout === 'grid' || layout === 'board';
    return (
      <>
        <Placeholder style={{ position: 'absolute', top: -8, left: -8, right: -8, bottom: -8 }} />
        <View style={{ marginTop: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: small ? 16 : 22, height: small ? 16 : 22, borderRadius: 11, borderWidth: 1.5, borderColor: t.line, backgroundColor: t.fill }} />
          <View style={{ flex: 1, gap: 5 }}><Bar w={w(45, 85)} strong h={small ? 7 : 9} />{!small && <Bar w={w(30, 60)} h={7} />}</View>
        </View>
      </>
    );
  }
  const top = kind === 0
    ? <Placeholder style={list ? { width: 42, height: 42, borderRadius: 9 } : { flex: 1, borderRadius: 9 }} />
    : kind === 2
      ? <View style={{ width: list ? 42 : 26, height: list ? 42 : 26, borderRadius: 21, borderWidth: 1.5, borderColor: t.line }} />
      : list ? <View style={{ width: 42, height: 42, borderRadius: 9, borderWidth: 1.5, borderStyle: 'dashed', borderColor: t.boneStrong }} /> : null;
  const rows = kind === 1 && layout !== 'grid'
    ? [<Bar key="a" w={w(55, 90)} strong h={9} />, <Bar key="b" w={w(50, 90)} h={7} />, <Bar key="c" w={w(30, 70)} h={7} />]
    : [<Bar key="a" w={w(45, 85)} strong h={9} />, <Bar key="b" w={w(30, 60)} h={7} />];
  return (
    <View style={{ flex: 1, flexDirection: list ? 'row' : 'column', alignItems: list ? 'center' : 'stretch', gap: list ? 12 : 8 }}>
      {top}
      <View style={{ gap: 6, marginTop: list ? 0 : 'auto', flex: list ? 1 : undefined }}>{rows}</View>
    </View>
  );
}

export function useNotebookCardStyle() {
  const t = useTheme();
  return { backgroundColor: t.card, borderWidth: 1.5, borderColor: t.line, borderRadius: 16, padding: 8, overflow: 'hidden' as const };
}
