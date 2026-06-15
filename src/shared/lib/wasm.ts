import init, { init_void_core, derive_ghost_id } from 'void_core';

let wasmInitialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Initializes the Rust WASM module.
 * Thread-safe and prevents double initialization.
 */
export async function initWasm(): Promise<void> {
  if (wasmInitialized) return;
  
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      // Initialize the WASM package from standard ES import
      await init();
      init_void_core();
      wasmInitialized = true;
      console.log('[WASM] void_core compiled package successfully loaded');
    } catch (err) {
      console.error('[WASM] Error loading void_core binary:', err);
      initPromise = null; // Reset for retry
      throw err;
    }
  })();

  return initPromise;
}

/**
 * Checks if WASM is active in the current session.
 */
export function isWasmLoaded(): boolean {
  return wasmInitialized;
}

/**
 * Wrapper for derive_ghost_id WASM function.
 */
export async function deriveGhostIdWasm(entropy: Uint8Array) {
  await initWasm();
  return derive_ghost_id(entropy);
}
