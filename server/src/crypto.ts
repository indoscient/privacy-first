// server/src/crypto.ts

import sodium from 'libsodium-wrappers';

/** Cached sodium module — set once by initCrypto(). */
let sodiumModule: typeof sodium | null = null;

/**
 * Load libsodium-wrappers and wait until the WASM backend is ready.
 * Safe to call multiple times — returns the cached instance.
 */
export async function initCrypto(): Promise<typeof sodium> {
  if (sodiumModule) return sodiumModule;
  
  await sodium.ready;
  sodiumModule = sodium;
  return sodiumModule;
}

/**
 * Decrypt a sealed-box ciphertext produced by `crypto_box_seal`.
 *
 * @param cipherB64  Base-64-encoded sealed ciphertext from the client
 * @param privKeyB64 Base-64-encoded server private key (from .env)
 */
export async function decryptMessage(
  cipherB64: string,
  privKeyB64: string
): Promise<string> {
  const sodium = await initCrypto();

  const cipher = sodium.from_base64(cipherB64, sodium.base64_variants.ORIGINAL);
  const privKey = sodium.from_base64(privKeyB64, sodium.base64_variants.ORIGINAL);

  // Derive the matching public key from the private key
  const pubKey = sodium.crypto_scalarmult_base(privKey);

  // Open the sealed box
  const plain = sodium.crypto_box_seal_open(cipher, pubKey, privKey);

  return sodium.to_string(plain);
}
