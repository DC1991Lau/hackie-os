# Orb — mobile app

Workspace for building **Orb**, a mobile app driven by gestures and a floating 3D orb that opens an AI conversation as an overlay.
Owner: **Diogo Costa** (solo — there is no team; never propose work "for the team").

## Where we are

The project starts from a **working lo-fi prototype** of motion and interactions, built in a previous session.
Nothing in it is final content or visual identity. It exists to validate gestures.

- Prototype (behaviour reference): `reference/orb-gesture-prototype.html`. Open it in a browser at phone width.
- UX spec (source of truth for the experience): `docs/ux-spec.md`
- Skills plan, phase by phase: `docs/skills-plan.md`
- Decisions and open questions: `docs/decisions/`

**Current phase: 1 — review the prototype.** See `docs/skills-plan.md`.

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
- **R7** — Closing is always a swipe down (sheet, full screen, stories, notebook).
- **R8** — Motion and interaction come first; content follows.

## Working rules

1. **Show the plan before building, moving or deleting.** Diogo validates each step.
2. **The prototype is the behaviour reference.** When building real screens, match its gestures, thresholds and motion values (`docs/skills-plan.md`, phase 3 table) unless a decision changes them.
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
| 5. Build | Vercel *react-native-skills*, Vercel *composition-patterns*, `code-review`, `run` |
| 6. Validate | `design:user-research`, `design:research-synthesis`, `design:design-handoff` |

## Known risks to carry into real screens

Detailed in `docs/skills-plan.md`, phase 1.
- Gestures conflict with scrollable content (swipe down → stories, swipe up → notebook).
- Gestures conflict with OS gestures (bottom-edge home, Android side-edge back, top-edge notifications).
- Some features are gesture-only with no visible alternative.
- Grey contrast and touch target sizes are below WCAG in the prototype.

## Map

| Path | What lives here |
|---|---|
| `reference/` | The lo-fi prototype. Read-only reference; do not grow it into the product. |
| `docs/ux-spec.md` | Experience spec: names, features, rules, gestures, open questions. |
| `docs/skills-plan.md` | Phase plan and which skills to combine. |
| `docs/decisions/` | Dated decisions and the list of open ones. |
| `app/` | The real app, created in phase 5 once the stack is decided. |
