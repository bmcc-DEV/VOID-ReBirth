# Interface: nostr-ledger-protocol

> Identificador: `001-void-rebirth-pwa`
> Tipo: WebSocket / Nostr Protocol (Kind 30023 & Kind 23001)
> Data: 2026-06-14

Interface e formato dos payloads para sincronização e backup descentralizado das faturas criptografadas da PWA local-first com a rede de relays do Nostr Ledger.

---

## 1. Conexão WebSocket e Ciclo de Vida

O cliente estabelece conexões WebSocket simultâneas com a lista de relays Nostr configurados no IndexedDB do merchant (padrão de pelo menos 3 relays).
- **Protocolo**: `wss://`
- **Reconexão**: Backoff exponencial com início em 2000ms, limite máximo de 30000ms.

---

## 2. Estrutura e Formato dos Eventos

### A. Publicação de Faturas (Kind 30023 - Long-form Content)
Armazena a representação cifrada de faturas ativas e liquidadas do merchant. O conteúdo do evento (`content`) é encriptado via AES-256-GCM (NIP-44) usando a chave simétrica derivada do GhostID efêmero da fatura.

* **Payload do Evento Nostr**:
  ```json
  {
    "id": "[sha256_do_evento]",
    "pubkey": "[ghost_id_public_key]",
    "created_at": 1718398800,
    "kind": 30023,
    "tags": [
      ["d", "invoice_[invoice_id]"],
      ["title", "Fatura Criptografada void-rebirth"],
      ["p", "[merchant_public_key]"],
      ["t", "void-rebirth-invoice"]
    ],
    "content": "[payload_json_cifrado_aes_gcm_nip44_base64]",
    "sig": "[assinatura_ed25519_com_chave_privada_ghost_id]"
  }
  ```

* **Payload Cifrado (`content` após decifragem)**:
  ```json
  {
    "invoice_id": "inv_12345",
    "product_id": "gitpay-merchant",
    "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    "amount_sats": 100000,
    "status": "paid",
    "created_at": 1718398800,
    "resolved_at": 1718398920
  }
  ```

### B. Emissão de Recibos de Pagamento (Kind 23001 - Transaction Receipt)
Emitido pelo merchant para validar que o pagamento foi conciliado por consenso.

* **Payload do Evento Nostr**:
  ```json
  {
    "id": "[sha256_do_evento]",
    "pubkey": "[merchant_public_key]",
    "created_at": 1718398920,
    "kind": 23001,
    "tags": [
      ["e", "[id_do_evento_kind_30023_da_fatura]"],
      ["p", "[ghost_id_public_key_do_comprador]"]
    ],
    "content": "Recibo de Liquidação Gerado via Consenso Cliente-Side",
    "sig": "[assinatura_ed25519_com_chave_privada_do_merchant]"
  }
  ```

---

## 3. Segurança e Privacidade
- **Chaves de Fatura (GhostID)**: Para cada fatura gerada, um par de chaves descartável (GhostID) é criado em Rust WASM. O comprador usa a chave pública do GhostID para assinar a solicitação de checkout, e o conteúdo correspondente é encriptado de modo que relays intermediários Nostr não consigam descriptografar ou correlacionar transações à chave pública principal do merchant.
- **Assinatura**: Todas as mensagens transmitidas são assinadas usando assinaturas Schnorr compatíveis com o protocolo Nostr de forma nativa.
