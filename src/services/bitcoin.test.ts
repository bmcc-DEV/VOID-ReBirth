import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getConsensusUtxos } from './bitcoin';

describe('Bitcoin Consensus Service (BR-MIGRAR-007)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should achieve consensus when all 3 APIs return the same UTXO', async () => {
    const mockUtxos = [
      { txid: 'tx1', vout: 0, value: 50000, status: { confirmed: true, block_height: 800000 } }
    ];

    vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUtxos)
      } as Response);
    });

    const result = await getConsensusUtxos('address1', 800005);
    expect(result.length).toBe(1);
    expect(result[0].txid).toBe('tx1');
    expect(result[0].amount).toBe(50000);
    expect(result[0].confirmations).toBe(6); // 800005 - 800000 + 1 = 6
  });

  it('should achieve consensus when 2/3 APIs return the UTXO and 1 fails', async () => {
    const mockUtxos = [
      { txid: 'tx1', vout: 0, value: 50000, status: { confirmed: true, block_height: 800000 } }
    ];

    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      const urlStr = typeof url === 'string' ? url : (url as any).toString();
      if (urlStr.includes('emzy')) {
        // emzy fails
        return Promise.reject(new Error('API Down'));
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUtxos)
      } as Response);
    });

    const result = await getConsensusUtxos('address1', 800005);
    expect(result.length).toBe(1);
    expect(result[0].txid).toBe('tx1');
    expect(result[0].amount).toBe(50000);
  });

  it('should fail consensus when only 1 API returns the UTXO and 2 fail', async () => {
    const mockUtxos = [
      { txid: 'tx1', vout: 0, value: 50000, status: { confirmed: true, block_height: 800000 } }
    ];

    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      const urlStr = typeof url === 'string' ? url : (url as any).toString();
      if (urlStr.includes('blockstream') || urlStr.includes('emzy')) {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve([])
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUtxos)
      } as Response);
    });

    const result = await getConsensusUtxos('address1', 800005);
    expect(result.length).toBe(0); // Only 1 vote, below consensus threshold (>= 2)
  });
});
