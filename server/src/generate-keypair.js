"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/generate-keypair.ts
const libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
/**
 * One‑off utility: creates a Curve25519 key pair suitable for
 * `crypto_box_*` operations and prints both keys as Base‑64 strings.
 *
 * The keys are encoded with the **Original** Base‑64 variant
 * (the default used throughout the demo).  The output includes the
 * trailing “=” padding so you can paste it directly into `.env` or
 * into the client source.
 */
(async () => {
    // Load the WASM implementation of libsodium
    await libsodium_wrappers_1.default.ready;
    // Generate a fresh key pair (32‑byte secret + 32‑byte public)
    const keyPair = libsodium_wrappers_1.default.crypto_box_keypair();
    // Encode using the ORIGINAL variant (includes padding)
    const privB64 = libsodium_wrappers_1.default.to_base64(keyPair.privateKey, libsodium_wrappers_1.default.base64_variants.ORIGINAL);
    const pubB64 = libsodium_wrappers_1.default.to_base64(keyPair.publicKey, libsodium_wrappers_1.default.base64_variants.ORIGINAL);
    console.log('PRIVATE:', privB64);
    console.log('PUBLIC :', pubB64);
})();
