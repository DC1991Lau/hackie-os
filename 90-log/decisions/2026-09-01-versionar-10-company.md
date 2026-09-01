# Versionar `10-company/` em git

**Data:** 2026-09-01
**Estado:** ativa — depende do repositório se manter privado

## Contexto

A decisão original foi manter `10-company/` fora do git, por conter dados pessoais
— NIF, morada, dados de segurança social — na candidatura IEFP.

Combinada com a mudança do workspace para `Desktop` (ver
`2026-09-01-localizacao-do-workspace.md`), que eliminou a sincronização OneDrive,
o resultado foi que a pasta ficou **sem backup nenhum**: nem sincronização, nem
histórico local, nem cópia fora da máquina. É a pasta com o único prazo real em
aberto no negócio.

## Decisão

`10-company/` passa a ser versionado. Sai do `.gitignore`.

Condição: o repositório remoto é **privado**. A decisão não sobrevive à
publicação do repositório.

## Consequências

- ✅ Os documentos do IEFP passam a ter histórico e, com remote, backup fora da máquina.
- ⚠️ Os dados pessoais ficam no histórico de git de forma **permanente**. Apagar o
  ficheiro num commit futuro não os remove — continuam nos commits anteriores.
- ⚠️ Repositório privado não é repositório cifrado. Manter 2FA na conta.
- ❌ Se o repositório passar a público, os dados ficam expostos.

## Como reverter

Antes de qualquer push, basta repor `10-company/` no `.gitignore` e correr
`git rm -r --cached 10-company/`.

Depois de haver push, é preciso reescrever o histórico com `git filter-repo`
(ou BFG) e forçar o push. Assumir que qualquer cópia já clonada mantém os dados.

## Em aberto

Criar o repositório privado e configurar o remote — continua por fazer, e é o que
dá sentido a esta decisão. Sem remote, o ganho é só histórico local.
