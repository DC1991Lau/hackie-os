# O protótipo só recebe correções, não funcionalidades novas

- Data: 2026-11-03
- Estado: decidido

## Contexto
Há duas instruções em tensão:
- o `CLAUDE.md` diz que `reference/` é só de leitura ("do not grow it into the product");
- o `skills-plan.md` põe "as correções no protótipo" como entregável da fase 1.

## Opções
1. Não tocar no protótipo. Os problemas ficam só descritos em `docs/review.md`.
2. Corrigir bugs e acessibilidade sem mudar gestos, limiares nem motion.
3. Corrigir tudo o que a revisão aponta, incluindo o modelo de gestos.

## Decisão
Opção 2.

## Porquê
- Um protótipo que não abre bem num telemóvel (sem meta viewport) não serve de referência. Corrigir isso não o transforma em produto.
- Mudar o modelo de gestos (como se abrem os stories, as zonas do sistema, o fecho do full screen) é decisão do Diogo (D5, D7, D10, D11, D12). Não deve entrar escondido numa correção.

## Consequências
- Correções permitidas: doctype e viewport, áreas de toque, tokens de contraste, lacunas do movimento reduzido e semântica (`docs/review.md`, §7).
- Os valores de motion da tabela da fase 3 (`docs/skills-plan.md`) não mudam.
- O `CLAUDE.md` mantém `reference/` como só de leitura para tudo o resto.
