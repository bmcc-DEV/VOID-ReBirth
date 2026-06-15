# Legacy Impact: void-rebirth-pwa

> Identificador: `001-void-rebirth-pwa`
> Data: 2026-06-14

Este documento mapeia os impactos da implementação e consolidação do fluxo da PWA estática React sobre a arquitetura e regras de negócio do legado extraídas em `_reversa_sdd/`.

---

## 1. Tabela de Impactos por Componente

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|---|---|---|---|---|
| `src/features/gitpay/ui/Checkout.tsx` | GitPay Checkout | `componente-novo` | HIGH | Substitui o checkout estático legado do GitPay portando-o para uma feature React integrada na PWA sob arquitetura FSD. |
| `src/shared/api/void_core.ts` | void_core WASM | `componente-novo` | HIGH | Consolidação do carregamento assíncrono do binário Rust WebAssembly client-side. |
| `src/features/gitpay/api/consensus.ts` | GitPay Checkout | `contrato-novo` | MEDIUM | Interface de consenso 2-de-3 para verificação de blockchain direta pelo navegador. |
| `src/features/nostr/api/encrypt.ts` | Nostr Ledger | `contrato-novo` | MEDIUM | Cifragem simétrica AES-GCM (NIP-44) com chaves GhostID para as faturas enviadas no Nostr. |
| `/GitPay` | GitPay Checkout | `componente-extinto` | HIGH | Diretório do GitPay legado é desativado e substituído pela feature unificada no React. |
| `/ET-COSMIC/server` | ET-COSMIC Server | `componente-extinto` | HIGH | Servidor Node/Express de faturamento é descontinuado no MVP para viabilizar local-first. |

---

## 2. Diff Conceitual por Componente

### GitPay Checkout
A lógica de checkout Bitcoin deixa de operar como uma página estática isolada em Javascript puro (`/GitPay/index.html`) e é incorporada à arquitetura FSD no React. As chaves BIP32 são mantidas locais no IndexedDB e o faturamento opera diretamente via APIs públicas do navegador sem expor informações.

### void_core Rust WASM
O compilado em Rust deixa de ser acessado por rotas no servidor Express local e passa a ser instanciado via JS import na inicialização da PWA, realizando a encriptação local-first de faturas e GhostID diretamente no browser do usuário.

---

## 3. Regras de Negócio Preservadas

* **Tolerância a subpagamentos** (`_reversa_sdd/domain.md#tolerancia-de-pagamento-e-underpayment-gitpay`): A regra matemática de tolerância de aceitação da fatura é preservada intacta na verificação cliente-side. 🟢
* **Taxa probabilística de suporte** (`_reversa_sdd/domain.md#taxa-de-suporte-tecnico-probabilistica-gitpay`): O desvio estatístico probabilístico de 1% das faturas para o XPUB do desenvolvedor para autofinanciamento é mantido sem alterações na lógica. 🟢

---

## 4. Regras de Negócio Modificadas

* **Nostr Ledger** (`_reversa_sdd/domain.md#nostr-ledger`): Alterada para requerer criptografia simétrica AES-GCM (NIP-44) com chaves GhostID descartáveis da fatura, em vez de salvar metadados em texto claro ou em NIP-04 legado. 🟢
