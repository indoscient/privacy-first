// client/src/crypto.ts
import sodium from 'libsodium-wrappers';

/**
 * Initialise libsodium – must be awaited before any crypto calls.
 */
export async function initCrypto(): Promise<void> {
  await sodium.ready;               // loads the WASM backend
}

/**
 * Encrypt a UTF‑8 string with the recipient’s **public** key.
 *
 * We use a *sealed box* (`crypto_box_seal`) because it only needs the
 * recipient’s public key – the server can decrypt with its private key
 * without the client having to manage a nonce or a sender key pair.
 *
 * @param plaintext   Message to encrypt
 * @param pubKeyBase64 Recipient’s public key (Base‑64, ORIGINAL variant)
 * @returns Base‑64‑encoded ciphertext
 */
export function encryptMessage(
  plaintext: string,
  pubKeyBase64: string
): string {
  // Decode the server’s public key
  const pubKey = sodium.from_base64(
    pubKeyBase64,
    sodium.base64_variants.ORIGINAL
  );

  // Turn the message into a Uint8Array
  const messageBytes = sodium.from_string(plaintext);

  // Seal the message – libsodium adds a random nonce internally
  const sealed = sodium.crypto_box_seal(messageBytes, pubKey);

  // Return a Base‑64 string that the server can decode
  return sodium.to_base64(sealed, sodium.base64_variants.ORIGINAL);
}
