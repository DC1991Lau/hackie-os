/* ============================================================
   INTERACTION — every spring and threshold in one place.
   Values come from the web prototype (docs/skills-plan.md, phase 3 table)
   and the v2 gesture model (docs/decisions/2026-11-03-modelo-de-gestos.md).
   Reanimated's withSpring uses the same stiffness/damping model, mass 1.
   ============================================================ */
export const springs = {
  pager:  { stiffness: 300, damping: 33 },
  sheet:  { stiffness: 380, damping: 36 },
  storiesPull: { stiffness: 280, damping: 30 },
  storiesClose: { stiffness: 200, damping: 26 },
  cube:   { stiffness: 260, damping: 32 },
  notebook: { stiffness: 240, damping: 28 },
} as const;

export const pager = { distance: 0.2, velocity: 500, projection: 0.2, parallax: 90 };
export const sheet = { half: 0.5, projection: 0.2, maxVelocity: 3000, inset: 8, radius: 34 };
export const stories = { pull: 260, open: 0.42, velocity: 700, closeDistance: 120, closeVelocity: 800, slideMs: 4500, holdMs: 200 };
// depth 1 = the notebook follows the finger 1:1 over the full screen height, like an app drawer
export const notebook = { depth: 1, open: 0.25, velocity: 700, closeDistance: 110, longPressMs: 400, reflowMs: 300 };
export const chat = { closeDistance: 110, closeVelocity: 700, dockMs: 600 };
export const axisSlop = 8;   // px before a drag picks its axis
