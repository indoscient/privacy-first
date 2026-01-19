// server/src/generate-keypair.ts
import sodium from 'libsodium-wrappers';

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
  await sodium.ready;

  // Generate a fresh key pair (32‑byte secret + 32‑byte public)
  const keyPair = sodium.crypto_box_keypair();

  // Encode using the ORIGINAL variant (includes padding)
  const privB64 = sodium.to_base64(
    keyPair.privateKey,
    sodium.base64_variants.ORIGINAL
  );
  const pubB64 = sodium.to_base64(
    keyPair.publicKey,
    sodium.base64_variants.ORIGINAL
  );

  console.log('PRIVATE:', privB64);
  console.log('PUBLIC :', pubB64);
})();
