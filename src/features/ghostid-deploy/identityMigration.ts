import { Identity } from '@/db';

export interface LegacyDevData {
  key: string;
  name: string;
  balanceSat: number;
  totalRequests: number;
  createdAt: number;
}

export function bufToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  }

export function hexToBuf(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

/**
 * Converts a raw legacy JSON keys map into target GhostID Identity objects.
 */
export async function convertLegacyKeys(
  rawJson: any,
  sessionKey: CryptoKey,
  encryptPayloadFn: (payload: any, key: CryptoKey) => Promise<string>
): Promise<{ successful: number; skipped: number; identities: Identity[] }> {
  if (typeof rawJson !== 'object' || rawJson === null) {
    throw new Error("Formato inválido. O arquivo de chaves deve ser um objeto JSON.");
  }

  let successful = 0;
  let skipped = 0;
  const identities: Identity[] = [];

  for (const [key, value] of Object.entries(rawJson)) {
    const devData = value as Partial<LegacyDevData>;
    const isValidKey = key.startsWith('sk_pqc_');
    
    if (isValidKey && devData && typeof devData.name === 'string') {
      try {
        // Generate local-first Ed25519 keypair for the GhostID
        const keyPair = await crypto.subtle.generateKey(
          { name: 'Ed25519' },
          true,
          ['sign', 'verify']
        );

        const pubKeyHex = bufToHex(await crypto.subtle.exportKey('raw', keyPair.publicKey));
        const privKeyPkcs8 = bufToHex(await crypto.subtle.exportKey('pkcs8', keyPair.privateKey));

        // Encrypt private key with session key
        const encryptedPrivateKey = await encryptPayloadFn(privKeyPkcs8, sessionKey);

        identities.push({
          id: key,
          pubkey: pubKeyHex,
          encryptedPrivateKey,
          createdAt: Date.now(),
          expiresAt: Date.now() + 72 * 60 * 60 * 1000 // 72 hours TTL from migration time
        });

        successful++;
      } catch (err) {
        console.error(`Migration conversion failed for key ${key}:`, err);
        skipped++;
      }
    } else {
      skipped++;
    }
  }

  return { successful, skipped, identities };
}
