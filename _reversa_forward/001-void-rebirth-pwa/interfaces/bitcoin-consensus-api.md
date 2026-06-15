# Interface: bitcoin-consensus-api

> Identificador: `001-void-rebirth-pwa`
> Tipo: HTTP / GET
> Data: 2026-06-14

Interface de consulta externa cliente-side para conciliação descentralizada de transações na mempool e na blockchain Bitcoin, consumindo 3 provedores independentes para evitar pontos únicos de falha.

---

## 1. Provedores Configurados

Para estabelecer consenso, o cliente fará requisições HTTP GET assíncronas paralelas aos endpoints de saldo e transações dos seguintes serviços:

1. **Mempool.space API**: `https://mempool.space/api`
2. **Blockstream.info API**: `https://blockstream.info/api`
3. **Blockchain.info API**: `https://blockchain.info`

---

## 2. Endpoints e Parâmetros

### A. Consulta de Endereço (Mempool.space & Blockstream.info)
Retorna a lista de transações associadas ao endereço Bitcoin do merchant para análise de saldo recebido.

* **URL**: `GET /address/{address}/txs`
* **Headers**: `Accept: application/json`
* **Response Exemplo (200 OK)**:
  ```json
  [
    {
      "txid": "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
      "version": 1,
      "locktime": 0,
      "vin": [...],
      "vout": [
        {
          "scriptpubkey": "76a914...",
          "scriptpubkey_asm": "OP_DUP OP_HASH160...",
          "scriptpubkey_type": "p2pkh",
          "scriptpubkey_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
          "value": 100000
        }
      ],
      "status": {
        "confirmed": true,
        "block_height": 170,
        "block_hash": "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
        "block_time": 1231006505
      }
    }
  ]
  ```

### B. Consulta de Endereço (Blockchain.info)
Endpoint alternativo usado como terceiro voto no consenso.

* **URL**: `GET /rawaddr/{address}`
* **Response Exemplo (200 OK)**:
  ```json
  {
    "hash160": "62e90771b83897711200...",
    "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    "n_tx": 1,
    "total_received": 100000,
    "total_sent": 0,
    "final_balance": 100000,
    "txs": [
      {
        "hash": "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
        "block_height": 170,
        "out": [
          {
            "value": 100000,
            "addr": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
          }
        ]
      }
    ]
  }
  ```

---

## 3. Lógica de Idempotência e Consenso
- **Timeout**: O cliente aplica timeout fixo de 8000ms para cada chamada de API. Provedores que estourarem o tempo ou retornarem erros HTTP (4xx, 5xx) são desconsiderados do voto daquela rodada.
- **Consenso**: O status da fatura é atualizado para `paid` apenas se pelo menos 2 dos provedores consultados reportarem a transação correspondente ao valor solicitado (considerando a tolerância) pendente na mempool ou confirmada na blockchain.
- **Retentativas**: Em caso de falha de conexão, as APIs são consultadas novamente a cada 15 segundos.
