"use strict";
// server/src/crypto.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCrypto = initCrypto;
exports.decryptMessage = decryptMessage;
/**
 * Load libsodium‑wrappers and wait until the WASM backend is ready.
 * The return type is the module itself, captured via `typeof import(...)`.
 */
async function initCrypto() {
    const sodium = await Promise.resolve().then(() => __importStar(require('libsodium-wrappers')));
    await sodium.ready;
    return sodium;
}
/**
 * Decrypt a sealed‑box ciphertext that was produced on the client with
 * `crypto_box_seal(message, serverPublicKey)`.
 *
 * @param cipherB64   Base‑64‑encoded sealed ciphertext from the client
 * @param privKeyB64  Base‑64‑encoded server private key (stored in .env)
 * @returns           Plain‑text string
 */
function decryptMessage(cipherB64, privKeyB64) {
    // The module has already been initialised in index.ts, so we can require it synchronously.
    const sodium = require('libsodium-wrappers');
    // ---------- Decode inputs ----------
    const cipher = sodium.from_base64(cipherB64, sodium.base64_variants.ORIGINAL);
    const privKey = sodium.from_base64(privKeyB64, sodium.base64_variants.ORIGINAL);
    // ---------- Derive the public key from the private key ----------
    // libsodium stores keys as raw Uint8Array scalars; the public key is the scalar multiplication of the base point.
    const pubKey = sodium.crypto_scalarmult_base(privKey);
    // ---------- Perform sealed‑box decryption ----------
    // Need (ciphertext, recipientPublicKey, recipientPrivateKey)
    const plain = sodium.crypto_box_seal_open(cipher, pubKey, privKey);
    // ---------- Convert Uint8Array → UTF‑8 string ----------
    return sodium.to_string(plain);
}
