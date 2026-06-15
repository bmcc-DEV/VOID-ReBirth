import { SimplePool, finalizeEvent } from 'nostr-tools';

export const NOSTR_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.nostr.band',
  'wss://nostr.mom'
];

// Singleton instance of SimplePool from nostr-tools
const pool = new SimplePool();

export interface NostrInvoicePayload {
  id: string;
  amount: number;
  address: string;
  xpub: string;
  createdAt: number;
}

export interface NostrReceiptPayload {
  invoiceId: string;
  txid: string;
  amountPaid: number;
  settledAt: number;
}

// Helper to convert hex string to Uint8Array
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Publishes an invoice to the Nostr relays as Kind 30023 (Long-form content / custom).
 */
export async function publishInvoiceEvent(
  payload: NostrInvoicePayload,
  privKeyHex: string
): Promise<any> {
  const privKeyBytes = hexToBytes(privKeyHex);
  const now = Math.floor(Date.now() / 1000);

  const template = {
    kind: 30023,
    created_at: now,
    tags: [
      ['d', payload.id],
      ['amount', payload.amount.toString()],
      ['address', payload.address],
      ['xpub', payload.xpub]
    ],
    content: JSON.stringify(payload)
  };

  const event = finalizeEvent(template, privKeyBytes);

  // Publish in parallel to all active relays
  const pubs = pool.publish(NOSTR_RELAYS, event);
  await Promise.all(pubs);

  return event;
}

/**
 * Publishes a payment receipt to the Nostr relays as Kind 23001 (Custom transaction proof).
 */
export async function publishReceiptEvent(
  payload: NostrReceiptPayload,
  privKeyHex: string
): Promise<any> {
  const privKeyBytes = hexToBytes(privKeyHex);
  const now = Math.floor(Date.now() / 1000);

  const template = {
    kind: 23001,
    created_at: now,
    tags: [
      ['d', payload.invoiceId],
      ['txid', payload.txid],
      ['amount_paid', payload.amountPaid.toString()],
      ['settled_at', payload.settledAt.toString()]
    ],
    content: JSON.stringify(payload)
  };

  const event = finalizeEvent(template, privKeyBytes);

  const pubs = pool.publish(NOSTR_RELAYS, event);
  await Promise.all(pubs);

  return event;
}

/**
 * Subscribes to payment receipt events (Kind 23001) for a specific invoice ID.
 */
export function subscribeToInvoiceReceipt(
  invoiceId: string,
  onReceipt: (receipt: NostrReceiptPayload) => void
): () => void {
  const sub = pool.subscribeMany(
    NOSTR_RELAYS,
    [
      {
        kinds: [23001],
        '#d': [invoiceId]
      }
    ],
    {
      onevent(event) {
        try {
          const payload: NostrReceiptPayload = JSON.parse(event.content);
          onReceipt(payload);
        } catch (e) {
          console.warn('[NostrService] Failed to parse receipt event payload:', e);
        }
      }
    }
  );

  // Return unsubscribe cleanup function
  return () => {
    sub.close();
  };
}
