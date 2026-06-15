export interface GhostID {
  id: string; // Internal handle or alias
  pubkey: string; // Public key representation
  createdAt: number;
  expiresAt: number;
  revoked: boolean;
}

export const DEFAULT_TTL_HOURS = 72;

/**
 * Creates a new GhostID instance with a specified TTL.
 */
export function generateGhostID(
  id: string,
  pubkey: string,
  ttlHours: number = DEFAULT_TTL_HOURS
): GhostID {
  const now = Date.now();
  return {
    id,
    pubkey,
    createdAt: now,
    expiresAt: now + ttlHours * 60 * 60 * 1000,
    revoked: false
  };
}

/**
 * Checks if a GhostID is expired or explicitly revoked.
 */
export function isIdentityValid(identity: GhostID): boolean {
  if (identity.revoked) return false;
  return Date.now() < identity.expiresAt;
}

/**
 * Creates a rotated GhostID identity, returning the new identity.
 */
export function rotateGhostID(
  oldIdentity: GhostID,
  newId: string,
  newPubkey: string,
  ttlHours: number = DEFAULT_TTL_HOURS
): { revokedOld: GhostID; newIdentity: GhostID } {
  const revokedOld: GhostID = {
    ...oldIdentity,
    revoked: true
  };

  const newIdentity = generateGhostID(newId, newPubkey, ttlHours);

  return { revokedOld, newIdentity };
}

/**
 * Revokes a GhostID identity.
 */
export function revokeGhostID(identity: GhostID): GhostID {
  return {
    ...identity,
    revoked: true
  };
}
