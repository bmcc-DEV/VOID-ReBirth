import { describe, it, expect } from 'vitest';
import { convertLegacyKeys, hexToBuf } from './identityMigration';

// Mock encryptPayload helper
async function encryptPayloadMock(payload: any, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const plaintext = encoder.encode(JSON.stringify(payload));
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
}

// Decrypt helper for verification
async function decryptPayloadMock(encryptedBase64: string, key: CryptoKey): Promise<any> {
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
  return JSON.parse(decoder.decode(decryptedBytes));
}

describe('identityMigration - convertLegacyKeys', () => {
  it('should convert valid legacy keys to encrypted identities', async () => {
    const mockJson = {
      "sk_pqc_1234567890": {
        "key": "sk_pqc_1234567890",
        "name": "Dev Test 1",
        "balanceSat": 100,
        "totalRequests": 0,
        "createdAt": 1718320000000
      },
      "invalid_key_format": {
        "key": "invalid_key_format",
        "name": "Dev Test 2",
        "balanceSat": 50,
        "totalRequests": 10,
        "createdAt": 1718320000000
      }
    };

    const sessionKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const result = await convertLegacyKeys(mockJson, sessionKey, encryptPayloadMock);

    // Verify counts
    expect(result.successful).toBe(1);
    expect(result.skipped).toBe(1);
    expect(result.identities.length).toBe(1);

    const identity = result.identities[0];
    expect(identity.id).toBe("sk_pqc_1234567890");
    expect(identity.pubkey).toBeDefined();
    expect(identity.pubkey.length).toBe(64); // 32 bytes public key in hex format is 64 characters
    expect(identity.encryptedPrivateKey).toBeDefined();

    // Verify the decrypted private key
    const decryptedPrivKeyHex = await decryptPayloadMock(identity.encryptedPrivateKey, sessionKey);
    expect(decryptedPrivKeyHex).toBeDefined();
    expect(decryptedPrivKeyHex.length).toBeGreaterThan(0);

    // Verify we can recreate the key pair and perform signing/verification
    const privKeyBuffer = hexToBuf(decryptedPrivKeyHex);
    const importedPrivateKey = await crypto.subtle.importKey(
      'pkcs8',
      privKeyBuffer,
      { name: 'Ed25519' },
      true,
      ['sign']
    );

    const pubKeyBuffer = hexToBuf(identity.pubkey);
    const importedPublicKey = await crypto.subtle.importKey(
      'raw',
      pubKeyBuffer,
      { name: 'Ed25519' },
      true,
      ['verify']
    );

    const testMessage = new TextEncoder().encode("Hello VOID Rebirth!");
    const signature = await crypto.subtle.sign(
      { name: 'Ed25519' },
      importedPrivateKey,
      testMessage
    );

    const isValid = await crypto.subtle.verify(
      { name: 'Ed25519' },
      importedPublicKey,
      signature,
      testMessage
    );

    expect(isValid).toBe(true);
  });
});
