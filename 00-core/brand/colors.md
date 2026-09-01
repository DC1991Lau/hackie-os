# Hackie — Cores

Fonte da verdade da paleta. Estes valores foram usados primeiro no documento
fundacional; passam a viver aqui. Qualquer superfície nova — website, proposta,
apresentação, material de workshop — parte deste ficheiro, não do HTML gerado.

---

## Paleta

| Token | Hex | Onde se usa |
|---|---|---|
| `primary` | `#0D2535` | Azul-petróleo escuro. Fundos de capa e de secção forte, títulos, cabeçalhos de tabela. A cor da marca. |
| `accent` | `#00897B` | Verde-azulado. Numeração de secção, marcadores, barra de citação, estados ativos. Usar com parcimónia — é acento, não superfície. |
| `accent-light` | `#E0F2F0` | Fundo de citações e de blocos em destaque. |
| `bg` | `#F7F5F2` | Fundo base, quente. Nunca branco puro numa página inteira. |
| `surface` | `#FFFFFF` | Cartões e tabelas sobre o fundo base. |
| `surface-alt` | `#EEF3F2` | Superfície alternada — linhas de tabela, blocos secundários. |
| `body` | `#2C3E50` | Texto corrente. Não usar preto. |
| `muted` | `#6B7A8D` | Texto secundário, legendas, metadados. |
| `border` | `#DDE4E6` | Traços, separadores, contornos de tabela. |

---

## Regras

- **O fundo é quente, não branco.** `#F7F5F2` sobre `#FFFFFF` é o par correto. Uma
  página inteiramente branca não é Hackie.
- **O texto nunca é preto.** `#2C3E50` para corpo, `#0D2535` para títulos.
- **O acento não é uma superfície.** `#00897B` aparece em traços, numeração e
  estados ativos. Um bloco grande a verde está errado.
- Sobre `primary`, o texto branco usa-se a opacidade reduzida para hierarquia:
  `0.85` para navegação, `0.55` para apoio, `0.2` para metadados.

---

## Contraste

`body` sobre `bg` e `primary` sobre `bg` passam AA para texto corrente.
`accent` sobre `bg` **não** passa AA a tamanho pequeno — usar apenas em texto
grande, ícones ou traços, nunca em parágrafos.

---

*Hackie · Marca · Cores*
