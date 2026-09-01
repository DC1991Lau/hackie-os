# Hackie OS

Workspace de gestão da Hackie. Funciona no Claude (Cowork) e no Claude Code — mesma pasta, mesmo `CLAUDE.md`.

## Regra de ouro

**Estrutura em inglês. Conteúdo em português.** Nomes próprios (`iefp`, `anexo-6`, `seguranca-social`) ficam como são.

## Onde está o quê

```
00-core/        identidade, oferta, mercado, marca   ← fonte única da verdade
  public/       ⚠️ o único sítio de onde sai material para fora
10-company/     IEFP, legal, financeiro, contratos   ← fora do git
20-clients/     um cliente = uma cópia de _template/
30-sales/       pipeline.md, propostas, materiais
40-operations/  playbooks, templates, checklists
50-hackie/      a Hackie como cliente dela própria
60-education/   workshops e formação
90-log/         decisões e registo semanal
_inbox/         entrada não triada
```

Prefixos numéricos existem para a ordem ser estável e para poderes dizer "põe isso no 30".

## Como usar

| Quero | Faço |
|---|---|
| Criar um cliente | `/new-client <nome>` |
| Ver o estado da semana | `/week` |
| Escrever uma proposta | pedir ao Claude — carrega `client-proposal` + `hackie-voice` |
| Escrever um relatório Pulse | pedir ao Claude — carrega `pulse-report` |
| Escrever seja o que for para fora | o Claude carrega `hackie-voice` sozinho |

## Antes de mexer

1. Preços, serviços e posicionamento vivem em `00-core/`. Não os copies para outro lado — aponta.
2. `00-core/generated/` é output. Editar a fonte, não o gerado.
3. `00-core/market/ecosystem.md` nomeia concorrentes reais. Nunca sai.
4. `10-company/` tem dados pessoais e está no `.gitignore`.
5. Ficheiro sem sítio óbvio → `_inbox/`. Nunca solto na raiz.

## Estado

| Fase | O que é | Estado |
|---|---|---|
| 1 | Estrutura de pastas | ✅ |
| 2 | Ficheiros existentes arrumados | ✅ |
| 3 | `CLAUDE.md`, skills, comandos | ✅ |
| 4 | Templates e playbooks (proposta, relatório, onboarding) | ⬜ |
| 5 | Gerador do documento fundacional, camada viva | ⬜ |

Por preencher: `00-core/brand/`, `40-operations/`, `50-hackie/`, `60-education/`, `10-company/{legal,finance,contracts}`.
