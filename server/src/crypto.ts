// server/src/crypto.ts

/**
 * Load libsodium‑wrappers and wait until the WASM backend is ready.
 * The return type is the module itself, captured via `typeof import(...)`.
 */
export async function initCrypto(): Promise<
  typeof import('libsodium-wrappers')
> {
  const sodium = await import('libsodium-wrappers');
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
export function decryptMessage(
  cipherB64: string,
  privKeyB64: string
): string {
  // The module has already been initialised in index.ts, so we can require it synchronously.
  const sodium = require('libsodium-wrappers') as typeof import('libsodium-wrappers');

  // ---------- Decode inputs ----------
  const cipher = sodium.from_base64(cipherB64, sodium.base64_variants.ORIGINAL);
  const privKey = sodium.from_base64(
    privKeyB64,
    sodium.base64_variants.ORIGINAL
  );

  // ---------- Derive the public key from the private key ----------
  // libsodium stores keys as raw Uint8Array scalars; the public key is the scalar multiplication of the base point.
  const pubKey = sodium.crypto_scalarmult_base(privKey);

  // ---------- Perform sealed‑box decryption ----------
  // Need (ciphertext, recipientPublicKey, recipientPrivateKey)
  const plain = sodium.crypto_box_seal_open(cipher, pubKey, privKey);

  // ---------- Convert Uint8Array → UTF‑8 string ----------
  return sodium.to_string(plain);
}
