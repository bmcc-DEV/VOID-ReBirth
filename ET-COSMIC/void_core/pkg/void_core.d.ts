/* tslint:disable */
/* eslint-disable */

export class DsaKeyPairWasm {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly public_key: Uint8Array;
    readonly signing_seed: Uint8Array;
}

export class GhostIdentityWasm {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly handle: string;
    readonly public_key: Uint8Array;
}

export class HashChronicleWasm {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly event_hash: Uint8Array;
}

export class KemEncapResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly ciphertext: Uint8Array;
    readonly shared_secret: Uint8Array;
}

export class KemKeyPairWasm {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly private_seed: Uint8Array;
    readonly public_key: Uint8Array;
}

export class LicenseHandshakeResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly device_id_hex: string;
    readonly ok: boolean;
    readonly reason: string;
}

export class PedersenCommitmentWasm {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly blinding_factor: Uint8Array;
    readonly commitment: Uint8Array;
}

export class PowSolution {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly attempts: number;
    readonly hash: Uint8Array;
    readonly nonce: Uint8Array;
}

/**
 * Retorna o índice X do shard (primeiro byte do payload decifrado).
 * Útil para saber qual shard é qual antes da reconstrução.
 * Nota: o índice está no plaintext — não visível sem a chave.
 * Esta função é interna; em protocolo real o índice viaja em envelope separado.
 */
export class QelShardMeta {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly payload_secret_len: number;
    readonly shard_index: number;
}

/**
 * Resultado de um split QEL: vetor de shards serializados
 */
export class QelSplitResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Retorna o shard i (0-indexed) como Uint8Array
     */
    get_shard(index: number): Uint8Array | undefined;
    /**
     * Retorna todos os shards concatenados: [shard_0 | shard_1 | ... | shard_n-1]
     * Cada shard tem comprimento fixo (armazenado no header de cada shard cifrado).
     */
    shards_concat(): Uint8Array;
    readonly k: number;
    readonly n: number;
}

export class RangeProofResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly commitment: Uint8Array;
    readonly proof: Uint8Array;
}

export class StarkAggregateProofWasm {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly compressed_size: number;
    readonly merkle_root: Uint8Array;
    readonly proof_count: number;
}

export class VdfResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly output: Uint8Array;
    readonly steps: number;
}

export function aggregate_zk_proofs(proofs_concat: Uint8Array, single_proof_size: number): StarkAggregateProofWasm;

export function create_balance_proof(inputs_r: Uint8Array, outputs_r: Uint8Array): Uint8Array;

/**
 * Generate a BOLT11 invoice.
 *
 * Parameters:
 * - private_key: 32 bytes (serialized as hex string)
 * - amount_sat: amount in satoshis
 * - description: invoice description
 * - expiry_secs: expiry in seconds
 * - network: "bitcoin", "testnet", or "regtest"
 *
 * Returns: BOLT11 invoice string
 */
export function create_bolt11(_private_key: string, _amount_sat: bigint, _description: string, _expiry_secs: bigint, _network: string): string;

export function create_hash_chronicle(payload: Uint8Array, parent_hashes_concat: Uint8Array): HashChronicleWasm;

export function create_pedersen_commitment(value: bigint): PedersenCommitmentWasm;

export function create_range_proof(value: bigint, blinding_factor: Uint8Array): RangeProofResult;

export function derive_ghost_id(entropy: Uint8Array): GhostIdentityWasm;

/**
 * Extract the payment hash from a BOLT11 invoice.
 *
 * Returns: hex-encoded 32-byte payment hash
 */
export function extract_payment_hash(bolt11_str: string): string;

export function init_void_core(): void;

/**
 * Monta payload canónico (emissor / ferramenta de licenciamento).
 */
export function license_build_payload(device_entropy: Uint8Array, sku: string, license_id: Uint8Array, not_before: bigint, not_after: bigint, nonce: Uint8Array): Uint8Array;

export function license_compute_device_id(device_entropy: Uint8Array, sku: string): Uint8Array;

/**
 * Handshake: verifica ML-DSA-87 + binding dispositivo + janela temporal.
 */
export function license_verify_handshake(vendor_public_key: Uint8Array, device_entropy: Uint8Array, sku: string, license_payload: Uint8Array, signature: Uint8Array, unix_now_secs: bigint): LicenseHandshakeResult;

/**
 * Gera par de chaves ML-DSA-87.
 */
export function mldsa_keygen(): DsaKeyPairWasm;

/**
 * Assina com ML-DSA-87. Retorna assinatura de 4627 bytes.
 */
export function mldsa_sign(signing_seed_bytes: Uint8Array, message: Uint8Array): Uint8Array;

