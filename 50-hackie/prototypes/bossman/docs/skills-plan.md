# Orb — plano de skills: do protótipo aos ecrãs reais

> **Âmbito reduzido (2026-11-03).** O Diogo quer um **protótipo com esta interação e uma UI que ele vai criando**, não uma app de produção (`docs/decisions/2026-11-03-proposito.md`).
> - As fases 1 e 2 estão feitas.
> - **As fases 5 e 6 ficam fora de âmbito.**
> - A fase 3 reduz-se ao que a UI precisar.
> - A fase 4 é o Diogo a desenhar a UI em `prototype/ui.css` e `prototype/ui.js`.
>
> O resto deste documento fica como histórico.

Ponto de partida:
- Protótipo: `reference/orb-gesture-prototype.html`
- Especificação de experiência: `docs/ux-spec.md`

Objetivo: rever o que foi construído e passar de um wireframe de gestos para ecrãs reais, sem perder as interações já validadas.

Legenda:
- 🟢 **instalada**: já existe neste workspace.
- 🟠 **a instalar**: skill externa (do artigo da Snyk). Rever o `SKILL.md` e os scripts antes de instalar.

---

## Resumo: as skills por fase

| Fase | Objetivo | Skills combinadas | Entregável |
|---|---|---|---|
| **0. Preparar** | Instalar as skills com segurança e decidir a stack | Revisão manual do `SKILL.md` e dos scripts | Skills em `.claude/skills/` e decisão de stack em `docs/decisions/` |
| **1. Rever** | Auditar o protótipo atual | 🟢 `design:design-critique` + 🟠 Vercel *Web Design Guidelines* + 🟠 *AccessLint* + 🟢 `design:accessibility-review` | Relatório de revisão com problemas por prioridade |
| **2. Decidir** | Fechar as questões de UX em aberto | 🟢 `product-management:product-brainstorming` → 🟢 `product-management:write-spec` | Especificação v2 e decisões registadas |
| **3. Fundações** | Design system e motion spec | 🟠 *Bencium controlled* (`DESIGN-SYSTEM-TEMPLATE` + `MOTION-SPEC`) + 🟢 artifact type **Design System** + 🟢 `design:design-system` (+ 🟠 *UI/UX Pro Max*, opcional) | Design system publicado e motion spec com valores reais |
| **4. Ecrãs reais** | Desenhar cada ecrã com conteúdo | 🟢 artifact type **Design** (canvas) + 🟢 `design:ux-copy` + 🟢 `hackie-voice`, depois 🟠 *Frontend Design* (alta fidelidade) | Canvas com todos os ecrãs, primeiro lo-fi com conteúdo e depois hi-fi |
| **5. Construir** | Passar a código de app | 🟠 Vercel *React Native Skills* + 🟠 Vercel *Composition Patterns* + 🟢 `code-review` | Componentes reais: orb, sheet, notebook, stories |
| **6. Validar** | Testar com pessoas e preparar a entrega | 🟢 `design:user-research` → 🟢 `design:research-synthesis` + 🟢 `design:design-handoff` + 🟢 `design:accessibility-review` | Plano de teste, conclusões e especificação de entrega |

Regra de combinação: **uma skill de estética por fase.**
- Até à fase 4 manda o lo-fi (regras R1 a R3 da especificação).
- A *Frontend Design* só entra quando o lo-fi estiver validado. Não se usa ao mesmo tempo que a `artifact-design`, porque as duas puxam a estética em direções diferentes.

---

## Fase 0 — Preparar

**O quê:**
1. Instalar ao nível do projeto (`.claude/skills/`):
   - *Bencium controlled-ux-designer*;
   - *AccessLint*;
   - Vercel *web-design-guidelines*.
2. Antes de instalar, ler cada `SKILL.md` e cada script. Atenção especial:
   - a **Bencium** tem licença não especificada;
   - o **UI/UX Pro Max** traz `scripts/search.py`.
