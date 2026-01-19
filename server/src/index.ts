// server/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initCrypto, decryptMessage } from './crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 4000;

/* -------------------------------------------------------------
   Load the server's private key from .env (Base‑64, ORIGINAL)
   ------------------------------------------------------------- */
const PRIVATE_KEY_B64 = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY_B64) {
  console.error('❌ PRIVATE_KEY not set in .env');
  process.exit(1);
}

/* ------------------- Middleware ------------------- */
app.use(cors());
app.use(express.json());

/* ------------------- Routes ------------------- */
// Simple health check
app.get('/', (_, res) => res.send('🔐 Encryption demo server'));

/* Decrypt endpoint */
app.post('/decrypt', async (req, res) => {
  const { ciphertext } = req.body;
  if (!ciphertext) {
    return res.status(400).json({ error: 'Missing ciphertext' });
  }

  try {
    const plaintext = decryptMessage(ciphertext, PRIVATE_KEY_B64);
    res.json({ plaintext });
  } catch (e) {
    console.error('Decryption failed:', e);
    res.status(500).json({ error: 'Failed to decrypt' });
  }
});

/* ------------------- Server bootstrap ------------------- */
(async () => {
  // Ensure libsodium is ready before we start listening
  await initCrypto();

  app.listen(PORT, async () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);

    // Show the public key that clients need
    console.log('Public key (share with client):');

    const sodium = await import('libsodium-wrappers');
    await sodium.ready;

    // Decode the private key (stored as Base‑64)
    const privKey = sodium.from_base64(
      PRIVATE_KEY_B64,
      sodium.base64_variants.ORIGINAL
    );

    // Derive the public key from the private scalar
    const pubKey = sodium.crypto_scalarmult_base(privKey);

    // Print the public key in the same Base‑64 variant
    console.log(sodium.to_base64(pubKey, sodium.base64_variants.ORIGINAL));
  });
})();
