import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Global Mocks before imports ---

// Mock sessionStorage
if (typeof sessionStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.sessionStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, val: string) => { store.set(key, val); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => { store.clear(); },
    length: 0,
    key: (index: number) => null
  };
}

const mockInvoicesStore = new Map<string, any>();
const mockIdentitiesStore = new Map<string, any>();

vi.mock('@/db', async () => {
  return {
    db: {
      invoices: {
        clear: async () => { mockInvoicesStore.clear(); },
        put: async (item: any) => { mockInvoicesStore.set(item.id, item); return item.id; },
        get: async (id: string) => { return mockInvoicesStore.get(id) || null; }
      },
      identities: {
        clear: async () => { mockIdentitiesStore.clear(); },
        put: async (item: any) => { mockIdentitiesStore.set(item.id, item); return item.id; },
        get: async (id: string) => { return mockIdentitiesStore.get(id) || null; }
      }
    },
    ensureSessionKey: async () => {
      return await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    },
    encryptPayload: async (payload: any, key: CryptoKey) => {
      const encoder = new TextEncoder();
      const plaintext = encoder.encode(typeof payload === 'string' ? payload : JSON.stringify(payload));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        plaintext
      );
      const combined = new Uint8Array(iv.length + ciphertext.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(ciphertext), iv.length);
      return btoa(String.fromCharCode(...combined));
    },
    decryptPayload: async (encryptedBase64: string, key: CryptoKey) => {
      const binaryString = atob(encryptedBase64);
      const combinedBytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        combinedBytes[i] = binaryString.charCodeAt(i);
      }
      const iv = combinedBytes.slice(0, 12);
      const ciphertextBytes = combinedBytes.slice(12);
      const decryptedBytes = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertextBytes
      );
      const decoder = new TextDecoder();
      const text = decoder.decode(decryptedBytes);
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    }
  };
});

// Import modules after mock definition
import { db, ensureSessionKey, encryptPayload, decryptPayload } from '@/db';
import { createInvoice, registerPayment, isPaymentThresholdMet } from '@/entities/invoice/model';
import { generateGhostID, isIdentityValid } from '@/entities/ghostid/model';
import { checkResourceSafety, startMeshSession, updateMetrics } from '@/entities/mesh/model';
import { getConsensusUtxos } from '@/services/bitcoin';

// --- Test Suite ---

describe('Funcionalidade: Processamento de Checkout GitPay e Validação', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    await db.invoices.clear();
  });

  describe('Cenário: Geração de invoice com aplicação de comissão de suporte probabilística', () => {
    it('should correctly derive addresses and statistically apply developer fee to ~1% of invoices', () => {
      const merchantXpub = 'xpub_merchant_test_key_12345';
      const developerXpub = 'xpub_developer_test_key_67890';
      const mockDerive = (xpub: string, index: number) => `addr_${xpub}_${index}`;

      let devCount = 0;
      let merchantCount = 0;

      // Request 200 consecutive invoices
      for (let i = 0; i < 200; i++) {
        const invoice = createInvoice(5000, merchantXpub, developerXpub, mockDerive, i);
        expect(invoice.address).toBeDefined();
        
        if (invoice.xpubUsed === developerXpub) {
          devCount++;
          expect(invoice.address).toBe(`addr_${developerXpub}_${i}`);
          expect(invoice.developerRoyaltyApplied).toBe(true);
        } else {
          merchantCount++;
          expect(invoice.address).toBe(`addr_${merchantXpub}_${i}`);
          expect(invoice.developerRoyaltyApplied).toBe(false);
        }
      }

      // Check that the vast majority belongs to the merchant
      expect(merchantCount).toBeGreaterThan(180);
      expect(devCount + merchantCount).toBe(200);
    });
  });

  describe('Cenário: Liquidação de fatura com margem de sob-pagamento (underpayment)', () => {
    it('should transition status to paid when payment is within 99.5% threshold', async () => {
      const mockDerive = (xpub: string, index: number) => `addr_${xpub}_${index}`;
      const invoice = createInvoice(10000, 'merchant_xpub', 'dev_xpub', mockDerive, 0);
      
      // Save invoice to database (simulating interface save)
      await db.invoices.put(invoice);

      // Blockchain records a payment of 9960 satoshis (99.6% > 99.5% threshold)
      const isThresholdMet = isPaymentThresholdMet(invoice.amountRequested, 9960);
      expect(isThresholdMet).toBe(true);

      const updated = registerPayment(invoice, 9960, 'txid_underpayment_test');
      expect(updated.status).toBe('paid');
      expect(updated.amountReceived).toBe(9960);
      expect(updated.settledAt).toBeDefined();

      await db.invoices.put(updated);

      const stored = await db.invoices.get(invoice.id);
      expect(stored?.status).toBe('paid');
    });
  });

  describe('Cenário: Reprocessamento de recibo Nostr liquidado não duplica efeito', () => {
    it('should process receipt events idempotently', async () => {
      const testInvoiceId = 'inv-nostr-idempotency-001';
      const initialInvoice = {
        id: testInvoiceId,
        amountRequested: 5000,
        amountReceived: 4980, // Paid within threshold
        address: 'addr_idempotency_test',
        xpubUsed: 'xpub_m',
        status: 'paid' as const,
        createdAt: Date.now() - 60000,
        settledAt: Date.now() - 30000,
        developerRoyaltyApplied: false
      };

      await db.invoices.put(initialInvoice);

      const stored = await db.invoices.get(testInvoiceId);
      expect(stored?.status).toBe('paid');
      const originalSettledAt = stored?.settledAt;

      // Nostr service receives a duplicate Kind 23001 event
      const reProcessed = registerPayment(stored!, 5000, 'txid_duplicate_run');
      
      expect(reProcessed.status).toBe('paid');
      expect(reProcessed.amountReceived).toBe(4980); // Remains unchanged
      expect(reProcessed.settledAt).toBe(originalSettledAt); // Unchanged timestamp

      await db.invoices.put(reProcessed);
      const afterDuplicate = await db.invoices.get(testInvoiceId);
      expect(afterDuplicate?.status).toBe('paid');
      expect(afterDuplicate?.settledAt).toBe(originalSettledAt);
    });
  });

  describe('Cenário: Verificação de pagamento com falha parcial de APIs Bitcoin', () => {
    it('should achieve consensus and settle invoice when 1 out of 3 APIs fails', async () => {
      const mockUtxos = [
        { txid: 'consensus_tx_001', vout: 0, value: 10000, status: { confirmed: true, block_height: 840000 } }
      ];

      // Mock fetch: mempool.space fails, blockstream and emzy succeed
      vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
        const urlStr = typeof url === 'string' ? url : (url as any).toString();
        if (urlStr.includes('mempool.space')) {
          return Promise.reject(new Error('mempool.space timeout (504 Gateway Timeout)'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUtxos)
        } as Response);
      });

      const consensus = await getConsensusUtxos('address_consensus_test', 840005);
      
      // Consensus is achieved because 2 APIs out of 3 (blockstream & emzy) returned the UTXO
      expect(consensus.length).toBe(1);
      expect(consensus[0].txid).toBe('consensus_tx_001');
      expect(consensus[0].amount).toBe(10000);
      expect(consensus[0].confirmations).toBe(6); // 840005 - 840000 + 1 = 6
    });
  });
});

