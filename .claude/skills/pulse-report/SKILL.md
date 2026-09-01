---
name: pulse-report
description: Run and write a Pulse — Hackie's diagnostic of a business's digital ecosystem. Load when preparing a Pulse session, analysing findings, or writing the Pulse report and roadmap.
---

# Pulse

The Pulse is Hackie's entry engine: a paid diagnostic of a business's digital ecosystem that ends in a prioritised roadmap. It qualifies fit before any larger commitment — for both sides.

Load `hackie-voice` for the writing. Pricing bands are in `00-core/offering/pricing.md`.

## What gets diagnosed

Walk all four pillars, even when the client only asked about one. The value of a Pulse is showing them the thing they did not ask about.

| Pillar | What to look at |
|---|---|
| **Experience** | Website: does it represent them, does it convert, is it maintained, who owns it. Client-facing systems and portals. |
| **Growth** | Organic visibility — Google and AI search. Content: is there any, is it structured, does it build authority. |
| **Efficiency** | Where the manual work is. Which tools they use and what sits *between* them. Duplicate data entry. Anything that lives in a single person's head. |
| **Education** | Who can actually operate what they have. What breaks when one person is away. AI literacy across the team. |

## The baseline to test against

`00-core/market/ecosystem.md` documents how the typical SME actually runs: 6–10 tools, nothing integrating them; client comms in email and WhatsApp; internal management in email and Excel; a static website; reporting done by hand. Use it as the reference pattern — then find where *this* client differs. The differences are the findings.

## Report structure

1. **O que encontrámos** — observations, no judgement. Concrete and specific: name the tool, the workflow, the page.
2. **Onde está o ruído** — the two or three things costing the most time or opportunity. Quantify where possible ("cerca de X horas por semana"), and say plainly when a number is an estimate.
3. **Roadmap priorizado** — each item with impact, effort, and pillar. Ordered by impact ÷ effort, not by how interesting it is to build.
4. **O que podes fazer sozinho** — at least two items they can do without Hackie. Non-negotiable. This is the value of client sovereignty made visible, and it is what makes the roadmap credible.
5. **Onde a Hackie entra** — the natural Studio project, scoped loosely. One paragraph, not a proposal.

## Rules

- **Never turn the report into a sales document.** The Pulse is paid work with standalone value. If they take the roadmap and execute it alone, that is a success.
- **Findings need evidence.** A screenshot, a page, a number, a quote from the session. No unsupported assertions.
- **Estimates are labelled as estimates.**
- **Roadmap items are outcomes**, not tasks. "Encomendas deixam de passar por email" — not "implementar formulário".
- Do not recommend a tool without saying what it replaces and who will operate it.

## Output

- `20-clients/<client>/10-pulse/report-<yyyy-mm>.md` — the deliverable.
- `20-clients/<client>/10-pulse/notes-<yyyy-mm-dd>.md` — raw session notes, internal.
- Update `20-clients/<client>/context.md` with the current state and the engine now active.
