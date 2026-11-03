/* INTERACTION — shared state between layers.
   Shared values drive animation on the UI thread; `actions` lets one layer
   open another (e.g. a component opens the sheet) without prop drilling. */
import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import { type SharedValue, useSharedValue } from 'react-native-reanimated';
import { UI_NOTEBOOK_CARDS } from '../ui/notebook-card';

export type Actions = {
  openSheet: (accent: string) => void;
  openStories: () => void;
  openNotebook: () => void;
  openChat: (fromStory?: boolean) => void;
  goToView: (i: number) => void;
};

export type NbCard = { id: number; kind: number };

type Store = {
  W: SharedValue<number>;
  H: SharedValue<number>;
  insetTop: SharedValue<number>;
  insetBottom: SharedValue<number>;
  sheetK: SharedValue<number>;   // 0 closed, 0.6 half, 1 full screen
  stP: SharedValue<number>;      // stories openness, 0..1
  stDragY: SharedValue<number>;  // stories drag-to-close
  nbP: SharedValue<number>;      // notebook openness, 0..1
  chatOpen: SharedValue<number>;
  chatTop: SharedValue<number>;  // conversation opened from a story sits above it
  pagerPos: SharedValue<number>; // current view position (fractional while paging)
  tapBlockUntil: SharedValue<number>; // a drag must not also count as a tap on what is under the finger
  actions: React.MutableRefObject<Actions>;
  cards: NbCard[];
  setCards: React.Dispatch<React.SetStateAction<NbCard[]>>;
};

const Ctx = createContext<Store | null>(null);
const noop = () => {};

export function StoreProvider({ children }: { children: ReactNode }) {
  const actions = useRef<Actions>({ openSheet: noop, openStories: noop, openNotebook: noop, openChat: noop, goToView: noop });
  const [cards, setCards] = useState<NbCard[]>(() => UI_NOTEBOOK_CARDS.map((kind, id) => ({ id, kind })));
  const store: Store = {
    W: useSharedValue(390), H: useSharedValue(844), insetTop: useSharedValue(0), insetBottom: useSharedValue(0),
    sheetK: useSharedValue(0), stP: useSharedValue(0), stDragY: useSharedValue(0), nbP: useSharedValue(0),
    chatOpen: useSharedValue(0), chatTop: useSharedValue(0), pagerPos: useSharedValue(0), tapBlockUntil: useSharedValue(0),
    actions, cards, setCards,
  };
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside StoreProvider');
  return s;
}

export const clamp = (v: number, a: number, b: number) => {
  'worklet';
  return Math.max(a, Math.min(b, v));
};
export const rubber = (d: number, dim: number) => {
  'worklet';
  return Math.sign(d) * (1 - 1 / ((Math.abs(d) * 0.55) / dim + 1)) * dim;
};

/** Call when a drag activates / finishes; check `tapAllowed` before handling a tap. */
export const blockTaps = (v: SharedValue<number>, active: boolean) => {
  'worklet';
  v.value = active ? Number.MAX_SAFE_INTEGER : Date.now() + 300;
};
export const tapAllowed = (v: SharedValue<number>) => Date.now() > v.value;
