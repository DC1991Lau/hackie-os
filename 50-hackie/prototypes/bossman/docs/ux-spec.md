# Orb — especificação de experiência (UX)

Documento de referência para o protótipo de interações da app mobile.
- Protótipo atual (v2): `prototype/index.html`.
- v1 congelada: `reference/orb-gesture-prototype.html` · artifact: https://claude.ai/artifact/KMQvM2tSKHsJdTZGo1h62S

Estado: **protótipo de motion e interação**. Ainda não há conteúdo, texto nem marca — só formas, para testar gestos.

> **v2 (2026-11-03).** As questões da §6 foram todas decididas (`docs/decisions/`). Objetivo: organizar e visualizar dados, com uma boa UX. A entrega é um protótipo, não uma app.
>
> **O que mudou face às secções abaixo:**
> - Os gestos têm zonas de partida: os stories começam no terço de cima e o notebook no terço de baixo.
> - As bordas ficam reservadas ao sistema.
> - O notebook abre a partir de **todas** as views.
> - A partir do full screen, deslizar para baixo para sempre no meio.
> - O orb fica visível sobre o sheet.
> - O toque longo para reordenar passa a 400 ms, e há um modo editar.
> - Cada gesto tem uma alternativa visível, e há um fecho igual em todos os overlays.
> - A conversa guarda o histórico da sessão.
> - Os stories passam a ser por tema, e o campo de resposta abre a conversa.
>
> A §4 já está atualizada. As outras secções descrevem a v1, salvo onde dizem o contrário: o detalhe da v2 está em `docs/decisions/2026-11-03-modelo-de-gestos.md`.

---

## 1. Nomes (vocabulário)

Os nomes que o Diogo deu às partes da experiência. Usar sempre estes.

| Nome | O que é |
|---|---|
| **Views** | Os ecrãs principais. Muda-se entre eles a deslizar para os lados. |
| **Fundo** | O fundo comum a todas as views. Nunca muda; só os componentes mudam. |
| **Componentes / elementos** | Os blocos flutuantes dentro de cada view. Cada um abre um bottom sheet. |
| **Orb** | O elemento central, em 3D, a flutuar sobre o ecrã. Abre a conversa. |
| **Input de texto** | O campo onde se escreve, aberto pelo orb. Parecido ao do Claude mobile. |
| **Cartão de resposta** | O cartão onde aparece a resposta, por cima do input. |
| **Modo stories** | Modo de stories como no Instagram. Entra-se a deslizar para baixo. |
| **Bottom sheet** | O painel que abre quando se toca num elemento. Abre até meio e pode subir até cima. |
| **Full screen** | O estado do bottom sheet quando é puxado até cima: deixa de parecer um sheet e passa a ser uma página inteira. |
| **Notebook** | O conjunto de cartões, a que se chega a deslizar para cima no primeiro ecrã. Como entrar no menu de apps do telemóvel. |
| **Cartões (do notebook)** | Os itens do notebook. Podem ser organizados de formas diferentes. |
| **Views do notebook** | As várias formas de organizar os cartões. |

---

## 2. Lista de funcionalidades

1. Mudar de **view** a deslizar para a direita e para a esquerda, com o **mesmo fundo**.
2. **Orb** 3D e flutuante, sempre visível sobre o ecrã.
3. Tocar no orb: o orb **move-se para a esquerda** e abre o **input de texto**.
4. A **resposta** aparece num **cartão por cima do input**, em overlay sobre o ecrã onde se está.
5. Deslizar para baixo: entrar no **modo stories**.
6. Tocar num elemento: abre um **bottom sheet** até meio do ecrã.
7. Puxar o bottom sheet para cima: passa a **full screen**.
8. Deslizar para baixo: o full screen volta a sheet e o sheet fecha.
9. No **primeiro ecrã**, deslizar para cima: entrar no **notebook**.
10. No notebook, os **cartões** podem ser organizados em **views diferentes**.

---

## 3. Regras

Regras definidas pelo Diogo. Valem para todo o protótipo.

- **R1 — Sem texto.** Mockup só com formas, para testar interações. Nada de copy, labels ou conteúdo real.
- **R2 — Preto e branco.** Estilo lo-fi, como um wireframe. Só preto, branco e cinzentos.
- **R3 — Só tema claro e tema escuro.** Não há outras variantes de cor.
- **R4 — Tudo flutuante.** Componentes, orb, input, cartões e sheets flutuam sobre o fundo.
- **R5 — O fundo é o mesmo em todas as views.** Ao mudar de view, só os componentes mudam.
- **R6 — A conversa é um overlay.** Abre por cima do ecrã onde o utilizador está, sem o levar para outro sítio.
- **R7 — Fechar é sempre deslizar para baixo.** Vale para o bottom sheet, o full screen, os stories e o notebook.
- **R8 — Para já, só motion e interações.** O objetivo é testar como se muda de view, não o conteúdo.

