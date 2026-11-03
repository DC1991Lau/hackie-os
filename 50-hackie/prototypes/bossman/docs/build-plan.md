# Orb — plano de build em React Native (Expo)

- Data: 2026-11-03
- Estado: **aprovado a 2026-11-03. M0–M5 feitas numa primeira versão (testada no browser via Expo web); M6 parcial. Por testar no telemóvel.**
- Objetivo: ver o protótipo v2 (`prototype/`) a correr no telemóvel do Diogo, com gestos nativos.

---

## 1. O que muda e o que não muda

**Muda:**
- **D1 inverte-se.** Passa de PWA para app nativa com Expo. Fica registado num ficheiro de decisão novo quando aprovares.
- O protótipo passa a correr no telemóvel através da app **Expo Go**, sem App Store, sem build nativo e sem contas pagas.

**Não muda:**
- O modelo de gestos v2 (`docs/decisions/2026-11-03-modelo-de-gestos.md`) e os valores de motion.
- A separação entre **UI (tua)** e **interação (motor)**.
- A conversa continua simulada. Não há IA real nem backend.
- Continua a ser um protótipo: sem EAS Build, sem lojas, sem contas de utilizador.

---

## 2. Stack

Todas as bibliotecas abaixo funcionam no Expo Go, por isso não é preciso compilar nada.

| Peça | Biblioteca | Porquê |
|---|---|---|
| Base | Expo, a versão mais recente que o Expo Go suporte, com TypeScript | Corre no telemóvel a partir de um QR code |
| Molas e animação | `react-native-reanimated` | `withSpring` usa a mesma física do protótipo (rigidez e amortecimento), por isso os valores passam 1:1. Corre na thread de UI, a 60–120 fps. |
| Gestos | `react-native-gesture-handler` | Gestos `Pan` com zonas de partida, conflito com o scroll resolvido de forma nativa, toque longo |
| Reordenar e mudar de vista no notebook | Layout Animations do Reanimated (`LinearTransition`) | Substituem o FLIP manual do protótipo |
| Desfoque da conversa | `expo-blur` | Para o véu desfocado. No Android, se ficar mal, uso um véu semitransparente. |
| Vibração | `expo-haptics` | Funciona também no iOS, ao contrário da web |
| Orb, anel, ícones, placeholders | `react-native-svg` | O React Native não tem gradientes radiais; o orb é desenhado em SVG |
| Safe areas | `react-native-safe-area-context` | Margens do notch e da barra de home |
| Tema claro e escuro, movimento reduzido | `useColorScheme` e `useReducedMotion` | Nativos |

Sem navegação (`expo-router`): o Orb é um ecrã único com overlays (R6).

---

## 3. Estrutura de pastas

```
app/                          ← projeto Expo
  App.tsx                     ← junta as camadas
  src/
    ui/                       ← TUA camada (equivalente a ui.css + ui.js)
      theme.ts                ← tokens: cores claro/escuro, raios, sombras
      views.tsx               ← as 4 views (destaque, lista, mural, indicadores)
      sheet-content.tsx
      story-slide.tsx
      notebook-card.tsx
      answer.tsx
    interaction/              ← motor (equivalente a interaction.*)
      physics.ts              ← todas as molas e todos os limiares num só sítio
      zones.ts                ← D10 e D11: zonas de partida e zonas do sistema
      Pager.tsx  Sheet.tsx  Stories.tsx  Notebook.tsx  Orb.tsx  Chat.tsx
```

**Uma diferença que precisas de saber:** em React Native não há CSS. A tua camada de UI passa a ser `theme.ts` e componentes em TSX com `StyleSheet`. Continua separada do motor, mas é um pouco menos livre do que editar CSS.

O `prototype/` web fica como referência de comportamento.

---

## 4. Etapas

Cada etapa acaba com algo que vês e testas no telemóvel. Depois de cada uma, paro e espero o teu OK.

