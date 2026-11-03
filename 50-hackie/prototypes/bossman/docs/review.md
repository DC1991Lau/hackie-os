# Orb — revisão do protótipo (fase 1)

- Data: 2026-11-03
- Ficheiro revisto: `reference/orb-gesture-prototype.html`
- Teste: browser a 390×844, tema escuro e tema claro.
- Skills usadas:
  - `design:design-critique`;
  - `web-design-guidelines` (regras da Vercel);
  - `design:accessibility-review`;
  - cálculo de contraste WCAG por script, em vez do AccessLint (ver `docs/decisions/2026-11-03-contraste-sem-accesslint.md`).

Níveis:
- 🔴 **crítico**: impede usar o protótipo como referência, ou bloqueia pessoas;
- 🟠 **alto**: tem de estar resolvido antes dos ecrãs reais;
- 🟡 **médio**: resolver na fase 3 ou na fase 5.

Referências de código: `reference/orb-gesture-prototype.html:<linha>`.
Os itens marcados *(decisão)* são escolhas minhas e precisam de validação.

---

## 1. Resumo

| | 🔴 Crítico | 🟠 Alto | 🟡 Médio |
|---|---|---|---|
| Protótipo (bugs) | 1 | — | 2 |
| Modelo de gestos | — | 4 | 3 |
| Acessibilidade | 1 | 3 | 3 |

Os 3 itens mais importantes:
1. **O ficheiro não tem `<!doctype>`, `<meta viewport>` nem `lang`.** Aberto num telemóvel, a página fica com 980 px de largura e mostra a moldura em miniatura. Tal como está, não serve de referência num telemóvel real.
2. **Deslizar para baixo está sobrecarregado.** Nas views abre os stories; em todos os outros ecrãs fecha. Além disso, choca com o gesto "puxar para atualizar" e com o painel de notificações.
3. **Metade das funcionalidades só existe por gesto.** Mudar de view, stories, notebook, full screen e reordenar não têm alternativa visível nem acesso por teclado. Falha a WCAG 2.5.1 e 2.1.1.

---

## 2. O que funciona bem

- **A física é consistente.** Todas as transições usam a mesma mola, herdam a velocidade do dedo e podem ser interrompidas a meio (`anim.stop()` no `pointerdown`, `:470`, `:557`). É isto que faz o protótipo parecer nativo.
- **O eixo é decidido aos 8 px** (`:379`). Gestos horizontais e verticais não se misturam.
- **O sheet resolve bem o conflito com o scroll:** primeiro o conteúdo volta ao topo e só depois o sheet desce (`:564-566`). É o modelo a seguir para as views com scroll (ver G2).
- **Há efeito elástico nas pontas**, nas views e nos stories (`:482`, `:715`). Dá a perceber que se chegou ao fim.
- **O Escape fecha os overlays pela ordem certa** (`:857-860`).
- **O teclado virtual é tido em conta** (`visualViewport` → `--kb`, `:626-629`). O input e o cartão de resposta sobem com ele.
- **O movimento reduzido está tratado na física.** Com `prefers-reduced-motion`, `spring()` salta logo para o valor final (`:347`), e o reordenar e o momentum também respeitam a preferência.
- **As regras R1 a R8 são respeitadas.** Não há texto visível (só `aria-label`), as cores são só preto, branco e cinzentos, e tudo flutua sobre o fundo.

---

## 3. Os 7 problemas esperados: confirmados ou não

