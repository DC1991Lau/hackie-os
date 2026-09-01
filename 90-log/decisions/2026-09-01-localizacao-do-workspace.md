# Localização do workspace: Desktop em vez de OneDrive

**Data:** 2026-09-01
**Estado:** provisória — a rever

## Contexto

A decisão original foi instalar o Hackie OS em `C:\Users\diogo\OneDrive\Hackie`, por causa da sincronização e do backup automático.

## O que aconteceu

O Claude não consegue obter acesso a pastas dentro do OneDrive por pedido automático — os pedidos para `~/OneDrive` e para `OneDrive\Área de Trabalho\Hackie CONTEXTO` foram recusados pelo sistema. Pastas locais (`~/Desktop`) são concedidas sem problema.

## Decisão

Instalar em `C:\Users\diogo\Desktop\Hackie`, ao lado de `HackieLabs`.

## Consequências

- ✅ O Claude escreve e lê a pasta diretamente, sem intervenção manual.
- ❌ Sem sincronização OneDrive. **O backup passa a depender do git.**
- ⚠️ Se a pasta for movida para o OneDrive, o Claude deixa de lhe chegar por pedido automático — passa a ser preciso ligá-la manualmente pelo botão "Add folder" na app de desktop.

## Como reverter

Mover a pasta `Hackie` para dentro do OneDrive e ligá-la à sessão pelo folder picker. O git acompanha a pasta — o histórico não se perde.

## Em aberto

Configurar um remote git (repositório privado) para haver backup real fora desta máquina.
