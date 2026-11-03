# Na fase 1, o contraste calcula-se por script e não com o AccessLint

- Data: 2026-11-03
- Estado: decidido

## Contexto
O plano da fase 1 previa o AccessLint (`contrast-checker`, `use-of-color`) para verificar o contraste. É uma skill externa: antes de a instalar, teria de rever o `SKILL.md` e todos os scripts dela.

## Opções
1. Instalar o AccessLint agora.
2. Calcular os rácios WCAG dos tokens de cor com um script curto.

## Decisão
Opção 2.

## Porquê
- Pela regra R1, o protótipo não tem texto. O que interessa são cerca de 20 tokens em dois temas, e isso cabe numa tabela.
- A fórmula WCAG dá o mesmo resultado sem uma dependência externa nem uma revisão de segurança.
- O AccessLint passa a valer a pena quando houver texto real e muitas combinações de cor de primeiro plano e de fundo (fase 4 ou 5).

## Consequências
- Os resultados estão em `docs/review.md`, §A2.
- O AccessLint passa para a fase 4 ou 5, onde volta a ser avaliado.
