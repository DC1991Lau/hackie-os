/* ============================================================
   UI — design tokens. Diogo's file: change freely.
   Same values as prototype/ui.css. Contrast checked in docs/review.md §A2:
   boneStrong = text (4.5:1), bone = UI strokes (3:1).
   ============================================================ */
import { useColorScheme } from 'react-native';

const light = {
  ink: '#ffffff',        // screen background
  sheet: '#ffffff',
  card: '#ffffff',
  fg: '#111111',         // strong text / icons
  line: '#111111',       // outlines
  fill: '#f0f0f0',
  bone: '#8a8a8a',
  boneStrong: '#6b6b6b',
  grid: 'rgba(0,0,0,0.09)',
  veil: 'rgba(255,255,255,0.80)',
  scrim: 'rgba(0,0,0,0.35)',
  shadow: 'rgba(0,0,0,0.18)',
  g1: '#111111', g2: '#555555', g3: '#8f8f8f', g4: '#c8c8c8',
  orb: { hi: '#ffffff', mid: '#6e6e6e', base: '#1c1c1c', rim: '#000000', ground: 'rgba(0,0,0,0.38)' },
};

const dark: typeof light = {
  ink: '#000000',
  sheet: '#0d0d0d',
  card: '#0d0d0d',
  fg: '#f2f2f2',
  line: '#f2f2f2',
  fill: '#1a1a1a',
  bone: '#686868',
  boneStrong: '#8a8a8a',
  grid: 'rgba(255,255,255,0.10)',
  veil: 'rgba(0,0,0,0.80)',
  scrim: 'rgba(0,0,0,0.6)',
  shadow: 'rgba(0,0,0,0.6)',
  g1: '#f2f2f2', g2: '#b5b5b5', g3: '#7a7a7a', g4: '#454545',
  orb: { hi: '#ffffff', mid: '#f4f4f4', base: '#ababab', rim: '#4d4d4d', ground: 'rgba(255,255,255,0.22)' },
};

export const radius = { card: 22, sheet: 34, answer: 26 };

export type Theme = typeof light;
export const themes = { light, dark };
export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}
