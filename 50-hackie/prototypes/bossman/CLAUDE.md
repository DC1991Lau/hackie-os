# Orb — mobile app

Workspace for building **Orb**, a mobile app driven by gestures and a floating 3D orb that opens an AI conversation as an overlay.
Owner: **Diogo Costa** (solo — there is no team; never propose work "for the team").

## Where we are

**Goal:** data organisation and data visualisation with good UX. **Deliverable:** a prototype with this interaction, plus a UI Diogo designs on top of it. Not a production app (`docs/decisions/2026-11-03-proposito.md`).

- **Native app (the thing we build now):** `app/` — Expo SDK 58, React Native, runs on Diogo's Android phone through Expo Go. Plan and milestones M0–M6: `docs/build-plan.md`.
  - `app/src/ui/` — **Diogo's UI layer** (theme tokens + component looks). He changes these freely.
  - `app/src/interaction/` — gestures, physics, zones. All springs/thresholds live in `physics.ts`.
  - Read `app/AGENTS.md` first: Expo changes every SDK — check the v58 docs, always `npx expo install`, run `npx tsc --noEmit` before calling a step done. Only Expo Go modules (no custom native code).
- **Web prototype v2 (behaviour reference):** `prototype/index.html` — the RN app must match its gestures and motion. Serve over HTTP, open at 390×844.
- v1 snapshot (frozen): `reference/orb-gesture-prototype.html`.
- UX spec: `docs/ux-spec.md` (§4 gesture map is v2).
- Review of v1: `docs/review.md`.
- Decisions: `docs/decisions/` (none pending).

**Current phase:** build in Expo, milestone by milestone (`docs/build-plan.md`). Diogo tests each milestone on his phone before the next starts.

## Language

- **Talk to Diogo in European Portuguese.**
- **Structure in English:** folder names, file names, code, components, commits, this file.
- **Content in Portuguese (European):** specs, decisions, reviews, UX copy.
- File names: kebab-case, no accents, no spaces.

## Vocabulary — use these names, always

Defined in `docs/ux-spec.md` §1. In short:
- **Views:** the main screens. Swipe left or right to change view.
- **Fundo:** the shared background that never moves.
- **Componentes:** the floating blocks inside a view.
- **Orb:** the floating 3D sphere that opens the conversation.
- **Input de texto:** the text field; the orb docks to its left.
- **Cartão de resposta:** the answer card above the input.
- **Modo stories:** opened by swiping down.
- **Bottom sheet:** opens to half when a component is tapped.
- **Full screen:** the sheet dragged to the top; it stops looking like a sheet.
- **Notebook:** card collection, opened by swiping up on the first view.
- **Cartões:** the items of the notebook.
- **Views do notebook:** the different ways the cards are organised.

In code, use English equivalents consistently: `View`, `Background`, `Orb`, `Composer`, `AnswerCard`, `Stories`, `Sheet`, `SheetFull`, `Notebook`, `NotebookCard`, `NotebookLayout`.

## Product rules (from Diogo — do not break without asking)

Full list in `docs/ux-spec.md` §3.
- **R1** — No text yet. Shapes only, until phase 4 lifts this.
- **R2** — Black and white, lo-fi, until high fidelity is approved.
- **R3** — Light and dark mode only.
- **R4** — Everything floats over the background.
- **R5** — Same background on every view; only components change.
- **R6** — The conversation is an overlay on the current screen; it never navigates away.
- **R7** — Closing is always possible with a swipe down, and there is always a visible close button, the same on every overlay.
- **R8** — Motion and interaction come first; content follows.

## Working rules

1. **Show the plan before building, moving or deleting.** Diogo validates each step.
2. **Keep interaction and UI apart.** Gestures, thresholds and motion live in `app/src/interaction/` (web: `prototype/interaction.*`) and follow `docs/decisions/2026-11-03-modelo-de-gestos.md`. Look and content live in `app/src/ui/` (web: `prototype/ui.*`). A UI change should never need an interaction change; if it does, say so.
3. **Decisions get written down.** Any real choice (stack, gesture rule, layout, scope cut) gets a dated file in `docs/decisions/` — see the README there.
4. **Mark your own choices.** When you fill a gap Diogo did not specify, say so and label it *(decisão)* in specs, as `docs/ux-spec.md` does.
5. **One aesthetic skill per phase.** Do not mix `frontend-design` with lo-fi work.
6. **Be direct.** Diogo would rather hear that something is over-engineered than have it built.

## Skills

Follow `docs/skills-plan.md`. External skills (from the Snyk article) are **not installed yet**.
Before installing any of them:
- read its `SKILL.md` and every script;
- show Diogo what it does;
- install only at project level (`.claude/skills/`).

| Phase | Skills |
|---|---|
| 1. Review | `design:design-critique`, `design:accessibility-review`, Vercel *web-design-guidelines*, *AccessLint* |
| 2. Decide | `product-management:product-brainstorming`, `product-management:write-spec` |
| 3. Foundations | *Bencium controlled-ux-designer*, Design System artifact, `design:design-system` |
| 4. Real screens | Design artifact (canvas), `design:ux-copy`, then *frontend-design* for hi-fi |
| 5. Build (Expo) | `code-review`, `run`; Vercel *react-native-skills* not installed (optional, review first) |
| ~~6. Validate~~ | Out of scope. |

## Known risks

Addressed in v2 (`docs/review.md`, `docs/decisions/2026-11-03-modelo-de-gestos.md`): start zones for stories and notebook, OS edge zones, visible alternatives, contrast and touch targets. Still open:
- Views have no scroll yet. When real content scrolls, stories and notebook must only start with the scroll at its end (rule D10, not yet coded).
- Not tested on a real phone, nor with VoiceOver or TalkBack.
- When Diogo changes greys in `ui.css`, re-check contrast (4.5:1 for text, 3:1 for UI strokes).

## Map

| Path | What lives here |
|---|---|
| `app/` | The Expo app. `src/ui/` is Diogo's layer, `src/interaction/` is the gesture engine. |
| `prototype/` | Web prototype v2 — behaviour reference for `app/`. |
| `docs/build-plan.md` | Expo build plan and milestones. |
| `reference/` | v1 snapshot, frozen. Do not edit. |
| `docs/ux-spec.md` | Experience spec: names, features, rules, gestures, open questions. |
| `docs/skills-plan.md` | Phase plan and which skills to combine. |
| `docs/decisions/` | Dated decisions and the list of open ones. |
