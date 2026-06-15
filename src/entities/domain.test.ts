import { describe, it, expect, vi } from 'vitest';
import { isPaymentThresholdMet, createInvoice, registerPayment } from './invoice/model';
import { generateGhostID, isIdentityValid, rotateGhostID } from './ghostid/model';
import { checkResourceSafety, startMeshSession, updateMetrics } from './mesh/model';

describe('AGG-Invoice Invariants', () => {
  it('should validate payment threshold under BR-MIGRAR-001', () => {
    // 99.5% of 1000 Sats is 995 Sats
    expect(isPaymentThresholdMet(1000, 995)).toBe(true);
    expect(isPaymentThresholdMet(1000, 994)).toBe(false);
    expect(isPaymentThresholdMet(1000, 1000)).toBe(true);
  });

  it('should apply probabilistic developer fee under BR-MIGRAR-002', () => {
    const merchantXpub = 'xpub_merchant';
    const developerXpub = 'xpub_developer';
    const mockDerive = (xpub: string, index: number) => `${xpub}_addr_${index}`;

    // Test with Math.random returning < 0.01 (royalty triggered)
    vi.spyOn(Math, 'random').mockReturnValue(0.005);
    const invoiceWithRoyalty = createInvoice(1000, merchantXpub, developerXpub, mockDerive, 1);
    expect(invoiceWithRoyalty.xpubUsed).toBe(developerXpub);
    expect(invoiceWithRoyalty.address).toBe('xpub_developer_addr_1');
    expect(invoiceWithRoyalty.developerRoyaltyApplied).toBe(true);

    // Test with Math.random returning >= 0.01 (no royalty)
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const invoiceNormal = createInvoice(1000, merchantXpub, developerXpub, mockDerive, 1);
    expect(invoiceNormal.xpubUsed).toBe(merchantXpub);
    expect(invoiceNormal.address).toBe('xpub_merchant_addr_1');
    expect(invoiceNormal.developerRoyaltyApplied).toBe(false);

    vi.spyOn(Math, 'random').mockRestore();
  });

  it('should transition to paid status on valid registerPayment', () => {
    const mockInvoice = createInvoice(1000, 'xpub1', 'xpub2', (x) => x, 0);
    
    // Register partial payment (not yet met)
    const step1 = registerPayment(mockInvoice, 500, 'tx_hash_1');
    expect(step1.status).toBe('pending');
    expect(step1.amountReceived).toBe(500);

    // Register remainder meeting threshold (total 995 >= 1000 * 0.995)
    const step2 = registerPayment(step1, 495, 'tx_hash_2');
    expect(step2.status).toBe('paid');
    expect(step2.amountReceived).toBe(995);
    expect(step2.settledAt).toBeDefined();
  });
});

describe('AGG-GhostID Invariants', () => {
  it('should enforce short TTL expiration', () => {
    const identity = generateGhostID('key_1', 'pubkey_1', 2); // 2 hours TTL
    expect(isIdentityValid(identity)).toBe(true);

    // Shift time forwards by 3 hours
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 3 * 60 * 60 * 1000);
    expect(isIdentityValid(identity)).toBe(false);
    
    vi.spyOn(Date, 'now').mockRestore();
  });

  it('should correctly rotate keys', () => {
    const oldId = generateGhostID('key_1', 'pubkey_1', 24);
    const { revokedOld, newIdentity } = rotateGhostID(oldId, 'key_2', 'pubkey_2', 24);

    expect(revokedOld.revoked).toBe(true);
    expect(isIdentityValid(revokedOld)).toBe(false);
    expect(newIdentity.id).toBe('key_2');
    expect(newIdentity.pubkey).toBe('pubkey_2');
    expect(isIdentityValid(newIdentity)).toBe(true);
  });
});

describe('AGG-MeshSession Invariants', () => {
  it('should suspend processing under LSC Guard limits (BR-MIGRAR-004)', () => {
    // Standard safe resource level: CPU 2%, Battery 80%
    const statusSafe = checkResourceSafety(0.02, 0.8);
    expect(statusSafe.safe).toBe(true);

    // Excessive CPU: CPU 6% (> 5%)
    const statusCpuLimit = checkResourceSafety(0.06, 0.8);
    expect(statusCpuLimit.safe).toBe(false);
    expect(statusCpuLimit.reason).toBe('CPU_EXCEEDED');

    // Low Battery: Battery 15% (< 20%)
    const statusBatteryLimit = checkResourceSafety(0.02, 0.15);
    expect(statusBatteryLimit.safe).toBe(false);
    expect(statusBatteryLimit.reason).toBe('BATTERY_LOW');
  });

  it('should transition status and emit events when metrics degrade', () => {
    const session = startMeshSession('session_1', 0.01, 0.9);
    expect(session.status).toBe('running');

    // CPU degrades
    const { session: degraded, eventTriggered } = updateMetrics(session, 0.08, 0.9);
    expect(degraded.status).toBe('suspended');
    expect(degraded.suspendedReason).toBe('CPU_EXCEEDED');
    expect(eventTriggered).toBe('ProcessingSuspended');

    // CPU restores
    const { session: restored, eventTriggered: event2 } = updateMetrics(degraded, 0.01, 0.9);
    expect(restored.status).toBe('running');
    expect(restored.suspendedReason).toBeUndefined();
    expect(event2).toBe('ProcessingResumed');
  });
});
