---
name: client-proposal
description: Build a commercial proposal for a Hackie prospect — scoping, structure, pricing and the follow-up. Load when writing or revising a proposal, quote, or scope document.
---

# Client proposal

Load `hackie-voice` alongside this. Prices come from `00-core/offering/pricing.md` — never from memory.

## Before writing

Answer these. If any is unknown, ask Diogo rather than guessing.

- Which **segment**? SME/brand · professional services · IPSS/institution
- Which **engine** is being sold? Pulse, Studio, or Partner
- Which **pillars** does the work touch? Experience · Growth · Efficiency · Education
- What is the **noise** — the specific thing costing them time or money today?
- What does **success** look like in their words, not ours?
- Has a Pulse been done? If not, and the ask is large, propose the Pulse first.

## Structure

1. **O que ouvimos** — their situation in their language. No solution yet. This is the section that wins or loses the proposal.
2. **O que propomos** — the engine and the pillars, named. What gets built.
3. **Como funciona** — phases with rough duration. No hourly breakdown.
4. **O que fica contigo** — what they own at the end: system, data, documentation, the ability to operate it. This is Hackie's differentiator; do not omit it.
5. **Investimento** — one number or a tight range. Payment terms.
6. **Próximo passo** — one concrete action with a date.

Keep it under four pages. A long proposal reads as uncertainty.

## Pricing discipline

- Pull the band from `00-core/offering/pricing.md`.
- The practice is in the **Entrada** phase — no visible portfolio yet. Start at the **low end** of the band.
- Partner: minimum 3 months. Annual commitment gets 10–15% off.
- Never itemise hours. If the client asks for a day rate, reframe on scope and outcome.
- If the scope does not fit a band, say so and propose a Pulse to define it.

## The Pulse-first rule

A Studio project sold without a diagnostic is how scope creep starts. When the ask is vague, large, or the fit is uncertain, propose the Pulse as a low-commitment entry (€300–€800 depending on context) and state plainly that its cost can be credited into the Studio project if they proceed.

## Selectivity

"Poucos, bem servidos" is a value, not a slogan. If the project cannot be defended with integrity — wrong fit, unrealistic budget, a client who wants a vendor rather than a partner — the right output is a short, warm decline, not a padded proposal. Draft the decline instead and tell Diogo why.

## Output

Write to `30-sales/proposals/<client>-<engine>-<yyyy-mm>.md`.
Once the prospect becomes a client, the folder moves to `20-clients/<client>/` and the proposal is copied into the matching engine folder.
Update `30-sales/pipeline.md` in the same pass — a proposal that is not in the pipeline does not exist.
