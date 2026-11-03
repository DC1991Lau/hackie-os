# D1 revista — O protótipo passa a React Native com Expo, para correr no telemóvel

- Data: 2026-11-03
- Estado: decidido. Substitui `2026-11-03-stack.md` (PWA).

## Contexto
O Diogo quer ver o protótipo no telemóvel dele, um Android, com gestos nativos.

## Opções
1. Manter a PWA e abri-la no browser do telemóvel.
2. React Native com Expo, a correr no Expo Go.

## Decisão
Opção 2. Plano em `docs/build-plan.md`.

## Porquê
- Os gestos, as molas e os sheets são o centro do produto, e no nativo não competem com o browser.
- O Expo Go mostra o resultado no telemóvel sem builds nem lojas.

## Consequências
- O projeto fica em `app/`, com Expo SDK 58 e as bibliotecas da tabela do plano.
- `prototype/` (web) passa a ser a referência de comportamento.
- Continua a ser um protótipo: sem EAS Build, sem lojas e sem IA real.
- A UI do Diogo fica em `app/src/ui/` (TypeScript com `StyleSheet`, sem CSS). O motor fica em `app/src/interaction/`.
