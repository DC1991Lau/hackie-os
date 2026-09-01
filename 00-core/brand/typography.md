# Hackie — Tipografia

Fonte da verdade tipográfica. Tal como as cores, estes valores nasceram no
documento fundacional e passam a viver aqui.

---

## As duas famílias

| Papel | Família | Fallback |
|---|---|---|
| **Display** | Fraunces | `Georgia, serif` |
| **Corpo** | Inter | `system-ui, sans-serif` |

Fraunces é uma serifada variável com eixo ótico — usar `font-optical-sizing: auto`.
Ambas estão no Google Fonts. Pesos em uso: Fraunces 300/600/700, Inter 300/400/500/600.

---

## Escala

| Elemento | Família | Tamanho | Peso | Notas |
|---|---|---|---|---|
| Título de capa | Display | `clamp(52px, 7vw, 88px)` | 700 | `letter-spacing: -0.03em`, `line-height: 1` |
| Título de secção | Display | `clamp(28px, 4vw, 42px)` | 700 | `letter-spacing: -0.03em` |
| H2 | Display | 26px | 700 | `letter-spacing: -0.02em` |
| H3 | Display | 20px | 600 | `letter-spacing: -0.01em` |
| Sobretítulo | Corpo | 11px | 600 | maiúsculas, `letter-spacing: 0.02em`, cor `accent` |
| Corpo | Corpo | 15.5px | 400 | `line-height: 1.75`, largura máx. 680px |
| Manifesto | Display | `clamp(18px, 2.2vw, 24px)` | 300 | `line-height: 1.5` — o manifesto respira mais |
| Tabela | Corpo | 14px | 400 | cabeçalho 11px/600 em maiúsculas |
| Metadados | Corpo | 10–11px | 400 | `letter-spacing: 0.05em`, cor `muted` |

---

## Regras

- **Display para títulos, corpo para ler.** Fraunces em parágrafos só no manifesto,
  onde o texto é curto e o ritmo é declamado.
- **Títulos apertam, texto pequeno abre.** `letter-spacing` negativo acima dos 20px,
  positivo abaixo dos 12px.
- **A medida do texto é 680px.** Uma linha mais longa deixa de se ler.
- **`line-height` 1.75 no corpo.** O documento é para ser lido inteiro, não folheado.
- Maiúsculas só em sobretítulos, cabeçalhos de tabela e metadados. Nunca num título.

---

## Importação

```
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@300;400;500;600&display=swap
```

---

*Hackie · Marca · Tipografia*