---

## 4. Mapa de gestos

v2. Os gestos que comecem a menos de 24 px do topo ou dos lados, ou a menos de 34 px do fundo, são ignorados: essas zonas ficam para o sistema. Os toques continuam a funcionar.

| Onde | Gesto | Alternativa visível | Resultado |
|---|---|---|---|
| Qualquer view | Deslizar para a esquerda ou direita | Tocar nos pontos (← → no teclado) | Muda de view. |
| Qualquer view | Deslizar para baixo, **a começar no terço de cima** | Tocar na pega do topo | Entra no modo stories. |
| **Qualquer view** | Deslizar para cima, **a começar no terço de baixo** | Tocar na seta acima dos pontos | Entra no notebook. |
| Qualquer view | Tocar num componente | — | Abre o bottom sheet a meio. |
| Qualquer ecrã, incluindo o sheet | Tocar no orb | — | O orb vai para a esquerda e abre o input. |
| Conversa aberta | Enviar | — | A pergunta e a resposta juntam-se ao histórico do cartão. |
| Conversa aberta | Tocar no orb, tocar fora ou deslizar para baixo | Escape | Fecha a conversa e apaga o histórico. |
| Cartão de resposta | Tocar no 1.º círculo de ações | — | Guarda a resposta no notebook. |
| Bottom sheet a meio | Puxar para cima | Tocar na pega | Full screen. |
| Bottom sheet a meio | Deslizar para baixo | Botão de fecho | Fecha. |
| Full screen | Deslizar para baixo, mesmo depressa | Botão de fecho | Volta a sheet a meio. |
| Stories | Deslizar para baixo | Botão de fecho | Sai dos stories. |
| Stories | Tocar no campo de resposta | — | Abre a conversa por cima do story (pausado). |
| Notebook (no topo) | Deslizar para baixo | Botão de fecho | Sai do notebook. |
| Notebook | Toque longo (400 ms) e arrastar | Botão editar: arrasta-se sem toque longo | Reordena. |

---

## 5. Detalhe por funcionalidade

Cada secção tem duas partes:
- **Pedido**: o que o Diogo disse.
- **No protótipo**: como ficou implementado. Os itens marcados com *(decisão)* foram escolhas feitas durante o protótipo e não foram pedidos. Precisam de validação.

### 5.1 Views

**Pedido:** imitar o telemóvel. Arrastar para a direita e para a esquerda muda as views com o mesmo fundo; só mudam os componentes.

**No protótipo:**
- A view acompanha o dedo enquanto se arrasta. Ao soltar, passa à seguinte se o arrasto for longo ou rápido; caso contrário, volta ao sítio.
- O fundo é uma grelha de pontos e fica parado.
- *(decisão)* São 4 views, cada uma com componentes diferentes: destaque com grelha, lista, mural e indicadores.
- *(decisão)* Os componentes movem-se com um ligeiro atraso entre si (parallax), para se sentir que são eles que mudam e não o fundo.
- *(decisão)* Nas pontas (primeira e última view) há um efeito elástico.
- *(decisão)* Pontos em baixo indicam a view atual.

### 5.2 Orb

**Pedido:** um orb no meio, em 3D e flutuante sobre o ecrã.

**No protótipo:**
- O orb é uma esfera com brilho e reflexo, com uma sombra no "chão" que acompanha a flutuação.
- No tema claro a esfera é escura; no escuro é clara.
- *(decisão)* Está centrado em baixo, por cima dos pontos das views.
- *(decisão)* Enquanto espera pela resposta, o orb pulsa e o reflexo roda mais depressa.
- *(decisão)* Desaparece quando o bottom sheet ou os stories estão abertos. Continua visível dentro do notebook.

### 5.3 Input de texto e cartão de resposta

**Pedido:** ao carregar no orb, ele move-se para o lado esquerdo enquanto abre um input de texto, parecido ao do Claude mobile. A resposta aparece num cartão por cima desse input, em overlay sobre o ecrã onde se está.

