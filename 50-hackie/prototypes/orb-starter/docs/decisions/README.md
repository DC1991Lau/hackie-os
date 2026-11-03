# Decisões

Uma decisão real = um ficheiro datado nesta pasta.

- Nome: `AAAA-MM-DD-tema.md` (por exemplo, `2026-11-04-stack.md`).
- Quando uma decisão é tomada, sai da lista de pendentes abaixo e passa a ter o seu próprio ficheiro.

## Modelo

```markdown
# <Decisão em uma frase>

- Data: AAAA-MM-DD
- Estado: decidido | revisto em AAAA-MM-DD

## Contexto
O que estava em causa e porquê agora.

## Opções
1. ...
2. ...

## Decisão
O que se escolheu.

## Porquê
As razões, em poucas linhas.

## Consequências
O que muda na especificação, no design system ou no código.
```

## Decisões pendentes

| # | Questão | Origem |
|---|---|---|
| D1 | **Stack:** app nativa (React Native / Expo) ou web app (React / Next.js)? Recomendação: nativa. | Plano, fase 0 |
| D2 | **Conversa:** o cartão de resposta guarda o histórico ou mostra só a última resposta? | Especificação, §6.1 |
| D3 | **Notebook:** o que é "organizar"? Só mudar de vista e reordenar, ou também agrupar, filtrar e ordenar? | Especificação, §6.2 |
| D4 | **Notebook:** abre só a partir da primeira view ou de todas? | Especificação, §6.3 |
| D5 | **Full screen:** deslizar para baixo volta sempre ao sheet a meio, ou pode fechar diretamente? | Especificação, §6.4 |
| D6 | **Stories:** de onde vêm (do utilizador, do sistema, de outras pessoas)? | Especificação, §6.5 |
| D7 | **Orb:** fica visível sobre sheets e stories? | Especificação, §6.6 |
| D8 | **Views:** quantas são e o que é cada uma? | Especificação, §6.7 |
| D9 | **Reordenar:** 0,3 s de toque longo parece natural num telemóvel real? | Especificação, §6.8 |
| D10 | **Conflito com o scroll:** em que condições abrem os stories e o notebook quando a view tem scroll? | Plano, fase 1 |
| D11 | **Gestos do sistema:** que zonas das bordas ficam reservadas ao sistema operativo? | Plano, fase 1 |
| D12 | **Alternativas aos gestos:** que botão ou elemento visível dá acesso aos stories, ao notebook e à reordenação? | Plano, fase 1 |