describe('Funcionalidade: Ciclo de Vida da Identidade Efêmera GhostID', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    await db.identities.clear();
  });

  describe('Cenário: Geração de chave pública e privada GhostID sem conexão de rede', () => {
    it('should generate, encrypt and store a valid GhostID offline', async () => {
      const sessionKey = await ensureSessionKey();
      expect(sessionKey).toBeDefined();

      // Mock generator values (simulating secure random keypair generation)
      const alias = 'sk_pqc_test_offline_id';
      const mockPrivateKeyBytes = new Uint8Array(32);
      crypto.getRandomValues(mockPrivateKeyBytes);
      const mockPrivateKeyHex = Array.from(mockPrivateKeyBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      
      const mockPublicKeyBytes = new Uint8Array(32);
      crypto.getRandomValues(mockPublicKeyBytes);
      const mockPublicKeyHex = Array.from(mockPublicKeyBytes).map(b => b.toString(16).padStart(2, '0')).join('');

      // Encrypt the private key using AES-GCM-256
      const encryptedPrivateKey = await encryptPayload(mockPrivateKeyHex, sessionKey);
      expect(encryptedPrivateKey).toBeDefined();

      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24h expiration
      const identity = {
        id: alias,
        pubkey: mockPublicKeyHex,
        encryptedPrivateKey,
        createdAt: Date.now(),
        expiresAt
      };

      await db.identities.put(identity);

      const stored = await db.identities.get(alias);
      expect(stored).toBeDefined();
      expect(stored?.pubkey).toBe(mockPublicKeyHex);
      
      // Decrypt and verify private key matches
      const decryptedPriv = await decryptPayload(stored!.encryptedPrivateKey, sessionKey);
      expect(decryptedPriv).toBe(mockPrivateKeyHex);
    });
  });

  describe('Cenário: Expiração automática de chave GhostID local', () => {
    it('should identify expired GhostIDs correctly', () => {
      // Identity expires in 2 hours
      const identity = generateGhostID('ghost_exp_01', 'pubkey_exp_01', 2);
      expect(isIdentityValid(identity)).toBe(true);

      // Move virtual clock 3 hours into the future
      vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 3 * 60 * 60 * 1000);
      
      expect(isIdentityValid(identity)).toBe(false);
    });
  });
});

describe('Funcionalidade: Controle de Recursos Locais da Malha (LSC Guard)', () => {
  describe('Cenário: Suspensão de processamento em background devido a bateria baixa', () => {
    it('should trigger resource safety safety warning and transition state to suspended on low battery (< 20%)', () => {
      // Healthy state: CPU 1%, Battery 100%
      const healthyCheck = checkResourceSafety(0.01, 1.0);
      expect(healthyCheck.safe).toBe(true);

      // Low battery: CPU 1%, Battery 15% (< 20% limit)
      const batteryLowCheck = checkResourceSafety(0.01, 0.15);
      expect(batteryLowCheck.safe).toBe(false);
      expect(batteryLowCheck.reason).toBe('BATTERY_LOW');

      // Setup running session
      const session = startMeshSession('mesh_low_battery_test_001', 0.01, 0.9);
      expect(session.status).toBe('running');

      // Battery drops to 12%
      const { session: degraded, eventTriggered } = updateMetrics(session, 0.01, 0.12);
      expect(degraded.status).toBe('suspended');
      expect(degraded.suspendedReason).toBe('BATTERY_LOW');
      expect(eventTriggered).toBe('ProcessingSuspended');
    });
  });
});