| # | Problema esperado (`skills-plan.md`) | Veredito | Detalhe |
|---|---|---|---|
| 1 | Gestos sem alternativa visível | **Confirmado, e há mais casos** | Ver A3. Além do notebook, dos stories e do reordenar, também mudar de view (os pontos têm `pointer-events:none`, `:117`) e passar a full screen só funcionam por gesto. |
| 2 | Conflito com o scroll | **Confirmado (para os ecrãs reais)** | Hoje as views não fazem scroll (`overflow:hidden`, `:68`). Qualquer arrasto vertical é capturado para stories ou notebook (`:475-476`). Ver G2. |
| 3 | Conflito com os gestos do sistema | **Confirmado** | `gesture()` aceita um toque inicial em qualquer ponto (`:363`), sem zonas excluídas. No teste, os stories abriram com um arrasto a começar em y≈30 px, que é a zona das notificações. Ver G3. |
| 4 | Áreas de toque pequenas | **Confirmado, e há mais casos** | Ver A4. Há 8 elementos abaixo de 44 px, e não apenas os 2 previstos. |
| 5 | Contraste | **Confirmado; o tema claro é pior** | Ver A2. `--bone-strong` tem 2,81:1 no tema claro e nem chega aos 3:1. |
| 6 | Movimento reduzido incompleto | **Em parte desmentido** | O sheet, os stories e o notebook já respeitam a preferência, porque a mola salta. O que falta são as animações em CSS da conversa e do orb. Ver A6. |
| 7 | O orb por cima do conteúdo | **Em parte desmentido** | O fim das listas já está reservado: 150 px nas views (`:68`) e 130 px no notebook (`:256`). O orb esconde-se sobre o sheet (`:446-448`). Só fica um caso, durante o scroll do notebook. Ver G7. |

---

## 4. Problemas do protótipo (bugs)

### P1 🔴 Faltam o doctype, o charset, a viewport e o `lang`
- `:1`: o ficheiro começa em `<title>`.
- Sem `<meta name="viewport">`, um telemóvel usa 980 px de largura. A regra `@media (min-width:560px)` (`:43`) é então aplicada e aparece a moldura do telemóvel em ponto pequeno. Isto contradiz o comentário da `:3`.
- Sem doctype, o browser entra em modo *quirks*.
- **Correção:** acrescentar `<!doctype html>`, `<html lang="pt-PT">`, `<meta charset="utf-8">` e `<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">`.
- Nota: o artifact publicado provavelmente não sofre disto, porque é embrulhado num esqueleto com viewport. O ficheiro local sofre.

### P2 🟡 Animações que mexem no layout
- O orb anima `left` (`:122`), o input anima `bottom` (`:167`) e o cartão de resposta anima `height` (`:149`).
- O sheet muda `left`, `right`, `height` e `border-radius` em cada frame durante a passagem a full screen (`:522-524`).
- Num browser isto chega, mas na fase 5 (React Native) tem de passar a `transform`/`opacity`.
- **Ação:** o `motion-spec.md` da fase 3 deve descrever estes movimentos em termos de transformação (posição e escala), não de propriedades de layout.

### P3 🟡 Não há safe areas
- O orb está a 28 px do fundo (`:121`), o input a 34 px (`:164`) e a barra de estado é falsa (`:293`). Não se usa `env(safe-area-inset-*)`.
- Funciona por coincidência num iPhone sem botão. Na app real, estas medidas passam a "safe area + margem".

---

## 5. Modelo de gestos (crítica de design)

### G1 🟠 Deslizar para baixo faz duas coisas opostas
- Nas views, deslizar para baixo **abre** os stories. Em todos os outros ecrãs **fecha** (conversa, sheet, full screen, stories, notebook).
- Um utilizador que feche um sheet com um gesto um pouco longo, ou que feche duas coisas seguidas, entra nos stories sem querer.
- Também colide com dois hábitos fortes:
  - **puxar para atualizar** (iOS e Android, em qualquer lista);
  - **o painel de notificações**, quando o gesto começa no topo.
- **Recomendação:** os stories devem abrir a partir de um ponto de partida claro e não de qualquer sítio do ecrã. Por exemplo, só quando o arrasto começa na zona da pega `.pull-hint` (já existe, `:64`), ou a partir de um elemento visível (uma fila de círculos, como no Instagram). Liga-se a D10 e a D12.

