# Gerado — não editar à mão

Os ficheiros nesta pasta são **derivados**. São montados a partir das fontes em:

- `00-core/foundation/` — manifesto, visão/missão/valores, overview
- `00-core/offering/` — business model, serviços, pricing
- `00-core/market/` — ecosystem

**O gerador ainda não existe** (fase 5). Até lá são um snapshot manual. Não os edites
— a alteração perde-se na primeira geração. Para mudar o documento fundacional,
muda a fonte.

---

## Estado do snapshot

Verificado a 2026-09-01, secção a secção contra as fontes.

| Secção | Fonte | Estado |
|---|---|---|
| 1. Manifesto | `foundation/manifesto.md` | ✅ em sincronia |
| 2. Visão, Missão e Valores | `foundation/vision-mission-values.md` | ✅ em sincronia |
| 3. Overview | `foundation/overview.md` | ⚠️ **desatualizada** — a fonte foi reduzida a uma capa com apontadores (2026-09-01) |
| 4. Serviços | `offering/services.md` | ✅ em sincronia |
| 5. Business Model | `offering/business-model.md` | ✅ em sincronia |
| 6. Pricing | `offering/pricing.md` | ✅ em sincronia |
| 7. Ecosystem | `market/ecosystem.md` | ✅ em sincronia |

Fora a secção 3, o snapshot é fiável — a única diferença face às fontes são os
títulos de capítulo e os rodapés por documento, substituídos por marcação ao nível
do documento inteiro.

---

## Confidencialidade

Este documento é **interno**. Contém a tabela completa de pricing e a versão
interna do Ecosystem, que nomeia concorrentes reais. Está marcado como tal no
cabeçalho e rodapé do `.md`, e na capa e barra lateral do `.html`.

Quando o gerador existir, uma variante pública tem de:

- usar `00-core/public/ecosystem-public.md` em vez de `market/ecosystem.md`
- omitir a secção de Pricing por inteiro
- sair com outro nome de ficheiro, nunca por cima deste