/**
 * Verifica assinatura ML-DSA-87. Retorna `true` se válida.
 */
export function mldsa_verify(public_key_bytes: Uint8Array, message: Uint8Array, signature_bytes: Uint8Array): boolean;

/**
 * Decapsula: recupera shared_secret a partir do ciphertext e seed privada.
 */
export function mlkem_decapsulate(private_seed_bytes: Uint8Array, ciphertext_bytes: Uint8Array): Uint8Array;

/**
 * Encapsula: gera ciphertext + shared_secret a partir da chave pública.
 */
export function mlkem_encapsulate(public_key_bytes: Uint8Array): KemEncapResult;

/**
 * Gera par de chaves ML-KEM-1024.
 */
export function mlkem_keygen(): KemKeyPairWasm;

/**
 * Parse a BOLT11 invoice string and return a JSON summary.
 *
 * Returns: { amount_sat, description, payment_hash, timestamp, expiry, network }
 * Or: { error: "..." }
 */
export function parse_bolt11(bolt11_str: string): string;

/**
 * Cria um novo challenge PoW a partir de contexto (GhostID, timestamp, etc.)
 */
export function pow_create_challenge(context: Uint8Array, timestamp_nanos: bigint): Uint8Array;

/**
 * Resolve o PoW: encontra nonce tal que SHA3-256(challenge || nonce) tenha
 * `difficulty` bits zero no prefixo.
 *
 * `max_attempts`: limite de tentativas (segurança contra loop infinito em WASM).
 * Retorna None (null em JS) se não encontrar solução no limite.
 */
export function pow_solve(challenge: Uint8Array, difficulty: number, max_attempts: number): PowSolution | undefined;

/**
 * Verifica uma solução PoW.
 */
export function pow_verify(challenge: Uint8Array, nonce: Uint8Array, difficulty: number): boolean;

/**
 * Reconstrói o segredo a partir de pelo menos K shards cifrados.
 *
 * `shards_concat`: shards serializados concatenados (cada um com seu comprimento).
 * Como todos os shards têm o mesmo comprimento, passamos `shard_len` para parsing.
 * `aad_key`: mesmo contexto usado no split.
 */
export function qel_reconstruct(shards_concat: Uint8Array, shard_len: number, k: number, aad_key: Uint8Array, secret_len: number): Uint8Array;

/**
 * Extrai metadados públicos de um shard (sem decifrar — apenas lê header).
 */
export function qel_shard_meta(shard: Uint8Array): QelShardMeta;

/**
 * Fragmenta `secret` em N shards com threshold K, cifrando cada um com ChaCha20-Poly1305.
 *
 * Formato de cada shard cifrado:
 * [1 byte: x (índice 1-N)] [12 bytes: nonce] [4 bytes: payload_len_LE] [payload cifrado + tag]
 *
 * `aad_key` é o GhostID (ou qualquer contexto) usado como AAD para autenticação.
 */
export function qel_split(secret: Uint8Array, k: number, n: number, aad_key: Uint8Array): QelSplitResult;

/**
 * Validate a BOLT11 invoice string.
 *
 * Returns: true if valid, false otherwise
 */
export function validate_bolt11(bolt11_str: string): boolean;

/**
 * Avalia VDF(input, steps) = SHA3-256(input)^(2^steps) mod N.
 *
 * `steps`: número de squarings sequenciais (T). Tipicamente 1000-100000.
 * Quanto maior T, mais tempo sequencial é exigido — não paralelizável.
 */
export function vdf_evaluate(input: Uint8Array, steps: number): VdfResult;

/**
 * Verifica um resultado VDF de forma simplificada (reexecuta T squarings).
 * Em produção, usar prova de Wesolowski O(log T).
 */
export function vdf_verify(input: Uint8Array, claimed_output: Uint8Array, steps: number): boolean;