### G2 🟠 As views com scroll vão roubar o gesto
- Hoje as views não têm scroll, por isso o conflito ainda não se vê.
- Com conteúdo real, deslizar para baixo (stories) e para cima (notebook) só pode funcionar quando a lista está no topo, seguindo o modelo que o sheet já usa (`:564-566`).
- **Recomendação *(decisão)*:** usar a regra do sheet. Primeiro o scroll esgota-se e só depois o gesto passa ao nível seguinte. Os stories só abrem com o scroll no topo, e o notebook só com o scroll no fim ou a partir da zona dos pontos. → D10.

### G3 🟠 Não há zonas reservadas aos gestos do sistema
- Os três choques:
  - **topo:** abre as notificações, mas no protótipo abre os stories;
  - **fundo:** home no iOS e no Android, mas no protótipo o gesto natural para abrir o notebook começa precisamente aí;
  - **laterais:** "voltar" no Android, mas no protótipo muda de view.
- **Recomendação *(decisão)*:** ignorar gestos que comecem a menos de 24 px do topo e dos lados, e a menos de 34 px do fundo. O notebook passa a abrir a partir da zona dos pontos ou do orb, que fica acima da barra de home. → D11.

### G4 🟠 Cada ecrã fecha de maneira diferente
- O deslizar para baixo é comum a todos, mas o fecho visível muda de ecrã para ecrã:

| Ecrã | Fecho visível |
|---|---|
| Sheet a meio | Nenhum (toque fora) |
| Full screen | Seta, em cima à esquerda (`:188`) |
| Stories | X, em cima à direita (`:225`) |
| Notebook | Nenhum |
| Conversa | Tocar no orb ou tocar fora |

- **Recomendação:** um único padrão de fecho, com a mesma forma e o mesmo canto em todos os ecrãs. Serve também de alternativa ao gesto (A3).

### G5 🟡 Um gesto rápido no full screen fecha o sheet de vez
- A projeção da velocidade (`:572-573`) pode saltar o ponto do meio. No teste, um arrasto rápido fechou o sheet.
- O pedido (§5.6) diz "volta ao sheet a meio". Hoje o que se vê depende da velocidade, o que torna o comportamento difícil de prever.
- **Recomendação *(decisão)*:** a partir do full screen, o destino máximo de um gesto é o meio. Para fechar, faz-se outro gesto. → D5.

### G6 🟡 O orb não se comporta da mesma forma em todo o lado
- Esconde-se sobre o sheet e os stories (`:446-448`), mas fica visível no notebook.
- Se o orb é "a conversa sobre o que estou a ver", o normal é ficar visível em todo o lado, ou em lado nenhum.
- **Recomendação:** decidir em D7. Eu manteria o orb visível sobre o sheet, porque é onde há conteúdo sobre o qual perguntar.

### G7 🟡 O orb fica por cima dos cartões no scroll do notebook
- O fim da lista já tem espaço reservado (`:256`). Durante o scroll, os cartões passam por baixo do orb, e um toque nessa zona vai para o orb (z-index 5, acima do notebook, que tem 4).
- **Recomendação:** é aceitável, mas a área de toque do orb deve ser só a esfera (68 px), sem a sombra. Na app real, os cartões não devem ter ações críticas nesse canto.

### Observações menores (sem nível)
- Deslizar para cima nas views 2 a 4 não faz nada e não dá feedback (`:476`). Se o notebook continuar só na primeira view (D4), um pequeno elástico ajudaria a perceber que ali não há nada.
- Na primeira view, a grande imagem do topo puxa mais o olhar do que o orb. No lo-fi não é grave, mas nos ecrãs reais convém confirmar que o orb continua a ser o elemento principal.
- No tema claro, as barras cinzentas quase desaparecem sobre a grelha de pontos. Ver A2.

---

