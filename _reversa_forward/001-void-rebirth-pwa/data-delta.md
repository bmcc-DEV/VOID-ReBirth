# Data Delta: void-rebirth-pwa

> Identificador: `001-void-rebirth-pwa`
> Data: 2026-06-14
> Modelo de referência: `_reversa_sdd/erd-complete.md`

## 1. Diff Conceitual sobre o Legado

No ecossistema legado, a persistência do GitPay baseava-se em configurações estáticas no código (`app.js`) ou simples variáveis no `localStorage`. Para viabilizar a PWA local-first e offline-first com catálogo e histórico robustos, estruturamos uma modelagem IndexedDB em `shared/api/indexeddb/` composta por 3 Object Stores principais:

```
                  +--------------------------------+
                  |         IndexedDB              |
                  +--------------------------------+
                                  |
         +------------------------+------------------------+
         |                        |                        |
         v                        v                        v
+------------------+     +------------------+     +------------------+
| merchant_config  |     |     products     |     |     invoices     |
+------------------+     +------------------+     +------------------+
| key: 'xpub' etc. |     | keyPath: 'id'    |     | keyPath: 'id'    |
+------------------+     +------------------+     +------------------+
```

---

## 2. Novos Esquemas de Dados (IndexedDB)

### Store 1: `merchant_config`
Armazena chaves privadas e dados operacionais de recebimento do merchant:
- `key` (String, keyPath): Chave identificadora da configuração (ex: `xpup_key`, `relays`, `tolerance`).
- `value` (Any): Conteúdo da configuração.
  - Exemplo para `xpub_key`: `{ xpub: "xpub...", ypub: "ypub...", zpub: "zpub..." }`
  - Exemplo para `relays`: `["wss://relay.damus.io", "wss://nos.lol"]`

### Store 2: `products`
Modelagem do catálogo de itens disponíveis para checkout:
- `id` (String, keyPath): Identificador do produto (ex: `gitpay-merchant`, `pqc-audit`).
- `name` (String): Nome comercial do produto.
- `description` (String): Detalhamento dos recursos inclusos.
- `price_sats` (Number): Preço base em Satoshis.
- `price_sov` (Number): Preço equivalente em tokens $SOV.
- `icon` (String): Slug de identificador visual do design system.

### Store 3: `invoices`
Histórico de faturas geradas e liquidadas localmente:
- `id` (String, keyPath): Hash único da fatura.
- `product_id` (String): ID do produto do catálogo relacionado.
- `address` (String, Index): Endereço Bitcoin gerado determinística via BIP32.
- `amount_requested_sats` (Number): Quantia em satoshis exigida.
- `amount_received_sats` (Number): Quantia real detectada em mempool/blockchain.
- `tolerance_applied` (Number): Percentual de tolerância de subpagamento aplicado.
- `status` (String, Index): Estado da fatura (`pending`, `paid`, `underpaid`).
- `ghost_id` (String): Chave efêmera Nostr de cifragem da fatura.
- `created_at` (Number): Timestamp do faturamento.
- `resolved_at` (Number): Timestamp da confirmação de pagamento.

---

## 3. Plano de Inicialização e Sincronização

1. **População do Catálogo de Produtos**: Na primeira execução do aplicativo (quando o IndexedDB for criado na versão 1), o script de inicialização do banco local irá popular a store `products` com as informações padrão dos 3 produtos iniciais descritos nos requisitos.
2. **Upgrade de Versão**: Caso a PWA precise atualizar tabelas futuras (como registros de canais LoRa/BLE da v2), incrementamos a versão do banco no `shared/api/indexeddb/` aplicando migrações clássicas do `onupgradeneeded` de forma não destrutiva.
