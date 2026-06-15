# Regression Watch: void-rebirth-pwa

> Identificador: `001-void-rebirth-pwa`

Este arquivo define os pontos de verificação (watch items) que devem permanecer verdadeiros nas futuras execuções de engenharia reversa do Reversa, garantindo que as regras de negócio preservadas ou alteradas nesta feature não sofram regressões de escrita no código.

---

## 1. Tabela de Watch Items de Regressão

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|---|---|---|---|---|
| W001 | `_reversa_sdd/domain.md#tolerancia-de-pagamento-e-underpayment-gitpay` | A fatura deve mudar para status `paid` se o valor pago atingir 99.5% do solicitado (margem de tolerância). | `presença` | Faturas com pagamento de 99.6% recusadas ou exigência fixa de 100% de valor no checkout. |
| W002 | `_reversa_sdd/domain.md#taxa-de-suporte-tecnico-probabilistica-gitpay` | Redirecionamento probabilístico de 1% das faturas para o `DEVELOPER_XPUB` do criador. | `presença` | Desvio estatístico ausente na geração de endereços da PWA. |
| W003 | `_reversa_sdd/domain.md#nostr-ledger` | Encriptação AES-GCM (NIP-44) com chaves efêmeras GhostID de fatura antes da publicação em relays Nostr. | `redação` | Envio de faturas em texto claro (Kind 30023) ou uso de NIP-04 obsoleto. |

---

## 2. Histórico de Re-extrações

### Re-extração 2026-06-14 21:31

| ID | Veredito | Observação |
|----|----------|------------|
| W001 | 🟢 verde | regra de tolerância de pagamento confirmada em [domain.md](file:///run/media/bruno/Bruno/ET-COSMIC-GitPay/_reversa_sdd/domain.md#1-tolerancia-de-pagamento-e-consenso-blockchain-gitpay) |
| W002 | 🟢 verde | regra de taxa de suporte técnico probabilística confirmada em [domain.md](file:///run/media/bruno/Bruno/ET-COSMIC-GitPay/_reversa_sdd/domain.md#2-taxa-de-suporte-tecnico-probabilistica-gitpay) |
| W003 | 🟢 verde | regra de encriptação (NIP-44) confirmada em [domain.md](file:///run/media/bruno/Bruno/ET-COSMIC-GitPay/_reversa_sdd/domain.md) sob Nostr Ledger |

---

## 3. Observações

*(Nenhuma observação cadastrada nesta versão).*
