import Dexie, { type Table } from 'dexie';

// Define TS database interface schemas
export interface Invoice {
  id: string; // UUID or Nostr Event ID or hash
  amountRequested: number;
  amountReceived: number;
  address: string; // Bitcoin address (unique checkout index)
  xpubUsed: string;
  status: 'pending' | 'paid' | 'expired';
  createdAt: number; // Unix timestamp
  settledAt?: number;
  encryptedPayload?: string; // AES-GCM-256 encrypted sensitive metadata (e.g., description, client details)
}

export interface Identity {
  id: string; // GhostID alias
  pubkey: string; // Public cryptographic key (ML-DSA / Ed25519)
  encryptedPrivateKey: string; // Private key (ML-DSA / Ed25519) encrypted under AES-GCM-256
  createdAt: number;
  expiresAt: number;
}

export interface Shard {
  id: string; // session + shard index ID
  sessionId: string; // Logic session reference
  shardIndex: number;
  data: string; // Shamir polynomial secret slice (QEL representation)
  hash: string; // Integrity verification hash
}

export class VoidRebirthDB extends Dexie {
  invoices!: Table<Invoice>;
  identities!: Table<Identity>;
  shards!: Table<Shard>;

  constructor() {
    super('void_rebirth_db');
    // Define store indexes. Fields listed here are indexable in Dexie/IndexedDB queries.
    this.version(1).stores({
      invoices: 'id, status, createdAt, address',
      identities: 'id, pubkey, expiresAt',
      shards: 'id, sessionId, shardIndex',
    });
  }
}

// Singleton database instance
export const db = new VoidRebirthDB();

// --- Client-Side Cryptography Layer (AES-GCM-256 WebCrypto) ---

let sessionCryptoKey: CryptoKey | null = null;

/**
 * Derives a cryptographic key from a master password and salt using PBKDF2.
 */
export async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Sets the active volatile database key in RAM.
 */
export function setSessionKey(key: CryptoKey) {
  sessionCryptoKey = key;
}

/**
 * Retrieves the active volatile database key.
 */
export function getSessionKey(): CryptoKey | null {
  return sessionCryptoKey;
}

/**
 * Ensures a cryptographic key exists. If none is loaded, generates an ephemeral
 * session-level key (allowing dev access and local-first fallback).
 */
export async function ensureSessionKey(): Promise<CryptoKey> {
  if (sessionCryptoKey) return sessionCryptoKey;

  const savedKeyBase64 = sessionStorage.getItem('void_session_key');
  if (savedKeyBase64) {
    try {
      const rawKey = Uint8Array.from(atob(savedKeyBase64), (c) => c.charCodeAt(0));
      sessionCryptoKey = await crypto.subtle.importKey(
        'raw',
        rawKey,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );
      return sessionCryptoKey;
    } catch (e) {
      console.error('Failed to import saved session key, generating new one:', e);
    }
  }

  // Generate a random 256-bit AES key
  sessionCryptoKey = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  // Cache the raw key in volatile sessionStorage (survives refreshes, wiped when tab closes)
  const exported = await crypto.subtle.exportKey('raw', sessionCryptoKey);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
  sessionStorage.setItem('void_session_key', base64);

  return sessionCryptoKey;
}

/**
 * Encrypts arbitrary data (objects, strings) with a CryptoKey using AES-GCM-256.
 * Returns a base64 string combining the 12-byte IV and ciphertext.
 */
export async function encryptPayload(payload: any, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const plaintextBytes = encoder.encode(typeof payload === 'string' ? payload : JSON.stringify(payload));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintextBytes
  );

  // Combine IV + Ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  // Encode as base64 string
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypts a base64 combined IV+Ciphertext payload with a CryptoKey.
 */
export async function decryptPayload(encryptedBase64: string, key: CryptoKey): Promise<any> {
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
  const plaintext = decoder.decode(decryptedBytes);

  try {
    return JSON.parse(plaintext);
  } catch {
    return plaintext;
  }
}
