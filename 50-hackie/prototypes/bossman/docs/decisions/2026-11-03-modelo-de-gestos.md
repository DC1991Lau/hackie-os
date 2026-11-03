# D4, D5, D7, D9, D10, D11 e D12 — Modelo de gestos v2 *(decisão)*

- Data: 2026-11-03
- Estado: decidido (decisões de interação, delegadas pelo Diogo)

## Contexto
A revisão da fase 1 (`docs/review.md`, G1–G7 e A3) mostrou quatro problemas:
- deslizar para baixo faz duas coisas opostas (abrir e fechar);
- os gestos chocam com o scroll e com os gestos do sistema;
- metade das funcionalidades só existe por gesto;
- com a PWA (D1), os conflitos com o sistema pesam ainda mais.

As 7 decisões formam um único modelo, por isso ficam juntas neste ficheiro.

## Decisões

**D11 — Zonas reservadas ao sistema.** Um gesto que comece a menos de **24 px** do topo, a menos de **24 px** dos lados ou a menos de **34 px** do fundo (somados à safe area) é ignorado pela app.

**D10 — Zonas de partida e scroll:**
- **Stories:** o arrasto para baixo tem de começar no **terço de cima** do ecrã, abaixo da zona do sistema, e o conteúdo da view tem de estar no topo do scroll.
  - Os sheets, a conversa e o notebook fecham com gestos que começam mais abaixo, por isso deixa de ser possível abrir os stories sem querer depois de fechar alguma coisa.
- **Notebook:** o arrasto para cima tem de começar no **terço de baixo**, acima da zona do sistema, e o scroll tem de estar no fim (ou a view não ter scroll).
- **Em todos os casos**, o scroll esgota-se primeiro e só depois o gesto passa ao nível seguinte. É a regra que o sheet já usa.

**D4 — O notebook abre a partir de todas as views**, e não só da primeira. Com as zonas de partida da D10, deixa de chocar com o scroll, e fica mais simples: o mesmo gesto faz o mesmo em todo o lado.

**D5 — A partir do full screen, deslizar para baixo leva sempre ao sheet a meio.** Mesmo um gesto rápido para no meio. Para fechar, faz-se um segundo gesto.

**D7 — O orb fica visível sobre o sheet** (a meio e em full screen), para se poder perguntar sobre o que se está a ver. **Nos stories fica escondido**, e o campo de resposta do story abre a conversa (ver `2026-11-03-stories-origem.md`).

**D9 — Para reordenar, o toque longo passa de 320 ms para 400 ms.** Com 320 ms, um scroll lento levanta cartões sem querer. No Android há vibração; no iOS, só feedback visual (ver D1).

**D12 — Alternativas visíveis aos gestos:**

| Funcionalidade | Gesto | Alternativa visível |
|---|---|---|
| Mudar de view | Deslizar para os lados | Os pontos passam a ser clicáveis, com área de toque de 44 px |
| Stories | Deslizar para baixo, no terço de cima | Tocar na pega do topo (`.pull-hint`, área de 44 px) |
| Notebook | Deslizar para cima, no terço de baixo | Tocar na seta acima dos pontos (área de 44 px) |
| Full screen | Puxar o sheet para cima | Tocar na pega do sheet alterna entre meio e full screen |
| Reordenar | Toque longo e arrastar | Botão "editar" no cabeçalho do notebook: os cartões ganham uma pega e podem ser arrastados sem toque longo |
| Fechar | Deslizar para baixo | Botão de fecho **igual em todos os overlays**: círculo com seta para baixo, em cima à esquerda |

## Porquê
- Cada gesto passa a ter um sítio de partida claro, e por isso deixa de ser ambíguo.
- As alternativas visíveis resolvem ao mesmo tempo a descoberta dos gestos e a WCAG 2.5.1.

## Consequências
- A R7 passa a dizer: "fechar é sempre possível a deslizar para baixo, e há sempre um botão de fecho visível".
- O X dos stories passa a ser o mesmo botão de fecho dos outros overlays.
- **Aplicado** em `prototype/` (v2), a 2026-11-03. A `reference/` fica com a v1.
- **App Expo (2026-11-03):**
  - As views passaram a ter scroll, a pedido do Diogo. A regra completa da D10 está no código: o scroll gasta-se primeiro, e os stories só abrem com o scroll no topo e o notebook só com o scroll no fim.
  - **O notebook abre como a gaveta de apps do Android**, também a pedido do Diogo: sobe agarrado ao dedo, 1:1 com a altura do ecrã, e abre a partir de 25% ou de 700 px/s. Antes era um *fade* com 42% de profundidade.
- **Desvio:** a conversa só fecha a deslizar para baixo fora do cartão quando o cartão tem scroll. Dentro do cartão, o gesto faz scroll.
