/* @ts-self-types="./void_core.d.ts" */

export class DsaKeyPairWasm {
    static __wrap(ptr) {
        const obj = Object.create(DsaKeyPairWasm.prototype);
        obj.__wbg_ptr = ptr;
        DsaKeyPairWasmFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DsaKeyPairWasmFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dsakeypairwasm_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get public_key() {
        const ret = wasm.dsakeypairwasm_public_key(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Uint8Array}
     */
    get signing_seed() {
        const ret = wasm.dsakeypairwasm_signing_seed(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) DsaKeyPairWasm.prototype[Symbol.dispose] = DsaKeyPairWasm.prototype.free;

export class GhostIdentityWasm {
    static __wrap(ptr) {
        const obj = Object.create(GhostIdentityWasm.prototype);
        obj.__wbg_ptr = ptr;
        GhostIdentityWasmFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GhostIdentityWasmFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ghostidentitywasm_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get handle() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.ghostidentitywasm_handle(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    get public_key() {
        const ret = wasm.ghostidentitywasm_public_key(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) GhostIdentityWasm.prototype[Symbol.dispose] = GhostIdentityWasm.prototype.free;

export class HashChronicleWasm {
    static __wrap(ptr) {
        const obj = Object.create(HashChronicleWasm.prototype);
        obj.__wbg_ptr = ptr;
        HashChronicleWasmFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HashChronicleWasmFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hashchroniclewasm_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get event_hash() {
        const ret = wasm.hashchroniclewasm_event_hash(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) HashChronicleWasm.prototype[Symbol.dispose] = HashChronicleWasm.prototype.free;

export class KemEncapResult {
    static __wrap(ptr) {
        const obj = Object.create(KemEncapResult.prototype);
        obj.__wbg_ptr = ptr;
        KemEncapResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        KemEncapResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_kemencapresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get ciphertext() {
        const ret = wasm.kemencapresult_ciphertext(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Uint8Array}
     */
    get shared_secret() {
        const ret = wasm.kemencapresult_shared_secret(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) KemEncapResult.prototype[Symbol.dispose] = KemEncapResult.prototype.free;

export class KemKeyPairWasm {
    static __wrap(ptr) {
        const obj = Object.create(KemKeyPairWasm.prototype);
        obj.__wbg_ptr = ptr;
        KemKeyPairWasmFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        KemKeyPairWasmFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_kemkeypairwasm_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get private_seed() {
        const ret = wasm.kemkeypairwasm_private_seed(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Uint8Array}
     */
    get public_key() {
        const ret = wasm.kemkeypairwasm_public_key(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) KemKeyPairWasm.prototype[Symbol.dispose] = KemKeyPairWasm.prototype.free;

export class LicenseHandshakeResult {
    static __wrap(ptr) {
        const obj = Object.create(LicenseHandshakeResult.prototype);
        obj.__wbg_ptr = ptr;
        LicenseHandshakeResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LicenseHandshakeResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_licensehandshakeresult_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get device_id_hex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.licensehandshakeresult_device_id_hex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {boolean}
     */
    get ok() {
        const ret = wasm.licensehandshakeresult_ok(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    get reason() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.licensehandshakeresult_reason(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) LicenseHandshakeResult.prototype[Symbol.dispose] = LicenseHandshakeResult.prototype.free;

export class PedersenCommitmentWasm {
    static __wrap(ptr) {
        const obj = Object.create(PedersenCommitmentWasm.prototype);
        obj.__wbg_ptr = ptr;
        PedersenCommitmentWasmFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PedersenCommitmentWasmFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pedersencommitmentwasm_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get blinding_factor() {
        const ret = wasm.pedersencommitmentwasm_blinding_factor(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Uint8Array}
     */
    get commitment() {
        const ret = wasm.pedersencommitmentwasm_commitment(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) PedersenCommitmentWasm.prototype[Symbol.dispose] = PedersenCommitmentWasm.prototype.free;

export class PowSolution {
    static __wrap(ptr) {
        const obj = Object.create(PowSolution.prototype);
        obj.__wbg_ptr = ptr;
        PowSolutionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PowSolutionFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_powsolution_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get attempts() {
        const ret = wasm.powsolution_attempts(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {Uint8Array}
     */
    get hash() {
        const ret = wasm.powsolution_hash(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Uint8Array}
     */
    get nonce() {
        const ret = wasm.powsolution_nonce(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) PowSolution.prototype[Symbol.dispose] = PowSolution.prototype.free;

/**
 * Retorna o índice X do shard (primeiro byte do payload decifrado).
 * Útil para saber qual shard é qual antes da reconstrução.
 * Nota: o índice está no plaintext — não visível sem a chave.
 * Esta função é interna; em protocolo real o índice viaja em envelope separado.
 */
export class QelShardMeta {
    static __wrap(ptr) {
        const obj = Object.create(QelShardMeta.prototype);
        obj.__wbg_ptr = ptr;
        QelShardMetaFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QelShardMetaFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_qelshardmeta_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get payload_secret_len() {
        const ret = wasm.qelshardmeta_payload_secret_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get shard_index() {
        const ret = wasm.qelshardmeta_shard_index(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) QelShardMeta.prototype[Symbol.dispose] = QelShardMeta.prototype.free;

/**
 * Resultado de um split QEL: vetor de shards serializados
 */
export class QelSplitResult {
    static __wrap(ptr) {
        const obj = Object.create(QelSplitResult.prototype);
        obj.__wbg_ptr = ptr;
        QelSplitResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QelSplitResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_qelsplitresult_free(ptr, 0);
    }
    /**
     * Retorna o shard i (0-indexed) como Uint8Array
     * @param {number} index
     * @returns {Uint8Array | undefined}
     */
    get_shard(index) {
        const ret = wasm.qelsplitresult_get_shard(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * @returns {number}
     */
    get k() {
        const ret = wasm.qelsplitresult_k(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get n() {
        const ret = wasm.qelsplitresult_n(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Retorna todos os shards concatenados: [shard_0 | shard_1 | ... | shard_n-1]
     * Cada shard tem comprimento fixo (armazenado no header de cada shard cifrado).
     * @returns {Uint8Array}
     */
    shards_concat() {
        const ret = wasm.qelsplitresult_shards_concat(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) QelSplitResult.prototype[Symbol.dispose] = QelSplitResult.prototype.free;

export class RangeProofResult {
    static __wrap(ptr) {
        const obj = Object.create(RangeProofResult.prototype);
        obj.__wbg_ptr = ptr;
        RangeProofResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RangeProofResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rangeproofresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get commitment() {
        const ret = wasm.rangeproofresult_commitment(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Uint8Array}
     */
    get proof() {
        const ret = wasm.rangeproofresult_proof(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) RangeProofResult.prototype[Symbol.dispose] = RangeProofResult.prototype.free;

export class StarkAggregateProofWasm {
    static __wrap(ptr) {
        const obj = Object.create(StarkAggregateProofWasm.prototype);
        obj.__wbg_ptr = ptr;
        StarkAggregateProofWasmFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StarkAggregateProofWasmFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_starkaggregateproofwasm_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get compressed_size() {
        const ret = wasm.starkaggregateproofwasm_compressed_size(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {Uint8Array}
     */
    get merkle_root() {
        const ret = wasm.starkaggregateproofwasm_merkle_root(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get proof_count() {
        const ret = wasm.starkaggregateproofwasm_proof_count(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) StarkAggregateProofWasm.prototype[Symbol.dispose] = StarkAggregateProofWasm.prototype.free;

export class VdfResult {
    static __wrap(ptr) {
        const obj = Object.create(VdfResult.prototype);
        obj.__wbg_ptr = ptr;
        VdfResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VdfResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vdfresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get output() {
        const ret = wasm.vdfresult_output(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get steps() {
        const ret = wasm.vdfresult_steps(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) VdfResult.prototype[Symbol.dispose] = VdfResult.prototype.free;

/**
 * @param {Uint8Array} proofs_concat
 * @param {number} single_proof_size
 * @returns {StarkAggregateProofWasm}
 */
export function aggregate_zk_proofs(proofs_concat, single_proof_size) {
    const ptr0 = passArray8ToWasm0(proofs_concat, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.aggregate_zk_proofs(ptr0, len0, single_proof_size);
    return StarkAggregateProofWasm.__wrap(ret);
}

/**
 * @param {Uint8Array} inputs_r
 * @param {Uint8Array} outputs_r
 * @returns {Uint8Array}
 */
export function create_balance_proof(inputs_r, outputs_r) {
    const ptr0 = passArray8ToWasm0(inputs_r, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(outputs_r, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.create_balance_proof(ptr0, len0, ptr1, len1);
    return ret;
}

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
 * @param {string} _private_key
 * @param {bigint} _amount_sat
 * @param {string} _description
 * @param {bigint} _expiry_secs
 * @param {string} _network
 * @returns {string}
 */
export function create_bolt11(_private_key, _amount_sat, _description, _expiry_secs, _network) {
    let deferred5_0;
    let deferred5_1;
    try {
        const ptr0 = passStringToWasm0(_private_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(_description, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(_network, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.create_bolt11(ptr0, len0, _amount_sat, ptr1, len1, _expiry_secs, ptr2, len2);
        var ptr4 = ret[0];
        var len4 = ret[1];
        if (ret[3]) {
            ptr4 = 0; len4 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred5_0 = ptr4;
        deferred5_1 = len4;
        return getStringFromWasm0(ptr4, len4);
    } finally {
        wasm.__wbindgen_free(deferred5_0, deferred5_1, 1);
    }
}

/**
 * @param {Uint8Array} payload
 * @param {Uint8Array} parent_hashes_concat
 * @returns {HashChronicleWasm}
 */
export function create_hash_chronicle(payload, parent_hashes_concat) {
    const ptr0 = passArray8ToWasm0(payload, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(parent_hashes_concat, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.create_hash_chronicle(ptr0, len0, ptr1, len1);
    return HashChronicleWasm.__wrap(ret);
}

/**
 * @param {bigint} value
 * @returns {PedersenCommitmentWasm}
 */
export function create_pedersen_commitment(value) {
    const ret = wasm.create_pedersen_commitment(value);
    return PedersenCommitmentWasm.__wrap(ret);
}

/**
 * @param {bigint} value
 * @param {Uint8Array} blinding_factor
 * @returns {RangeProofResult}
 */
export function create_range_proof(value, blinding_factor) {
    const ptr0 = passArray8ToWasm0(blinding_factor, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.create_range_proof(value, ptr0, len0);
    return RangeProofResult.__wrap(ret);
}

/**
 * @param {Uint8Array} entropy
 * @returns {GhostIdentityWasm}
 */
export function derive_ghost_id(entropy) {
    const ptr0 = passArray8ToWasm0(entropy, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.derive_ghost_id(ptr0, len0);
    return GhostIdentityWasm.__wrap(ret);
}

/**
 * Extract the payment hash from a BOLT11 invoice.
 *
 * Returns: hex-encoded 32-byte payment hash
 * @param {string} bolt11_str
 * @returns {string}
 */
export function extract_payment_hash(bolt11_str) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(bolt11_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.extract_payment_hash(ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

export function init_void_core() {
    wasm.init_void_core();
}

/**
 * Monta payload canónico (emissor / ferramenta de licenciamento).
 * @param {Uint8Array} device_entropy
 * @param {string} sku
 * @param {Uint8Array} license_id
 * @param {bigint} not_before
 * @param {bigint} not_after
 * @param {Uint8Array} nonce
 * @returns {Uint8Array}
 */
export function license_build_payload(device_entropy, sku, license_id, not_before, not_after, nonce) {
    const ptr0 = passArray8ToWasm0(device_entropy, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(sku, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passArray8ToWasm0(license_id, wasm.__wbindgen_malloc);
    const len2 = WASM_VECTOR_LEN;
    const ptr3 = passArray8ToWasm0(nonce, wasm.__wbindgen_malloc);
    const len3 = WASM_VECTOR_LEN;
    const ret = wasm.license_build_payload(ptr0, len0, ptr1, len1, ptr2, len2, not_before, not_after, ptr3, len3);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} device_entropy
 * @param {string} sku
 * @returns {Uint8Array}
 */
export function license_compute_device_id(device_entropy, sku) {
    const ptr0 = passArray8ToWasm0(device_entropy, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(sku, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.license_compute_device_id(ptr0, len0, ptr1, len1);
    return ret;
}

/**
 * Handshake: verifica ML-DSA-87 + binding dispositivo + janela temporal.
 * @param {Uint8Array} vendor_public_key
 * @param {Uint8Array} device_entropy
 * @param {string} sku
 * @param {Uint8Array} license_payload
 * @param {Uint8Array} signature
 * @param {bigint} unix_now_secs
 * @returns {LicenseHandshakeResult}
 */
export function license_verify_handshake(vendor_public_key, device_entropy, sku, license_payload, signature, unix_now_secs) {
    const ptr0 = passArray8ToWasm0(vendor_public_key, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(device_entropy, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(sku, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    const ptr3 = passArray8ToWasm0(license_payload, wasm.__wbindgen_malloc);
    const len3 = WASM_VECTOR_LEN;
    const ptr4 = passArray8ToWasm0(signature, wasm.__wbindgen_malloc);
    const len4 = WASM_VECTOR_LEN;
    const ret = wasm.license_verify_handshake(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, unix_now_secs);
    return LicenseHandshakeResult.__wrap(ret);
}

/**
 * Gera par de chaves ML-DSA-87.
 * @returns {DsaKeyPairWasm}
 */
export function mldsa_keygen() {
    const ret = wasm.mldsa_keygen();
    return DsaKeyPairWasm.__wrap(ret);
}

/**
 * Assina com ML-DSA-87. Retorna assinatura de 4627 bytes.
 * @param {Uint8Array} signing_seed_bytes
 * @param {Uint8Array} message
 * @returns {Uint8Array}
 */
export function mldsa_sign(signing_seed_bytes, message) {
    const ptr0 = passArray8ToWasm0(signing_seed_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.mldsa_sign(ptr0, len0, ptr1, len1);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Verifica assinatura ML-DSA-87. Retorna `true` se válida.
 * @param {Uint8Array} public_key_bytes
 * @param {Uint8Array} message
 * @param {Uint8Array} signature_bytes
 * @returns {boolean}
 */
export function mldsa_verify(public_key_bytes, message, signature_bytes) {
    const ptr0 = passArray8ToWasm0(public_key_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passArray8ToWasm0(signature_bytes, wasm.__wbindgen_malloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.mldsa_verify(ptr0, len0, ptr1, len1, ptr2, len2);
    return ret !== 0;
}

/**
 * Decapsula: recupera shared_secret a partir do ciphertext e seed privada.
 * @param {Uint8Array} private_seed_bytes
 * @param {Uint8Array} ciphertext_bytes
 * @returns {Uint8Array}
 */
export function mlkem_decapsulate(private_seed_bytes, ciphertext_bytes) {
    const ptr0 = passArray8ToWasm0(private_seed_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(ciphertext_bytes, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.mlkem_decapsulate(ptr0, len0, ptr1, len1);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Encapsula: gera ciphertext + shared_secret a partir da chave pública.
 * @param {Uint8Array} public_key_bytes
 * @returns {KemEncapResult}
 */
export function mlkem_encapsulate(public_key_bytes) {
    const ptr0 = passArray8ToWasm0(public_key_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.mlkem_encapsulate(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return KemEncapResult.__wrap(ret[0]);
}

/**
 * Gera par de chaves ML-KEM-1024.
 * @returns {KemKeyPairWasm}
 */
export function mlkem_keygen() {
    const ret = wasm.mlkem_keygen();
    return KemKeyPairWasm.__wrap(ret);
}

/**
 * Parse a BOLT11 invoice string and return a JSON summary.
 *
 * Returns: { amount_sat, description, payment_hash, timestamp, expiry, network }
 * Or: { error: "..." }
 * @param {string} bolt11_str
 * @returns {string}
 */
export function parse_bolt11(bolt11_str) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(bolt11_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.parse_bolt11(ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * Cria um novo challenge PoW a partir de contexto (GhostID, timestamp, etc.)
 * @param {Uint8Array} context
 * @param {bigint} timestamp_nanos
 * @returns {Uint8Array}
 */
export function pow_create_challenge(context, timestamp_nanos) {
    const ptr0 = passArray8ToWasm0(context, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.pow_create_challenge(ptr0, len0, timestamp_nanos);
    return ret;
}

/**
 * Resolve o PoW: encontra nonce tal que SHA3-256(challenge || nonce) tenha
 * `difficulty` bits zero no prefixo.
 *
 * `max_attempts`: limite de tentativas (segurança contra loop infinito em WASM).
 * Retorna None (null em JS) se não encontrar solução no limite.
 * @param {Uint8Array} challenge
 * @param {number} difficulty
 * @param {number} max_attempts
 * @returns {PowSolution | undefined}
 */
export function pow_solve(challenge, difficulty, max_attempts) {
    const ptr0 = passArray8ToWasm0(challenge, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.pow_solve(ptr0, len0, difficulty, max_attempts);
    return ret === 0 ? undefined : PowSolution.__wrap(ret);
}

/**
 * Verifica uma solução PoW.
 * @param {Uint8Array} challenge
 * @param {Uint8Array} nonce
 * @param {number} difficulty
 * @returns {boolean}
 */
export function pow_verify(challenge, nonce, difficulty) {
    const ptr0 = passArray8ToWasm0(challenge, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(nonce, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.pow_verify(ptr0, len0, ptr1, len1, difficulty);
    return ret !== 0;
}

/**
 * Reconstrói o segredo a partir de pelo menos K shards cifrados.
 *
 * `shards_concat`: shards serializados concatenados (cada um com seu comprimento).
 * Como todos os shards têm o mesmo comprimento, passamos `shard_len` para parsing.
 * `aad_key`: mesmo contexto usado no split.
 * @param {Uint8Array} shards_concat
 * @param {number} shard_len
 * @param {number} k
 * @param {Uint8Array} aad_key
 * @param {number} secret_len
 * @returns {Uint8Array}
 */
export function qel_reconstruct(shards_concat, shard_len, k, aad_key, secret_len) {
    const ptr0 = passArray8ToWasm0(shards_concat, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(aad_key, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.qel_reconstruct(ptr0, len0, shard_len, k, ptr1, len1, secret_len);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Extrai metadados públicos de um shard (sem decifrar — apenas lê header).
 * @param {Uint8Array} shard
 * @returns {QelShardMeta}
 */
export function qel_shard_meta(shard) {
    const ptr0 = passArray8ToWasm0(shard, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.qel_shard_meta(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return QelShardMeta.__wrap(ret[0]);
}

/**
 * Fragmenta `secret` em N shards com threshold K, cifrando cada um com ChaCha20-Poly1305.
 *
 * Formato de cada shard cifrado:
 * [1 byte: x (índice 1-N)] [12 bytes: nonce] [4 bytes: payload_len_LE] [payload cifrado + tag]
 *
 * `aad_key` é o GhostID (ou qualquer contexto) usado como AAD para autenticação.
 * @param {Uint8Array} secret
 * @param {number} k
 * @param {number} n
 * @param {Uint8Array} aad_key
 * @returns {QelSplitResult}
 */
export function qel_split(secret, k, n, aad_key) {
    const ptr0 = passArray8ToWasm0(secret, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(aad_key, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.qel_split(ptr0, len0, k, n, ptr1, len1);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return QelSplitResult.__wrap(ret[0]);
}

/**
 * Validate a BOLT11 invoice string.
 *
 * Returns: true if valid, false otherwise
 * @param {string} bolt11_str
 * @returns {boolean}
 */
export function validate_bolt11(bolt11_str) {
    const ptr0 = passStringToWasm0(bolt11_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.validate_bolt11(ptr0, len0);
    return ret !== 0;
}

/**
 * Avalia VDF(input, steps) = SHA3-256(input)^(2^steps) mod N.
 *
 * `steps`: número de squarings sequenciais (T). Tipicamente 1000-100000.
 * Quanto maior T, mais tempo sequencial é exigido — não paralelizável.
 * @param {Uint8Array} input
 * @param {number} steps
 * @returns {VdfResult}
 */
export function vdf_evaluate(input, steps) {
    const ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.vdf_evaluate(ptr0, len0, steps);
    return VdfResult.__wrap(ret);
}

/**
 * Verifica um resultado VDF de forma simplificada (reexecuta T squarings).
 * Em produção, usar prova de Wesolowski O(log T).
 * @param {Uint8Array} input
 * @param {Uint8Array} claimed_output
 * @param {number} steps
 * @returns {boolean}
 */
export function vdf_verify(input, claimed_output, steps) {
    const ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(claimed_output, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.vdf_verify(ptr0, len0, ptr1, len1, steps);
    return ret !== 0;
}

/**
 * @param {Uint8Array} proof_bytes
 * @param {Uint8Array} commitment_bytes
 * @returns {boolean}
 */
export function verify_range_proof(proof_bytes, commitment_bytes) {
    const ptr0 = passArray8ToWasm0(proof_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(commitment_bytes, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.verify_range_proof(ptr0, len0, ptr1, len1);
    return ret !== 0;
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_is_function_5cd60d5cf78b4eef: function(arg0) {
            const ret = typeof(arg0) === 'function';
            return ret;
        },
        __wbg___wbindgen_is_object_b4593df85baada48: function(arg0) {
            const val = arg0;
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        },
        __wbg___wbindgen_is_string_dde0fd9020db4434: function(arg0) {
            const ret = typeof(arg0) === 'string';
            return ret;
        },
        __wbg___wbindgen_is_undefined_35bb9f4c7fd651d5: function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        },
        __wbg___wbindgen_throw_9c31b086c2b26051: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_call_dfde26266607c996: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.call(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_crypto_38df2bab126b63dc: function(arg0) {
            const ret = arg0.crypto;
            return ret;
        },
        __wbg_error_a6fa202b58aa1cd3: function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        },
        __wbg_getRandomValues_76dfc69825c9c552: function() { return handleError(function (arg0, arg1) {
            globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
        }, arguments); },
        __wbg_getRandomValues_c44a50d8cfdaebeb: function() { return handleError(function (arg0, arg1) {
            arg0.getRandomValues(arg1);
        }, arguments); },
        __wbg_length_56fcd3e2b7e0299d: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_msCrypto_bd5a034af96bcba6: function(arg0) {
            const ret = arg0.msCrypto;
            return ret;
        },
        __wbg_new_227d7c05414eb861: function() {
            const ret = new Error();
            return ret;
        },
        __wbg_new_from_slice_269e35316ed2d061: function(arg0, arg1) {
            const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_new_with_length_99887c91eae4abab: function(arg0) {
            const ret = new Uint8Array(arg0 >>> 0);
            return ret;
        },
        __wbg_node_84ea875411254db1: function(arg0) {
            const ret = arg0.node;
            return ret;
        },
        __wbg_process_44c7a14e11e9f69e: function(arg0) {
            const ret = arg0.process;
            return ret;
        },
        __wbg_prototypesetcall_5f9bdc8d75e07276: function(arg0, arg1, arg2) {
            Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
        },
        __wbg_randomFillSync_6c25eac9869eb53c: function() { return handleError(function (arg0, arg1) {
            arg0.randomFillSync(arg1);
        }, arguments); },
        __wbg_require_b4edbdcf3e2a1ef0: function() { return handleError(function () {
            const ret = module.require;
            return ret;
        }, arguments); },
        __wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_static_accessor_GLOBAL_THIS_02344c9b09eb08a9: function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_GLOBAL_ac6d4ac874d5cd54: function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_SELF_9b2406c23aeb2023: function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_WINDOW_b34d2126934e16ba: function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_subarray_7c6a0da8f3b4a1ba: function(arg0, arg1, arg2) {
            const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
            return ret;
        },
        __wbg_versions_276b2795b1c6a219: function(arg0) {
            const ret = arg0.versions;
            return ret;
        },
        __wbindgen_cast_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
            const ret = getArrayU8FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_cast_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./void_core_bg.js": import0,
    };
}

const DsaKeyPairWasmFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dsakeypairwasm_free(ptr, 1));
const GhostIdentityWasmFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ghostidentitywasm_free(ptr, 1));
const HashChronicleWasmFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_hashchroniclewasm_free(ptr, 1));
const KemEncapResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_kemencapresult_free(ptr, 1));
const KemKeyPairWasmFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_kemkeypairwasm_free(ptr, 1));
const LicenseHandshakeResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_licensehandshakeresult_free(ptr, 1));
const PedersenCommitmentWasmFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pedersencommitmentwasm_free(ptr, 1));
const PowSolutionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_powsolution_free(ptr, 1));
const QelShardMetaFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_qelshardmeta_free(ptr, 1));
const QelSplitResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_qelsplitresult_free(ptr, 1));
const RangeProofResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rangeproofresult_free(ptr, 1));
const StarkAggregateProofWasmFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_starkaggregateproofwasm_free(ptr, 1));
const VdfResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_vdfresult_free(ptr, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('void_core_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