| # | Etapa | O que vês no telemóvel | Valores do protótipo a respeitar |
|---|---|---|---|
| **M0** | Projeto Expo, dependências, abrir no Expo Go | Ecrã com o fundo de pontos | — |
| **M1** | Views e pager: parallax, efeito elástico nas pontas, pontos clicáveis, zonas do sistema | Deslizar entre as 4 views | Mola 300/33; muda acima de 20% da largura ou de 500 px/s |
| **M2** | Bottom sheet: meio, full screen, scroll primeiro, D5, pega e fecho | Tocar num componente e brincar com o sheet | Mola 380/36; projeção de 0,2 s; margem 8→0 e raio 34→0 |
| **M3** | Orb e conversa: input, teclado, cartão com histórico, guardar no notebook | Tocar no orb e escrever | 550–600 ms, `cubic-bezier(.2,.9,.25,1)`; fecha acima de 110 px ou de 700 px/s |
| **M4** | Stories: puxar a partir do terço de cima, temas, cubo 3D, avanço automático, pausa, resposta que abre a conversa | Modo stories completo | Abre aos 260 px, a partir de 42% ou de 700 px/s; 4,5 s por story |
| **M5** | Notebook: puxar a partir do terço de baixo, 4 vistas animadas, toque longo de 400 ms com vibração, modo editar | Notebook completo | Abre a 42% da altura, a partir de 35% ou de 700 px/s; reorganização em 300 ms |
| **M6** | Acabamentos: tema claro e escuro, movimento reduzido, VoiceOver e TalkBack (rótulos), afinar no telemóvel | Tudo a funcionar junto | Contraste da `docs/review.md`, §A2 |

---

## 5. Como vais ver no telemóvel

1. Instala o **Expo Go** (App Store ou Google Play).
2. O PC e o telemóvel têm de estar **na mesma rede Wi-Fi**. O PC está em `192.168.1.184`.
3. Corro `npx expo start` e aparece um QR code. No iPhone lês com a câmara; no Android, com a app Expo Go.
4. Cada alteração aparece no telemóvel em segundos (*fast refresh*).

Se a rede bloquear a ligação (comum em redes de empresa ou de hotel), uso `npx expo start --tunnel`.

---

## 6. Riscos

| Risco | O que faço |
|---|---|
| A versão do Expo Go no telemóvel não bate certo com o SDK do projeto | Na M0, crio o projeto com a versão que o teu Expo Go suporta |
| O cubo 3D dos stories fica diferente no Android | Testo na M4. Se ficar mal no Android, passa a um slide simples |
| O desfoque no Android fica fraco ou lento | Véu semitransparente no Android |
| Os gestos podem pedir afinação num ecrã real (as zonas de 24/34 px e os terços) | Ficam todos em `physics.ts` e `zones.ts`, para afinar depressa |
| Firewall do Windows bloqueia a porta 8081 | Permitir o Node na firewall, ou usar `--tunnel` |

---

## 7. Skills

| Etapa | Skill | Estado |
|---|---|---|
| M0 | Vercel *react-native-skills* (opcional) | Externa e **não instalada**. Pelo `CLAUDE.md`: leio o `SKILL.md` e os scripts, mostro-te, e só instalo se aprovares. Sem ela, também se faz. |
| Cada etapa | `code-review` | Instalada |
| M6 | `design:accessibility-review` | Instalada |

---

## 8. O que preciso de ti antes de começar

1. **Aprovar ou mudar este plano.**
2. **Telemóvel: Android** (respondido a 2026-11-03).
   - O Expo Go instala-se a partir do Google Play.
   - O QR code lê-se dentro da app Expo Go.
   - Por omissão, o véu da conversa é semitransparente, sem `expo-blur`. O desfoque fica como opção, se ficar bem no teu aparelho.
   - O cubo 3D dos stories é testado logo no início da M4.
   - A vibração do reordenar funciona.
   - O gesto "voltar" do Android a partir das bordas laterais é exatamente o que a D11 protege.
3. **Expo Go** instalado e o telemóvel no mesmo Wi-Fi do PC.
4. **Skill da Vercel:** revejo-a e mostro-ta, ou avanço sem ela?

**Documentação que atualizo ao começar:**
- uma decisão nova, `2026-11-xx-stack-expo.md`, que substitui a D1;
- o `CLAUDE.md`, para repor a fase de build e a pasta `app/`.
