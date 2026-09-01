# Hackie — Operating System

Workspace for running Hackie. Shared by Claude Code and Claude (Cowork).

## Who

Hackie is an AI-Native digital transformation practice, operated solo by **Diogo Costa**, based in Lisbon.
Tagline: **Your product. Our systems. Less noise. More impact.**

- **4 Pillars** (where we work): Experience · Growth · Efficiency · Education
- **3 Engines** (how a relationship moves): Pulse (diagnostic) → Studio (build) → Partner (ongoing)
- **9 services** — see `00-core/offering/services.md`
- Segments: SMEs & brands · professional services · IPSS / institutions

Full detail lives in `00-core/`. Never restate it here — point to it.

## Language

- **Structure in English** — folder names, file names, skills, commands, this file.
- **Content in Portuguese (European)** — documents, proposals, client deliverables.
- **Talk to Diogo in European Portuguese.**
- Proper nouns keep their real name: `iefp`, `seguranca-social`, `anexo-6`. Do not translate them.
- File names: kebab-case, no accents, no spaces.

## Map

| Path | What lives here |
|---|---|
| `00-core/` | **Single source of truth.** Identity, offering, market, brand. Nothing else duplicates this. |
| `00-core/public/` | ⚠️ Only material that is safe to send outside. Everything else in `00-core/` is internal. |
| `00-core/generated/` | Derived documents. **Never hand-edit** — see below. |
| `10-company/` | Hackie as a legal entity: IEFP application, tax, social security, finance, contracts. |
| `20-clients/` | One folder per client, copied from `_template/`. Engine folders mirror the lifecycle. |
| `30-sales/` | `pipeline.md`, proposals, sales material. |
| `40-operations/` | Playbooks, templates, checklists — how the work actually gets done. |
| `50-hackie/` | Hackie as its own client: website, growth, internal automations. |
| `60-education/` | Workshop and training material. |
| `90-log/` | `decisions/` (why we chose things) and `weekly/` (what happened). |
| `_inbox/` | Untriaged. Anything with no obvious home goes here, never loose in the root. |

## Rules

1. **One source, one place.** Facts about the offering, pricing or market live in `00-core/` only. Everywhere else links to it. If you find yourself copying a price into a second file, stop.
2. **`00-core/generated/` is output, not input.** `founding-document.md` and `.html` are assembled from the files in `foundation/`, `offering/` and `market/`. Edit the sources, never the output. The generator is not built yet, so these are a manual snapshot — `00-core/generated/README.md` tracks which sections are still in sync. Both files are **internal**: they carry full pricing and the competitor-naming Ecosystem, and are marked confidential throughout.
3. **Internal vs public.** Before anything leaves the workspace, check it is in `00-core/public/` or was written for that client. `market/ecosystem.md` names real competitors — it never goes out.
4. **Personal data is versioned, but only while the repo is private.** `10-company/` holds NIF, address and social-security data and **is** tracked in git (decision of 2026-09-01 — backup outweighed the risk). Two consequences: the remote must stay **private**, and nothing from `10-company/` gets copied into a folder that can leave the workspace. If the repo ever goes public, strip that history first.
5. **Clients are copies of `_template/`.** Do not invent a new shape per client.
6. **Decisions get written down.** A real choice — pricing, positioning, a tool, saying no to a client — gets a dated file in `90-log/decisions/`.
7. **Never sell hours.** Pricing reflects delivered value. Ranges are in `00-core/offering/pricing.md`; the practice is in the *Entrada* phase, so start at the low end of a band.

## Working with Diogo

- He operates solo. There is no team to delegate to — proposals about "the team" are wrong.
- Show the plan before moving or deleting files. He validates each step.
- Be direct. He would rather hear that something is over-engineered than have it built.
