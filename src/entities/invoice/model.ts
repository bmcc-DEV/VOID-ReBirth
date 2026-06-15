export interface UTXO {
  txid: string;
  vout: number;
  amount: number;
  confirmations: number;
}

export interface Invoice {
  id: string;
  amountRequested: number; // in Satoshis
  amountReceived: number;  // in Satoshis
  address: string;         // Bitcoin address derived for this payment
  xpubUsed: string;
  status: 'pending' | 'paid' | 'expired';
  createdAt: number;
  settledAt?: number;
  developerRoyaltyApplied: boolean;
}

// Invariants
export const PAYMENT_TOLERANCE_THRESHOLD = 0.995; // 99.5% threshold (BR-MIGRAR-001)
export const DEVELOPER_FEE_PROBABILITY = 0.01;      // 1% probabilistic royalty (BR-MIGRAR-002)

/**
 * Checks if the received amount is within the acceptable payment tolerance.
 */
export function isPaymentThresholdMet(requested: number, received: number): boolean {
  if (requested <= 0) return true;
  return received >= requested * PAYMENT_TOLERANCE_THRESHOLD;
}

/**
 * Creates a new Invoice entity.
 * Implements the probabilistic support fee (BR-MIGRAR-002) by swapping xpubs.
 */
export function createInvoice(
  amountRequested: number,
  merchantXpub: string,
  developerXpub: string,
  deriveAddressFn: (xpub: string, index: number) => string,
  addressIndex: number
): Invoice {
  const roll = Math.random();
  const applyRoyalty = roll < DEVELOPER_FEE_PROBABILITY && !!developerXpub;
  const xpubUsed = applyRoyalty ? developerXpub : merchantXpub;
  
  // Derive the target address based on selected XPUB
  const address = deriveAddressFn(xpubUsed, addressIndex);
  
  return {
    id: `inv_${crypto.randomUUID()}`,
    amountRequested,
    amountReceived: 0,
    address,
    xpubUsed,
    status: 'pending',
    createdAt: Date.now(),
    developerRoyaltyApplied: applyRoyalty
  };
}

/**
 * Registers an incoming payment update for an invoice.
 * Transitions status to 'paid' if threshold is met.
 */
export function registerPayment(
  invoice: Invoice,
  amountPaid: number,
  txid: string // Transaction Reference
): Invoice {
  if (invoice.status !== 'pending') return invoice;

  const newAmountReceived = invoice.amountReceived + amountPaid;
  const met = isPaymentThresholdMet(invoice.amountRequested, newAmountReceived);

  return {
    ...invoice,
    amountReceived: newAmountReceived,
    status: met ? 'paid' : 'pending',
    settledAt: met ? Date.now() : undefined
  };
}

/**
 * Forces an invoice into expired status if appropriate.
 */
export function expireInvoice(invoice: Invoice): Invoice {
  if (invoice.status !== 'pending') return invoice;
  return {
    ...invoice,
    status: 'expired'
  };
}