3. **Decidir a stack**, que define as skills da fase 5:
   - **App nativa (React Native / Expo).** Os gestos, as molas e os sheets são o coração do produto, e é o caminho natural para eles. Skills: *React Native Skills* + *Composition Patterns*.
   - **Web app / PWA (React / Next.js).** Mais rápida de pôr em teste, mas os gestos do sistema no browser competem com os nossos. Skills: *React Best Practices* + *Composition Patterns*.

**Decisão do Diogo:** a stack. Registar em `docs/decisions/`.

---

## Fase 1 — Rever o protótipo

As quatro skills correm sobre o mesmo ficheiro e cada uma cobre um ângulo diferente.

| Skill | O que verifica neste protótipo |
|---|---|
| `design:design-critique` | Hierarquia, consistência entre ecrãs, se cada gesto é descobrível, se as transições contam a mesma história. |
| *Web Design Guidelines* | Áreas de toque, foco visível, `prefers-reduced-motion`, semântica, teclado. Resultado em `ficheiro:linha`. |
| *AccessLint* (`contrast-checker`, `use-of-color`) | Contraste dos cinzentos nos dois temas, e estados indicados só por tom de cinzento. |
| `design:accessibility-review` | WCAG 2.1 AA no conjunto, sobretudo as alternativas aos gestos. |

### Problemas que já espero encontrar

Isto é o que sei do código que escrevi. A revisão deve confirmar ou desmentir cada ponto.

1. **Gestos sem alternativa visível.**
   - O notebook (deslizar para cima) e os stories (deslizar para baixo) só abrem por gesto.
   - Reordenar só funciona com toque longo.
   - Falha a WCAG 2.5.1 e prejudica a descoberta.
2. **Conflito com o scroll.** Nos ecrãs reais as views vão ter conteúdo com scroll. Deslizar para baixo (stories) e para cima (notebook) vai chocar com esse scroll. É preciso uma regra, por exemplo: só abre quando o conteúdo está no topo, ou só a partir de uma zona definida.
3. **Conflito com os gestos do sistema.**
   - iOS e Android: deslizar a partir da borda de baixo vai para o ecrã inicial.
   - Android: deslizar a partir das bordas laterais é "voltar".
   - Deslizar a partir do topo abre as notificações.
   - Os nossos gestos têm de começar longe dessas bordas.
4. **Áreas de toque pequenas.** O X dos stories tem 34 px e os botões de vista do notebook têm 36×32 px. O mínimo é 44 px.
5. **Contraste.** As barras cinzentas claras (que vão passar a texto) ficam abaixo de 4,5:1 nos dois temas.
6. **Movimento reduzido.** Está só parcialmente tratado. Faltam as transições do sheet, dos stories e do notebook.
7. **O orb fica por cima do conteúdo** no fundo das listas (notebook e sheet). É preciso uma regra de espaço reservado.

**Entregável:** `docs/review.md`, com os problemas por prioridade (crítico, alto, médio). Depois, as correções no protótipo.

---

## Fase 2 — Decidir

Partir das 8 questões em aberto da especificação (secção 6) e dos problemas da fase 1.

1. `product-management:product-brainstorming`: explorar as opções de cada questão. Por exemplo: a conversa com ou sem histórico, e o que "organizar" quer dizer no notebook.
2. `product-management:write-spec`: fechar a especificação v2, com objetivos, o que fica de fora e critérios de aceitação por gesto.

**Decisões do Diogo:** uma por questão. Cada uma vai para `docs/decisions/` (ver `CLAUDE.md`).

**Entregável:** `docs/ux-spec.md` v2.

---

## Fase 3 — Fundações: design system e motion

| Passo | Skill | O quê |
|---|---|---|
| 1 | *Bencium controlled* — `DESIGN-SYSTEM-TEMPLATE.md` | Estrutura do sistema: tokens, componentes, estados. |
| 2 | *Bencium* — `MOTION-SPEC.md` | Converter os valores do protótipo numa especificação de motion (tabela abaixo). |
| 3 | artifact type **Design System** | Publicar o sistema numa página de referência com pré-visualizações reais. |
| 4 | `design:design-system` | Auditar: nomes, valores soltos no código, variantes em falta. |
| 5 | *UI/UX Pro Max* (opcional) | Lista de verificação para toque, interação e contraste claro/escuro. Não usar as paletas. |