**No protótipo:**
- O orb desliza para a esquerda e encolhe um pouco; o input abre-se para a direita a partir dele.
- O ecrã por trás fica desfocado e a cinzento.
- Ao enviar, aparece o cartão de resposta: primeiro a pergunta (em barras, à direita) e um indicador de "a escrever", depois a resposta, linha a linha.
- *(decisão)* Há um único cartão. Cada nova pergunta substitui o conteúdo, não fica um histórico de mensagens.
- *(decisão)* A resposta inclui, às vezes, um placeholder de imagem e uma linha de ações (três círculos).
- *(decisão)* Fecha com um toque no orb, um toque fora do cartão ou a deslizar para baixo.

### 5.4 Modo stories

**Pedido:** se o utilizador deslizar para baixo, entra no modo stories, como no Instagram.

**No protótipo:**
- Os stories acompanham o dedo enquanto se puxa; se se soltar cedo, voltam para cima.
- *(decisão)* Há barras de progresso no topo e avanço automático (cerca de 4,5 s por story).
- *(decisão)* Toque à direita avança; toque à esquerda (primeiro terço do ecrã) recua.
- *(decisão)* Manter o dedo pausa e esconde a interface.
- *(decisão)* Deslizar para os lados muda de pessoa, com transição em cubo.
- *(decisão)* Deslizar para baixo, ou tocar no X, sai dos stories.

### 5.5 Bottom sheet

**Pedido:** cada elemento aberto abre como um bottom sheet, que abre até meio e até acima se o utilizador quiser. Fecha a deslizar para baixo.

**No protótipo:**
- O sheet abre até meio do ecrã, e o ecrã por trás recua e escurece.
- Pode ser puxado até cima. Ao soltar, encaixa no ponto mais próximo: fechado, meio ou topo.
- *(decisão)* Também fecha com um toque fora do sheet.
- *(decisão)* Quando está em cima, o conteúdo faz scroll com inércia. A deslizar para baixo, primeiro o conteúdo volta ao início e só depois o sheet desce.

### 5.6 Full screen

**Pedido:** se o cartão aberto for puxado para cima, abre todo e deixa de se ver o sheet. Para sair, o movimento é o mesmo, para baixo.

**No protótipo:**
- Ao subir, o sheet perde as margens, os cantos arredondados, o contorno e a pega, e passa a ser uma página inteira. A transição acompanha o dedo.
- Deslizar para baixo volta ao sheet a meio.
- *(decisão)* Em full screen aparece um botão redondo com uma seta para baixo (canto superior esquerdo) que faz o mesmo.
- *(decisão)* Um gesto rápido para baixo pode fechar o sheet de vez.

### 5.7 Notebook

**Pedido:** no primeiro ecrã, deslizar para cima entra no notebook, que é um conjunto de cartões que podem ser organizados de diferentes formas e views. Como entrar no menu do telemóvel onde estão as apps.

**No protótipo:**
- O notebook sobe e acompanha o dedo, enquanto a view recua e desaparece. O fundo continua o mesmo.
- Só abre a partir da primeira view. Uma pequena seta acima dos pontos indica o gesto.
- Sai a deslizar para baixo, quando a lista está no topo.
- *(decisão)* Há 4 views do notebook, escolhidas com botões de ícone no topo, e os cartões animam até à nova posição:
  1. grelha de 3 colunas;
  2. cartões grandes em 2 colunas;
  3. lista;
  4. mural (colunas com cartões de alturas diferentes).
- *(decisão)* Para reordenar, mantém-se o dedo num cartão cerca de 0,3 s e arrasta-se; os outros cartões abrem espaço.
- *(decisão)* Tocar num cartão abre o mesmo bottom sheet.
- *(decisão)* No topo há também uma barra de pesquisa e um botão "+" (só visuais, sem função).
- *(decisão)* O orb continua disponível dentro do notebook.

---

## 6. Questões em aberto

1. **Histórico da conversa.** O cartão de resposta deve guardar as mensagens anteriores, ou mostrar sempre só a última?
2. **O que "organizar" quer dizer no notebook.** Basta mudar de vista e reordenar à mão, ou também agrupar, filtrar e ordenar automaticamente?
3. **Notebook só no primeiro ecrã?** Deve abrir também a partir das outras views?
4. **Full screen a fechar.** Deslizar para baixo deve voltar sempre ao sheet a meio, ou pode fechar diretamente?
5. **Stories.** De onde vêm? São do utilizador, do sistema ou de outras pessoas? Isto muda a navegação entre pessoas.
6. **Orb em sheets e stories.** Deve ficar visível nesses ecrãs, para se poder perguntar sobre o que se está a ver?
7. **Número de views.** Quantas views terá a app, e o que é cada uma?
8. **Toque longo.** 0,3 s para reordenar parece natural num telemóvel real?