## 6. Acessibilidade (WCAG 2.1 AA)

### A1 🔴 Não há acesso por teclado nem por leitor de ecrã ao que não é o orb
- Só há 4 elementos focáveis: o orb, o input, o botão de enviar e os botões de vista do notebook. Há 40 componentes e cartões clicáveis feitos com `<div>`, sem `role` nem `tabindex` (`:405`, `:755`).
- O fecho do full screen e o X dos stories são `<span>` (`:324`, `:645`).
- O sheet, os stories e o notebook não têm `role="dialog"` nem gestão de foco (`:300`, `:322`, `:328`).
- A resposta aparece sem `aria-live` (`:313`), e o leitor de ecrã não a anuncia.
- Critérios: 2.1.1, 4.1.2 e 4.1.3.
- **Correção:**
  - usar `<button>` para componentes, cartões, o fecho e o X;
  - usar `role="dialog"` e `aria-modal` nos overlays, com o foco a entrar e a voltar ao elemento de origem;
  - pôr `aria-live="polite"` no cartão de resposta.
- Na app nativa, o equivalente são as propriedades `accessibilityRole`, `accessibilityLabel` e `accessibilityActions`.

### A2 🟠 Contraste dos tokens

As barras cinzentas representam texto futuro: `--bone-strong` = texto principal e `--bone` = texto secundário. Também são usadas em elementos de interface essenciais: a pega do sheet (`:191`), a seta do notebook (`:235`), a pega dos stories (`:64`) e os círculos de ação da resposta (`:158`).

| Token | Uso | Tema claro (sobre `--card`) | Tema escuro (sobre `--card`) | Exigido |
|---|---|---|---|---|
| `--fg` | texto forte | 18,9:1 ✅ | 17,4:1 ✅ | 4,5:1 |
| `--g2` | acento | 7,5:1 ✅ | 9,5:1 ✅ | 4,5:1 |
| `--g3` | acento | 3,2:1 ❌ texto, ✅ UI | 4,5:1 ✅ | 4,5 / 3:1 |
| `--bone-strong` | texto principal futuro, pegas, seta | **2,8:1** ❌ | 4,3:1 ❌ (por pouco) | 4,5:1 |
| `--bone` | texto secundário futuro, círculos de ação | **1,45:1** ❌ | **1,54:1** ❌ | 4,5 / 3:1 |
| `--g4` | acento | 1,7:1 ❌ | 2,0:1 ❌ | 3:1 |

Sobre `--fill` (`#f0f0f0` / `#1a1a1a`) todos os valores ficam cerca de 12% piores.

**Valores propostos *(decisão)*.** Mantêm o aspeto lo-fi e passam no `--card` e no `--fill`:

| Token | Claro: atual → proposto | Escuro: atual → proposto |
|---|---|---|
| `--bone-strong` (texto) | `#9a9a9a` → `#6b6b6b` (5,3:1 / 4,7:1) | `#777777` → `#8a8a8a` (5,6:1 / 5,0:1) |
| `--bone` (UI, 3:1) | `#d6d6d6` → `#8a8a8a` (3,5:1 / 3,0:1) | `#333333` → `#686868` (3,5:1 / 3,1:1) |

- O `--bone` tem duas funções: é texto secundário e também é preenchimento decorativo (por exemplo, as barras de fundo dos stories).
- Na fase 3 deve dividir-se em dois tokens: `--text-2`, que cumpre 4,5:1, e `--bone`, decorativo, que não precisa de contraste.

### A3 🟠 Funcionalidades só por gesto (2.5.1, 2.1.1)