**Componentes a documentar:** orb (repouso, a pensar, encostado à esquerda), input, cartão de resposta, componente de view, bottom sheet (meio, topo, full screen), story, cartão do notebook (4 vistas e estado levantado), indicador de view.

### Valores de motion já usados no protótipo (ponto de partida)

| Interação | Valor atual |
|---|---|
| Mudar de view | Mola (rigidez 300, amortecimento 33). Muda com arrasto acima de 20% da largura ou velocidade acima de 500 px/s. |
| Puxar stories | 260 px até abrir; abre a partir de 42% ou de 700 px/s. |
| Abrir o notebook | 42% da altura do ecrã; abre a partir de 35% ou de 700 px/s. |
| Bottom sheet | Pontos de encaixe: fechado, 50% e topo. Mola (380, 36). Projeção da velocidade: 0,2 s. |
| Full screen | Margem 8 → 0 px e cantos 34 → 0 px, a acompanhar o arrasto. |
| Fechar a deslizar para baixo | Acima de 110–120 px ou de 700–800 px/s. |
| Story | 4,5 s por story. Toque longo de 200 ms para pausar. |
| Reordenar | Toque longo de 320 ms para levantar. Os outros cartões reorganizam-se em 300 ms. |
| Orb para a esquerda e input | 550–600 ms, curva `cubic-bezier(.2,.9,.25,1)`. |

**Entregável:** design system publicado e `docs/motion-spec.md`.

---

## Fase 4 — Ecrãs reais

1. **Definir o conteúdo de cada ecrã.** O que é cada view, que tipos de cartão existem no notebook, de onde vêm os stories e o que o cartão de resposta mostra. Isto sai da fase 2.
2. **Canvas de ecrãs** (artifact type **Design**): todos os ecrãs e estados lado a lado, ainda a preto e branco, mas com conteúdo real.
3. **Texto**: aqui termina a regra R1 (sem texto).
   - `design:ux-copy` para a microcopy;
   - `hackie-voice`, se o produto for da Hackie e a skill existir neste projeto.
4. **Alta fidelidade**: só depois de o lo-fi com conteúdo estar validado. *Frontend Design* para a identidade visual, aplicada sobre os tokens da fase 3 (troca valores, não estrutura).

**Entregável:** canvas lo-fi com conteúdo, depois canvas hi-fi.

---

## Fase 5 — Construir

| Skill | Papel |
|---|---|
| *React Native Skills* | Gestos e animações a 60 fps (só `transform` e `opacity`), sheets, listas, safe areas. |
| *Composition Patterns* | API dos componentes: `<Sheet>`, `<Sheet.Full>`, `<Orb>`, `<Notebook.Layout>`, sem pilhas de props booleanas. |
| `code-review` | Rever cada componente antes de avançar. |
| `run` | Correr a app e confirmar que cada gesto funciona como no protótipo. |

**Ordem de construção** (do esqueleto para o resto):
1. views e fundo;
2. bottom sheet;
3. orb, input e cartão de resposta;
4. stories;
5. notebook.

O protótipo HTML continua como referência de comportamento.

---

## Fase 6 — Validar e entregar

| Skill | O quê |
|---|---|
| `design:user-research` | Plano de teste de usabilidade (5–6 pessoas), centrado na descoberta dos gestos. |
| `design:research-synthesis` | Tirar padrões e prioridades dos testes. |
| `design:accessibility-review` | Auditoria final, já na app real. |
| `design:design-handoff` | Especificação final: estados, medidas, motion, casos-limite. |

---

## Próximo passo imediato

Começar pela **fase 1**, com as duas skills já instaladas:
- `design:design-critique`;
- `design:accessibility-review`.

Entretanto, instalo e reviro as três skills externas da fase 0. Assim a revisão começa já e não fica à espera da instalação.
