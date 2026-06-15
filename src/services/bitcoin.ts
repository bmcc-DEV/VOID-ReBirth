export interface BitcoinUtxo {
  txid: string;
  vout: number;
  value: number; // in Satoshis
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
}

export interface ConsolidatedUtxo {
  txid: string;
  vout: number;
  amount: number; // in Satoshis
  confirmations: number;
}

const BITCOIN_ENDPOINTS = [
  'https://mempool.space/api',
  'https://blockstream.info/api',
  'https://mempool.emzy.de/api'
];

/**
 * Fetches UTXOs for a given address from a specific base URL.
 * Times out after 4 seconds and handles network errors gracefully.
 */
async function fetchUtxosFromApi(baseUrl: string, address: string): Promise<BitcoinUtxo[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`${baseUrl}/address/${address}/utxo`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (e) {
    console.warn(`[BitcoinService] API failure for ${baseUrl}:`, e);
    clearTimeout(timeoutId);
    return [];
  }
}

/**
 * Resolves blockchain consensus using a local voting rule.
 * A transaction UTXO is trusted if reported identically by at least 2 out of the 3 APIs.
 */
export async function getConsensusUtxos(address: string, currentBlockHeight?: number): Promise<ConsolidatedUtxo[]> {
  // Query all 3 APIs in parallel
  const fetchPromises = BITCOIN_ENDPOINTS.map((url) => fetchUtxosFromApi(url, address));
  const results = await Promise.all(fetchPromises);

  // Group UTXOs by unique key: txid:vout
  const utxoVotes = new Map<string, { utxo: BitcoinUtxo; count: number }>();

  results.forEach((apiResult) => {
    if (!apiResult || !Array.isArray(apiResult)) return;

    apiResult.forEach((utxo) => {
      const key = `${utxo.txid}:${utxo.vout}`;
      const existing = utxoVotes.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        utxoVotes.set(key, { utxo, count: 1 });
      }
    });
  });

  const consolidated: ConsolidatedUtxo[] = [];

  // Filter for UTXOs having at least 2 votes (consensus threshold)
  for (const [_, voteInfo] of utxoVotes.entries()) {
    if (voteInfo.count >= 2) {
      const { utxo } = voteInfo;
      
      // Calculate confirmations locally or default to 1 if confirmed
      let confirmations = 0;
      if (utxo.status.confirmed) {
        if (currentBlockHeight && utxo.status.block_height) {
          confirmations = Math.max(1, currentBlockHeight - utxo.status.block_height + 1);
        } else {
          confirmations = 1;
        }
      }

      consolidated.push({
        txid: utxo.txid,
        vout: utxo.vout,
        amount: utxo.value,
        confirmations
      });
    }
  }

  return consolidated;
}

/**
 * Fetches the current tip block height from blockstream/mempool to calculate confirmations.
 */
export async function fetchCurrentBlockHeight(): Promise<number> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  for (const baseUrl of BITCOIN_ENDPOINTS) {
    try {
      const response = await fetch(`${baseUrl}/blocks/tip/height`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const height = parseInt(await response.text(), 10);
        if (!isNaN(height)) return height;
      }
    } catch {
      // try next endpoint
    }
  }
  clearTimeout(timeoutId);
  return 0; // fallback
}