| Funcionalidade | Gesto | Alternativa hoje | Proposta |
|---|---|---|---|
| Mudar de view | Deslizar para os lados | Nenhuma (os pontos não são clicáveis, `:117`) | Pontos clicáveis, com área de 44 px |
| Abrir os stories | Deslizar para baixo | Nenhuma | Elemento visível (ver G1) |
| Abrir o notebook | Deslizar para cima | Nenhuma (a seta `:235` não é clicável) | Tornar a seta um botão |
| Full screen | Puxar o sheet para cima | Nenhuma | Tocar na pega alterna entre meio e topo |
| Reordenar | Toque longo e arrastar | Nenhuma | Modo "editar" com setas ou arrasto a partir de uma pega |
| Mudar de pessoa nos stories | Deslizar para os lados | Parcial (tocar avança até ao fim do grupo) | Aceitável |
| Fechar | Deslizar para baixo | Parcial (ver G4) | Fecho único, sempre visível |

→ D12.

### A4 🟠 Áreas de toque abaixo de 44 px (2.5.5)

| Elemento | Tamanho | Linha |
|---|---|---|
| Ações da resposta | 28×28 | `:158` |
| `.chev` dos componentes | 28×28 | `:85` |
| Ícones do rodapé dos stories | 30×30 | `:230` |
| X dos stories | 34×34 | `:225` |
| Botões de vista do notebook | 36×32 | `:250` |
| `+` do notebook | 36×36 | `:243` |
| Fecho do full screen | 38×38 | `:188` |
| Enviar | 42×42 | `:170` |

**Correção:** manter o tamanho visual e alargar a área de toque com `padding` ou um pseudo-elemento de 44×44. A pega do sheet tem 30 px de altura (`:190`), mas ocupa a largura toda, por isso está aceitável.

### A5 🟡 Os stories avançam sozinhos e só se pausam com o dedo (2.2.2)
- Os stories avançam a cada 4,5 s (`:632`). A pausa só existe enquanto se mantém o dedo no ecrã (`:706`), e não há pausa por teclado nem com o leitor de ecrã.
- **Correção:** pausar quando o leitor de ecrã está ativo ou quando o movimento reduzido está ligado, e usar Espaço para pausar.

### A6 🟡 Movimento reduzido: o que falta
Já está tratado: as molas (`:347`), o reordenar (`:776`, `:813`), o momentum e as flutuações (`:283`).

Falta tratar:
- a pulsação do orb enquanto pensa, `.orb.think .sphere` (`:135`). A regra da `:283` desliga a animação do `.orb`, mas não a da `.sphere`;
- os três pontos do "a escrever" (`:160`);
- a entrada das linhas da resposta (`:155-157`) e a transição do cartão de resposta (`:149`);
- a deslocação do orb para a esquerda (`:122`);
- o cubo 3D dos stories durante o arrasto (`:661`). Com movimento reduzido, deve passar a um fade.

### A7 🟡 O zoom com dois dedos está bloqueado (1.4.4)
- `touch-action:none` em toda a `.device` (`:42`) é necessário para os gestos, mas impede o zoom com dois dedos.
- No protótipo é aceitável. Na app nativa, a alternativa é respeitar o tamanho de letra do sistema (Dynamic Type no iOS, escala de fonte no Android), e isso tem de estar no design system da fase 3.

---

## 7. Correções propostas ao protótipo

Âmbito: só correções, sem novas funcionalidades e sem mudar os valores de motion. Ver `docs/decisions/2026-11-03-ambito-correcoes-prototipo.md`.

| Ordem | Correção | Itens | Muda o comportamento? |
|---|---|---|---|
| 1 | Doctype, charset, viewport, `lang` | P1 | Não. Passa a funcionar num telemóvel. |
| 2 | Áreas de toque de 44 px | A4 | Não |
| 3 | Tokens de contraste | A2 | Só os tons de cinzento |
| 4 | Lacunas do movimento reduzido | A6 | Só com a preferência ligada |
| 5 | Semântica: `button`, `dialog`, `aria-live` | A1 | Não |

Ficam de fora até haver decisão: G1, G2, G3, G5, G6 e A3. Mudam o modelo de gestos e dependem de D5, D7, D10, D11 e D12.

