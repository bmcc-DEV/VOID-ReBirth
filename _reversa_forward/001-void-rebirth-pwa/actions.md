# Actions: void-rebirth-pwa

> Identificador: `001-void-rebirth-pwa`
> Data: 2026-06-14
> Roadmap: `_reversa_forward/001-void-rebirth-pwa/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 15 |
| Paralelizáveis (`[//]`) | 7 |
| Maior cadeia de dependência | 5 |

## Fase 1, Preparação

<!-- Setup, scaffolding, migrações iniciais, configuração de infraestrutura local. -->

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Criar a estrutura de pastas do FSD (app, pages, widgets, features, entities, shared) na raiz do projeto. | - | `[//]` | `src/shared/README.md` | 🟢 | `[X]` |
| T002 | Configurar o vite.config.ts incluindo suporte a compilação e carregamento de arquivos WASM. | - | `[//]` | `vite.config.ts` | 🟢 | `[X]` |
| T003 | Configurar o banco de dados IndexedDB local-first in shared/api/ para persistência de faturas. | T001 | - | `src/shared/api/indexeddb.ts` | 🟢 | `[X]` |
| T004 | Criar manifest.json de PWA e tokens de design CSS vanilla (cores e tipografia premium). | T001 | `[//]` | `public/manifest.json` | 🟢 | `[X]` |

## Fase 2, Testes

<!-- Testes que precisam existir antes ou logo após o núcleo. Omitir se a equipe não pratica TDD. -->

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T005 | Criar testes unitários para a geração de endereços baseada em chaves BIP32 com o módulo void_core WASM. | T002 | `[//]` | `src/shared/api/void_core.test.ts` | 🟢 | `[X]` |
| T006 | Criar testes de consenso para validar que a conciliação de faturas Bitcoin só é completada com consenso 2-de-3. | T003 | `[//]` | `src/shared/api/bitcoin-consensus.test.ts` | 🟢 | `[X]` |

## Fase 3, Núcleo

<!-- Lógica central da feature. -->

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T007 | Implementar o carregamento e instância assíncrona do binário Rust WASM no frontend TypeScript. | T002 | - | `src/shared/api/void_core.ts` | 🟢 | `[X]` |
| T008 | Implementar a derivação determinística de endereços de recebimento Bitcoin a partir de XPUB/YPUB/ZPUB. | T007 | - | `src/entities/merchant/model.ts` | 🟢 | `[X]` |
| T009 | Implementar a verificação de depósitos realizando chamadas HTTP paralelas a mempool.space, blockstream.info e blockchain.info. | T003 | - | `src/features/gitpay/api/consensus.ts` | 🟢 | `[X]` |
| T010 | Implementar encriptação AES-GCM (NIP-44) com chaves efêmeras GhostID de fatura para o Nostr Ledger. | T007 | - | `src/features/nostr/api/encrypt.ts` | 🟢 | `[X]` |

## Fase 4, Integração

<!-- Cola com outras partes do sistema, contratos externos, ganchos. -->

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T011 | Criar o fluxo de checkout e faturamento integrado (GitPayCheckout) conectando a geração de faturas e escuta Nostr. | T008, T009, T010 | - | `src/features/gitpay/ui/Checkout.tsx` | 🟢 | `[X]` |
| T012 | Implementar o catálogo na HomePage exibindo os 3 produtos padrão (GitPay Merchant, PQC Audit, GhostID Deploy). | T011 | - | `src/pages/home/ui/HomePage.tsx` | 🟢 | `[X]` |
| T013 | Configurar o Service Worker para cachear todos os assets estáticos da build PWA, incluindo o WASM unificado. | T003 | - | `src/app/sw.ts` | 🟢 | `[X]` |

## Fase 5, Polimento

<!-- Logs, telemetria, mensagens de erro, documentação curta. -->

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T014 | Adicionar logs detalhados e tratamento elegante de erros de conexão HTTP/WebSocket na PWA. | T009, T010 | `[//]` | `src/shared/lib/logger.ts` | 🟢 | `[X]` |
| T015 | Configurar scripts de build de produção e comandos de otimização de bundle no package.json. | T012, T013 | `[//]` | `package.json` | 🟢 | `[X]` |

## Notas de execução

<!--
Reservado para /reversa-coding registrar avisos ou observações que surgiram durante a execução.
Não use isso para corrigir ações, edits manuais ficam fora desse arquivo, vão direto no código.
-->

As tarefas lógicas da PWA unificada foram finalizadas no frontend de desenvolvimento. Os testes de integração específicos de paridade de faturamento, GhostID e limites LSC passaram com êxito na suíte Vitest local (parity.integration.test.ts).

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-06-14 | Versão inicial gerada por `/reversa-to-do` | reversa |
| 2026-06-14 | Execução e conclusão de todas as ações de T001 a T015 por `/reversa-coding` | reversa |
