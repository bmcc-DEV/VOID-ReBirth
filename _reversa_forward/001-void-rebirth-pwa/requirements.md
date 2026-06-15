# Requirements: void-rebirth-pwa

> Identificador: `001-void-rebirth-pwa`
> Data: 2026-06-14
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

Implementar a aplicação estática e offline-first ET-COSMIC-Nova (React, Vite e Feature-Sliced Design), unificando a lógica criptográfica pós-quântica do `void_core` em um único binário WASM. A aplicação deve empacotar o checkout Bitcoin serverless do GitPay, exibir catálogo de 3 produtos e persistir dados localmente via PWA para ser distribuída estaticamente com tamanho inferior a 2MB no GitHub Pages.

## 2. Contexto a partir do legado

As definições e lógicas de faturamento descentralizado, WASM, chaves BIP32 e dispersão criptográfica baseiam-se nos arquivos de engenharia reversa do legado:

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| [architecture.md](file:///run/media/bruno/Bruno/ET-COSMIC-GitPay/_reversa_sdd/architecture.md#subprojetos) | GitPay opera como processador Lightning/Bitcoin serverless e void_core compila criptografia Rust para WASM. | 🟢 CONFIRMADO |
| [domain.md](file:///run/media/bruno/Bruno/ET-COSMIC-GitPay/_reversa_sdd/domain.md#glossario) | Nostr Ledger para eventos de fatura (Kind 30023) e recibo (Kind 23001), chaves efêmeras GhostID e Quantum-Enhanced Layer (Shamir). | 🟢 CONFIRMADO |
| [domain.md](file:///run/media/bruno/Bruno/ET-COSMIC-GitPay/_reversa_sdd/domain.md#tolerancia-de-pagamento-e-underpayment-gitpay) | Regra de aceitação de faturas Bitcoin com base em margem de tolerância. | 🟢 CONFIRMADO |
| [domain.md](file:///run/media/bruno/Bruno/ET-COSMIC-GitPay/_reversa_sdd/domain.md#taxa-de-suporte-tecnico-probabilistica-gitpay) | Regra de desvio estatístico probabilístico de 1% das faturas para o desenvolvedor. | 🟢 CONFIRMADO |
| [inventory.md](file:///run/media/bruno/Bruno/ET-COSMIC-GitPay/_reversa_sdd/inventory.md#entry-points) | Estrutura de código do GitPay client-side (app.js, sw.js) e do void_core Rust (lib.rs). | 🟢 CONFIRMADO |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Merchant Soberano | Processar vendas Bitcoin/Lightning de forma direta e sem intermediários de forma offline. | Acessar o catálogo estático local, configurar XPUB de recebimento e monitorar pagamentos de clientes via mempool. |
| Comprador Anônimo | Adquirir produtos digitais do ecossistema garantindo privacidade e proteção pós-quântica. | Selecionar um produto do catálogo, pagar a invoice gerada no checkout e receber o recibo criptografado via Nostr. |

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Nova):** Persistência e Sincronização Local-First. Todo o estado da aplicação (configurações do merchant, catálogo de produtos e histórico de faturas) deve ser armazenado localmente no IndexedDB e sincronizado com a rede Nostr (Kind 30023) de forma best-effort quando houver conectividade. 🟢
   - Origem no legado: [domain.md](file:///run/media/bruno/Bruno/ET-COSMIC-GitPay/_reversa_sdd/domain.md#glossario)
   - Tipo: nova
2. **RN-02 (Alterada):** Checkout Serverless Consolidado. O checkout estático do GitPay deve rodar integrado no fluxo do React/TypeScript na arquitetura FSD, utilizando derivação determinística de endereços baseada em chaves estendidas BIP32 locais e aplicando a tolerância a subpagamentos. 🟢
   - Origem no legado: [domain.md](file:///run/media/bruno/Bruno/ET-COSMIC-GitPay/_reversa_sdd/domain.md#tolerancia-de-pagamento-e-underpayment-gitpay)
   - Tipo: alterada
3. **RN-03 (Alterada):** Taxa de Suporte Técnico Probabilística Unificada. O mecanismo de arrecadação de 1% com desvio estatístico deve incidir sobre todas as faturas geradas pelos 3 produtos do catálogo, substituindo XPUB do merchant pelo XPUB do desenvolvedor. 🟢
   - Origem no legado: [domain.md](file:///run/media/bruno/Bruno/ET-COSMIC-GitPay/_reversa_sdd/domain.md#taxa-de-suporte-tecnico-probabilistica-gitpay)
   - Tipo: alterada
4. **RN-04 (Nova):** Consenso Descentralizado de Blockchain. Para validar a liquidação de pagamentos na mempool/blockchain sem um servidor de apoio, a PWA deve consultar 3 APIs públicas de blockchain (mempool.space, blockstream.info e blockchain.info). O pagamento só é considerado confirmado se houver consenso de pelo menos 2 dos provedores consultados. 🟢
   - Origem no legado: [domain.md](file:///run/media/bruno/Bruno/ET-COSMIC-GitPay/_reversa_sdd/domain.md#tolerancia-de-pagamento-e-underpayment-gitpay)
   - Tipo: nova

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Geração determinística de faturas Bitcoin baseado na configuração de chaves estendidas (xpub/ypub/zpub) do merchant. | Must | A fatura deve exibir o endereço correto de recebimento Bitcoin derivado deterministicamente a partir da chave do merchant. | 🟢 CONFIRMADO |
| RF-02 | Verificação de depósitos com tolerância e consenso descentralizado entre 3 provedores de API blockchain (mempool.space, blockstream.info e blockchain.info). | Must | Marcar invoice como paga se houver conciliação de transação na mempool que respeite o limite de tolerância em 2 de 3 provedores. | 🟢 CONFIRMADO |
| RF-03 | Integração de catálogo com 3 produtos base (GitPay Merchant, PQC Audit, GhostID Deploy) com fluxo de checkout. | Must | Exibição de cards de produtos na página principal com botão para iniciar faturamento e geração de QR code. | 🟢 CONFIRMADO |
| RF-04 | Unificação de compilação do `void_core` Rust em WASM e suporte nativo à geração de GhostID. | Must | A PWA deve conseguir instanciar as funções do WASM (`void_core`) para encriptação ML-KEM/ML-DSA, divisão de segredo Shamir e derivar GhostIDs usando entropia do frontend. | 🟢 CONFIRMADO |
| RF-05 | Roteamento e persistência offline PWA baseada em FSD. | Must | A aplicação deve carregar sem conexão à internet através de Service Worker e manter faturas no IndexedDB. | 🟢 CONFIRMADO |
| RF-06 | Integração de envio de faturas e recibos criptografados via rede de relays Nostr (Kind 30023 e Kind 23001) usando AES-GCM (NIP-44). | Must | Publicar e ler eventos Nostr correspondentes às faturas encriptando os metadados usando chaves efêmeras derivadas do GhostID. | 🟢 CONFIRMADO |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | Tamanho total do build estático final comprimido inferior a 2MB. | Garantir carregamento rápido no GitHub Pages e em redes com pouca largura de banda. | 🟢 CONFIRMADO |
| Segurança | Persistência local criptografada. Chaves e faturas do merchant não podem ser transmitidas a servidores centralizados. | Princípio local-first e soberania financeira de dados. | 🟢 CONFIRMADO |
| Portabilidade | Distribuição estática sem dependência de processamento no backend para roteamento. | Possibilidade de deploy no GitHub Pages utilizando SPA hash routing. | 🟢 CONFIRMADO |

## 7. Critérios de Aceitação

```gherkin
Cenário: Geração de fatura com derivação determinística
  Dado que o Merchant configurou seu XPUB Bitcoin no IndexedDB local
  Quando o Comprador inicia o checkout de "GitPay Merchant" no catálogo
  Então o sistema deve chamar o void_core para derivar o endereço de recebimento correspondente
  E exibir o QR code da fatura com o endereço correto na tela

Cenário: Confirmação de fatura por consenso descentralizado
  Dado que uma fatura de 100.000 satoshis foi gerada e está pendente
  Quando o comprador envia o pagamento na rede Bitcoin
  Então a PWA deve consultar as 3 APIs de blockchain configuradas (mempool.space, blockstream.info e blockchain.info)
  E se 2 das 3 APIs confirmarem a transação na mempool que atinja a margem de tolerância
  Então o status da fatura deve mudar de pendente para pago e salvar o recibo localmente

Cenário: Carregamento offline da aplicação
  Dado que a aplicação PWA foi acessada anteriormente com internet
  Quando o usuário desativa a conexão de rede e recarrega a página
  Então o Service Worker deve servir o shell da aplicação a partir do cache local
  E os dados do catálogo e configurações devem ser carregados a partir do IndexedDB
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 (Geração determinística de endereços) | Must | Funcionalidade básica de pagamento sem custódia central. |
| RF-02 (Consenso de blockchain descentralizado) | Must | Garante que o merchant valide transações sem expor dados a um servidor próprio. |
| RF-03 (Catálogo de produtos base) | Must | Necessário para testar o ecossistema e viabilizar vendas do Bootstrap. |
| RF-04 (void_core Rust em WASM único e GhostID) | Must | Núcleo de criptografia e privacidade pós-quântica do ecossistema. |
| RF-05 (PWA offline-first e FSD) | Must | Garante a durabilidade, robustez de dados e carregamento do app offline. |
| RF-06 (Conectividade Nostr Ledger cifrado) | Must | Canal de comunicação e persistência distribuída das faturas com privacidade. |
| RNF (Build estático <2MB) | Should | Otimização para distribuição leve em páginas estáticas e dispositivos limitados. |

## 9. Esclarecimentos

### Sessão 2026-06-14

- **Q:** Quais provedores de API de Bitcoin serão os padrões da PWA para verificar as transações na mempool e na blockchain sem dependência de um servidor de backend?
  **R:** mempool.space, blockstream.info e blockchain.info.
- **Q:** Qual a estratégia recomendada para criptografar os metadados das faturas salvas no Nostr Ledger (Kind 30023) para que relays públicos e terceiros não consigam associar compras a IPs ou identidades?
  **R:** Cifragem AES-GCM (NIP-44) utilizando chaves efêmeras derivadas do par de chaves da fatura (GhostID), compartilhadas de forma privada com o comprador durante a geração do checkout.
- **Q:** Como a geração do GhostID (Identidade Efêmera) deve ser implementada nesta versão PWA?
  **R:** Unificar a lógica na compilação do `void_core` em Rust WASM, expondo uma função para derivar a identidade a partir de um pool de entropia caótica passado pelo frontend.

## 10. Lacunas

Nenhuma lacuna ou dúvida pendente nesta versão dos requisitos.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-06-14 | Versão inicial gerada por `/reversa-requirements` | reversa |
| 2026-06-14 | Resolução das dúvidas e integração de decisões por `/reversa-clarify` | reversa |