---

## 8. Decisões que esta revisão pede ao Diogo

| Decisão | Pergunta | A minha recomendação |
|---|---|---|
| **D10 + D12** | Como se abrem os stories? | A partir de um ponto de partida claro (a pega no topo ou uma fila de círculos), não de qualquer arrasto para baixo. Só com o scroll no topo. |
| **D11** | Que zonas ficam reservadas ao sistema? | 24 px em cima e dos lados, 34 px em baixo. O notebook abre acima da barra de home. |
| **D5** | O full screen pode fechar de uma vez? | Não. O destino máximo é o sheet a meio. |
| **D7** | O orb fica visível sobre os sheets? | Sim sobre os sheets, não sobre os stories. |

---

## 9. Notas sobre o processo

- A skill `web-design-guidelines` **já está instalada** no repositório Hackie (`Hackie/.claude/skills/web-design-guidelines`), mas não ao nível do projeto Orb. O `skills-plan.md` ainda a marca como 🟠 a instalar. A cada execução vai buscar as regras a `raw.githubusercontent.com/vercel-labs/web-interface-guidelines`.
- Muitas regras da Vercel não se aplicam a um wireframe sem texto (tipografia, i18n, formulários). Não as listei.
- Não testei com VoiceOver nem com TalkBack. A1 foi verificado no código e na lista de elementos focáveis. A confirmação com leitor de ecrã fica para a fase 6, já na app real.

---

## 10. Correções aplicadas (2026-11-03)

As 5 correções da §7 foram feitas em `reference/orb-gesture-prototype.html`. Os gestos, os limiares e os valores de motion não mudaram. Os números de linha das secções anteriores referem-se à versão **anterior** às correções.

| Correção | O que mudou |
|---|---|
| P1 | `<!doctype html>`, `lang="pt-PT"`, `charset`, `viewport` com `viewport-fit=cover`. A 390 px, o ecrã passa a ocupar o telemóvel inteiro e o browser já não entra em modo *quirks*. |
| A4 | O botão de enviar, o X dos stories e os botões de vista do notebook passam a medir 44×44 px. O fecho do full screen (38 px) e o `+` ganham uma área de toque invisível à volta. A pesquisa do notebook passa a ter 44 px de altura, e o corpo do notebook desce 8 px para caber. |
| A2 | Tema claro: `--bone-strong` `#6b6b6b`, `--bone` `#8a8a8a`. Tema escuro: `--bone-strong` `#8a8a8a`, `--bone` `#686868`. |
| A6 | Com o movimento reduzido ligado, desligam-se a pulsação do orb, os pontos do "a escrever", a entrada das linhas da resposta e as transições do cartão e do orb. Nos stories, o cubo 3D passa a um fade. |
| A1 | Componentes e cartões com `role="button"` e `tabindex="0"`, que abrem com Enter ou Espaço. O fecho do full screen e o X dos stories passam a `<button>`. O sheet e os stories estão marcados como `role="dialog"`. Com o sheet aberto, o resto do ecrã fica `inert`; o foco entra no sheet e volta ao componente de origem ao fechar. Só a view visível recebe foco. As setas ← e → mudam de view. Um aviso só para o leitor de ecrã anuncia "A pensar…" e "Resposta pronta.". |

**Testado no browser a 390×844:**
- tocar num componente, sheet, full screen, botão de voltar a meio, fechar com toque fora;
- stories e X;
- notebook e mudança de vista;
- teclado: Enter abre o sheet, Escape fecha e devolve o foco, as setas mudam de view;
- os dois temas;
- sem erros na consola.

**Não testado:** VoiceOver e TalkBack, e um telemóvel real.

**O que continua por fazer** (depende de decisões): G1, G2, G3, G5, G6 e o resto de A3. Os stories e o notebook continuam a abrir só por gesto, e o reordenar só por toque longo.
