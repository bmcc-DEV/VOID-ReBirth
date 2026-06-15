# Roadmap: void-rebirth-pwa

> Identificador: `001-void-rebirth-pwa`
> Data: 2026-06-14
> Requirements: `_reversa_forward/001-void-rebirth-pwa/requirements.md`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA

## 1. Resumo da abordagem

Unificar a aplicação client-side em um único ecossistema estático de páginas web utilizando React 19, Vite 7 e a arquitetura Feature-Sliced Design (FSD). O core criptográfico pós-quântico em Rust (`void_core`) será compilado em WebAssembly unificado e carregado no ciclo de inicialização do React. O GitPay passará de um script estático a uma feature integrada, processando o faturamento Bitcoin no cliente por meio de consenso descentralizado 2-de-3 acessando APIs públicas de blockchain diretamente do browser. A persistência será local-first em IndexedDB, com backups best-effort no Nostr Ledger público encriptando as faturas com o GhostID da transação via AES-GCM.

## 2. Princípios aplicados

Esta funcionalidade baseia-se nos princípios de privacidade, local-first e soberania financeira definidos no escopo do ecossistema:

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| Soberania Financeira | Validação direta cliente-side de recebimento de fundos em carteiras sem custódia central. | respeita |
| Privacidade P2P | Metadados de faturas transmitidos criptografados via Nostr (Kind 30023) com chaves efêmeras GhostID. | respeita |
| Local-First | Armazenamento persistente IndexedDB no navegador e Service Worker para execução offline. | respeita |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Arquitetura Feature-Sliced Design (FSD) no frontend. | Organização escalável de componentes e limites claros entre a UI, as features de pagamento e o WASM core. | Clean Architecture clássica (complexidade excessiva para client-side estático), MVC tradicional. | 🟢 CONFIRMADO |
| D-02 | Consenso Cliente-Side 2-de-3 de APIs de Blockchain. | Permite validar faturas com segurança sem hospedar nós de Bitcoin custosos no backend. | Conexão a API única (ponto único de falha e dependência de terceiro), validação própria via Node.js local. | 🟢 CONFIRMADO |
| D-03 | Cifragem AES-GCM (NIP-44) via chaves efêmeras GhostID. | Protege o conteúdo de faturas publicadas em relays Nostr públicos. | NIP-04 legado (usa criptografia baseada em chaves estáticas que vaza tamanho e metadados de tráfego). | 🟢 CONFIRMADO |
| D-04 | Compilação WASM unificada do void_core Rust. | Evita múltiplos arquivos .wasm e unifica ML-KEM, ML-DSA, Shamir e Pedersen Commitments em uma única ponte JS. | Compilar WASM separado por submódulo (aumenta o overhead de inicialização e tamanho do bundle). | 🟢 CONFIRMADO |

## 4. Premissas

Nenhuma premissa baseada em dúvidas pendentes nesta versão. Todas as decisões de consenso de API, cifragem de metadados Nostr e suporte nativo GhostID WASM foram esclarecidas e incorporadas na documentação de requisitos.

## 5. Delta arquitetural

Listagem dos componentes lógicos e subprojetos descritos em `_reversa_sdd/architecture.md` que sofrerão alteração:

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| GitPay Checkout | `_reversa_sdd/architecture.md#subprojetos` | componente-novo | A lógica estática e standalone do GitPay é refatorada e portada para a pasta `features/gitpay/` e componentes UI compartilhados no FSD. |
| void_core WASM | `_reversa_sdd/architecture.md#subprojetos` | componente-novo | Módulo Rust portado para compilação unificada via Vite, expondo wrappers TS unificados em `shared/api/void_core/`. |
| ET-COSMIC Frontend | `_reversa_sdd/architecture.md#subprojetos` | componente-novo | Aplicação React 19 reestruturada sob a topologia de design do FSD. |
| ET-COSMIC Server | `_reversa_sdd/architecture.md#subprojetos` | componente-extinto | Desativado para o MVP da PWA, todas as chamadas PQC de faturamento rodam client-side via WASM local. |

## 6. Delta no modelo de dados

Modelagem conceitual do banco de dados local do navegador para viabilizar o fluxo offline e local-first:

- Resumo das mudanças: Criação das stores de IndexedDB (`merchant_config`, `products` e `invoices`) para persistir o catálogo e o histórico de faturas localmente.
- Detalhe completo em: `_reversa_forward/001-void-rebirth-pwa/data-delta.md`

## 7. Delta de contratos externos

Mapeamento de contratos externos afetados (APIs públicas e protocolo Nostr):

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| bitcoin-consensus-api | HTTP | `_reversa_forward/001-void-rebirth-pwa/interfaces/bitcoin-consensus-api.md` |
| nostr-ledger-protocol | WebSocket | `_reversa_forward/001-void-rebirth-pwa/interfaces/nostr-ledger-protocol.md` |

## 8. Plano de migração

Como estamos consolidando o ecossistema estático local-first e descontinuando o servidor central Node.js para checkout, os dados do legado são migrados da seguinte forma:

1. **Configurações do Merchant**: Chaves XPUB e relays definidos estaticamente no GitPay legado serão carregados na primeira inicialização da PWA e salvos na store `merchant_config` do IndexedDB.
2. **Histórico de Faturas**: Faturas antigas e recibos de transações salvos na rede Nostr Kind 30023 do merchant serão consultados e sincronizados para o IndexedDB na tela de histórico de faturas.

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Bloqueio por limite de rate-limit em APIs públicas de Bitcoin. | alto | médio | Utilizar cache de requests HTTP curtos e fallback para as APIs de conciliação blockchain alternativas em caso de erro 429. |
| Perda de sincronização em relays Nostr devido a instabilidade de rede. | médio | alto | Queue de sincronização IndexedDB que armazena faturas geradas offline e as publica sequencialmente assim que restabelecida a rede. |
| Sobrecarga de carregamento do binário WASM único em navegadores móveis antigos. | alto | baixo | Lazy-loading do WASM `void_core` exibindo indicador visual elegante e realizando inicialização assíncrona. |

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] `legacy-impact.md` gerado sem avisos de regressão
- [ ] `regression-watch.md` gerado e validado
- [ ] Build estático gerado via Vite compilando o WASM único e resultando em tamanho total inferior a 2MB.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-06-14 | Versão inicial gerada por `/reversa-plan` | reversa |
