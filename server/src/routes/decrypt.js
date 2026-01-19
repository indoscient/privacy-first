// -------------------------------------------------
// Imports & setup (run once when the process starts)
// -------------------------------------------------
const express = require('express');
const sodium = require('libsodium-wrappers');   // or sodium-native
const app = express();

// Body‑parser – required so req.body is already JSON
app.use(express.json());

// -------------------------------------------------
// Load the server's key pair (once, at startup)
// -------------------------------------------------
let privateKey;   // Uint8Array holding the secret key

(async () => {
  await sodium.ready;                     // make sure libsodium is loaded
  // The public/private key pair is printed by the demo on start‑up.
  // Replace the placeholder below with the actual secret key (Base64).
  const PRIVATE_KEY_B64 = 'YOUR_PRIVATE_KEY_BASE64_HERE';
  privateKey = sodium.from_base64(PRIVATE_KEY_B64, sodium.base64_variants.ORIGINAL);
})();

// -------------------------------------------------
// Route – the only required logic
// -------------------------------------------------
app.post('/decrypt', async (req, res) => {
  try {
    const { ciphertext } = req.body;               // <-- Base‑64 string from client
    if (!ciphertext) {
      return res.status(400).json({ error: 'missing ciphertext' });
    }

    // 1️⃣ Decode Base‑64 to raw bytes
    const ctBytes = Buffer.from(ciphertext, 'base64');

    // 2️⃣ Decrypt with the server's private key (sealed‑box)
    const plainBytes = sodium.crypto_box_seal_open(ctBytes, privateKey);

    // 3️⃣ Convert Uint8Array → UTF‑8 string
    const plaintext = Buffer.from(plainBytes).toString('utf8');

    // 4️⃣ Send the result back
    res.json({ plaintext });
  } catch (err) {
    // Any failure (bad key, malformed ciphertext, etc.) lands here
    console.error('Decryption error:', err);
    res.status(400).json({ error: 'decryption failed' });
  }
});

// -------------------------------------------------
// Start the server
// -------------------------------------------------
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