export function verify_range_proof(proof_bytes: Uint8Array, commitment_bytes: Uint8Array): boolean;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly rustsecp256k1_v0_10_0_context_create: (a: number) => number;
    readonly rustsecp256k1_v0_10_0_context_destroy: (a: number) => void;
    readonly rustsecp256k1_v0_10_0_default_error_callback_fn: (a: number, b: number) => void;
    readonly rustsecp256k1_v0_10_0_default_illegal_callback_fn: (a: number, b: number) => void;
    readonly __wbg_ghostidentitywasm_free: (a: number, b: number) => void;
    readonly __wbg_hashchroniclewasm_free: (a: number, b: number) => void;
    readonly __wbg_starkaggregateproofwasm_free: (a: number, b: number) => void;
    readonly aggregate_zk_proofs: (a: number, b: number, c: number) => number;
    readonly create_balance_proof: (a: number, b: number, c: number, d: number) => any;
    readonly create_hash_chronicle: (a: number, b: number, c: number, d: number) => number;
    readonly create_pedersen_commitment: (a: bigint) => number;
    readonly create_range_proof: (a: bigint, b: number, c: number) => number;
    readonly derive_ghost_id: (a: number, b: number) => number;
    readonly ghostidentitywasm_handle: (a: number) => [number, number];
    readonly ghostidentitywasm_public_key: (a: number) => any;
    readonly hashchroniclewasm_event_hash: (a: number) => any;
    readonly init_void_core: () => void;
    readonly starkaggregateproofwasm_compressed_size: (a: number) => number;
    readonly starkaggregateproofwasm_merkle_root: (a: number) => any;
    readonly starkaggregateproofwasm_proof_count: (a: number) => number;
    readonly verify_range_proof: (a: number, b: number, c: number, d: number) => number;
    readonly __wbg_licensehandshakeresult_free: (a: number, b: number) => void;
    readonly license_build_payload: (a: number, b: number, c: number, d: number, e: number, f: number, g: bigint, h: bigint, i: number, j: number) => [number, number, number];
    readonly license_compute_device_id: (a: number, b: number, c: number, d: number) => any;
    readonly license_verify_handshake: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: bigint) => number;
    readonly licensehandshakeresult_device_id_hex: (a: number) => [number, number];
    readonly licensehandshakeresult_ok: (a: number) => number;
    readonly licensehandshakeresult_reason: (a: number) => [number, number];
    readonly __wbg_qelshardmeta_free: (a: number, b: number) => void;
    readonly __wbg_qelsplitresult_free: (a: number, b: number) => void;
    readonly qel_reconstruct: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number, number];
    readonly qel_shard_meta: (a: number, b: number) => [number, number, number];
    readonly qel_split: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number];
    readonly qelshardmeta_payload_secret_len: (a: number) => number;
    readonly qelshardmeta_shard_index: (a: number) => number;
    readonly qelsplitresult_get_shard: (a: number, b: number) => any;
    readonly qelsplitresult_k: (a: number) => number;
    readonly qelsplitresult_n: (a: number) => number;
    readonly qelsplitresult_shards_concat: (a: number) => any;
    readonly create_bolt11: (a: number, b: number, c: bigint, d: number, e: number, f: bigint, g: number, h: number) => [number, number, number, number];
    readonly extract_payment_hash: (a: number, b: number) => [number, number, number, number];
    readonly parse_bolt11: (a: number, b: number) => [number, number, number, number];
    readonly validate_bolt11: (a: number, b: number) => number;
    readonly __wbg_vdfresult_free: (a: number, b: number) => void;
    readonly pow_create_challenge: (a: number, b: number, c: bigint) => any;
    readonly pow_solve: (a: number, b: number, c: number, d: number) => number;
    readonly pow_verify: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly powsolution_attempts: (a: number) => number;
    readonly powsolution_hash: (a: number) => any;
    readonly powsolution_nonce: (a: number) => any;
    readonly vdf_evaluate: (a: number, b: number, c: number) => number;
    readonly vdf_verify: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly vdfresult_output: (a: number) => any;
    readonly vdfresult_steps: (a: number) => number;
    readonly __wbg_dsakeypairwasm_free: (a: number, b: number) => void;
    readonly dsakeypairwasm_public_key: (a: number) => any;
    readonly dsakeypairwasm_signing_seed: (a: number) => any;
    readonly mldsa_keygen: () => number;
    readonly mldsa_sign: (a: number, b: number, c: number, d: number) => [number, number, number];
    readonly mldsa_verify: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
    readonly mlkem_decapsulate: (a: number, b: number, c: number, d: number) => [number, number, number];
    readonly mlkem_encapsulate: (a: number, b: number) => [number, number, number];
    readonly mlkem_keygen: () => number;
    readonly __wbg_rangeproofresult_free: (a: number, b: number) => void;
    readonly __wbg_powsolution_free: (a: number, b: number) => void;
    readonly __wbg_pedersencommitmentwasm_free: (a: number, b: number) => void;
    readonly __wbg_kemencapresult_free: (a: number, b: number) => void;
    readonly __wbg_kemkeypairwasm_free: (a: number, b: number) => void;
    readonly rangeproofresult_commitment: (a: number) => any;
    readonly rangeproofresult_proof: (a: number) => any;
    readonly pedersencommitmentwasm_commitment: (a: number) => any;
    readonly pedersencommitmentwasm_blinding_factor: (a: number) => any;
    readonly kemencapresult_ciphertext: (a: number) => any;
    readonly kemencapresult_shared_secret: (a: number) => any;
    readonly kemkeypairwasm_private_seed: (a: number) => any;
    readonly kemkeypairwasm_public_key: (a: number) => any;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
