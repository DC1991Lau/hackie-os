/* INTERACTION — where gestures may start (D10, D11).
   Drags that start in an OS edge are ignored; taps still work. */
export const EDGE = { top: 24, side: 24, bottom: 34 };

export type Frame = { width: number; height: number; insetTop: number; insetBottom: number };

export function inSystemEdge(x: number, y: number, f: Frame) {
  'worklet';
  return y < f.insetTop + EDGE.top || x < EDGE.side || x > f.width - EDGE.side || y > f.height - f.insetBottom - EDGE.bottom;
}
export function inTopThird(y: number, f: Frame) {
  'worklet';
  return y < f.height / 3;      // stories start zone
}
export function inBottomThird(y: number, f: Frame) {
  'worklet';
  return y > (f.height * 2) / 3; // notebook start zone
}
