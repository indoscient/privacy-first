// server/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { initCrypto, decryptMessage } from './crypto';
import type { Request, Response, NextFunction } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 4000;

/* -------------------------------------------------------------
   Environment configuration
   ------------------------------------------------------------- */
const PRIVATE_KEY_B64 = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY_B64) {
  console.error('❌ PRIVATE_KEY not set in .env');
  process.exit(1);
}

// Optional: API key for authenticating requests. If unset, all
// authenticated routes are rejected (fail-closed).
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn('⚠️  API_KEY not set in .env — /decrypt will reject all requests.');
}

// Comma-separated list of allowed origins, e.g.:
// ALLOWED_ORIGINS=https://your-app.netlify.app,https://your-app.vercel.app
const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173,http://localhost:3000'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

/* -------------------------------------------------------------
   Middleware (order matters!)

   1. CORS       — reject disallowed origins first
   2. Helmet     — security headers on every response
   3. Body parse — parse JSON with a size cap
   4. Rate limit — global limiter for all routes
   ------------------------------------------------------------- */

// --- FIX #3: CORS restricted to known origins ---
app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server requests (curl, Postman) with no Origin header
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'X-API-Key'],
    maxAge: 86400, // Cache preflight results for 24h
  })
);

// --- Security headers (Helmet) ---
app.use(helmet());

// --- Body parser with payload cap ---
app.use(express.json({ limit: '64kb' }));

// --- FIX #2: Rate limiting (two tiers) ---
const globalLimiter = rateLimit({
  standardHeaders: true,     // Send RateLimit-* headers
  legacyHeaders: false,
  windowMs: 15 * 60 * 1000, // 15-minute window
  limit: 100,                // Max 100 requests per IP per window
  message: { error: 'Too many requests, please try again later.' },
});

const decryptLimiter = rateLimit({
  standardHeaders: true,
  legacyHeaders: false,
  windowMs: 15 * 60 * 1000,
  limit: 20,                 // Stricter — crypto ops are expensive
  message: { error: 'Decrypt rate limit exceeded. Slow down.' },
});

app.use(globalLimiter);

/* -------------------------------------------------------------
   FIX #1 — API key authentication middleware
   ------------------------------------------------------------- */
const requireApiKey = (req: Request, res: Response, next: NextFunction): void => {
  if (!API_KEY) {
    // Fail-closed: no configured key means no access
    res.status(503).json({ error: 'Server authentication is not configured.' });
    return;
  }

  // Read the key from the X-API-Key header (or Authorization: Bearer ...)
  const headerKey = req.headers['x-api-key'];
  const bearerKey = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined;

  const provided = typeof headerKey === 'string' ? headerKey : bearerKey;

  // Constant-time comparison prevents timing attacks
  if (!provided || !timingSafeEqual(provided, API_KEY)) {
    // Log the attempt WITHOUT echoing the provided key
    console.warn(`🔒 Unauthorized ${req.method} ${req.path} from ${req.ip}`);
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
};

/** Constant-time string comparison (avoids early-exit timing leaks). */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/* -------------------------------------------------------------
   Routes
   ------------------------------------------------------------- */
app.get('/', (_, res) => res.send('🔐 Encryption demo server'));

/* Health/status endpoint (kept outside auth so monitors can ping it) */
app.get('/health', (_, res) => res.json({ status: 'ok' }));

/* Decrypt endpoint — protected by BOTH auth and stricter rate limit */
app.post('/decrypt', requireApiKey, decryptLimiter, async (req, res) => {
  const { ciphertext } = req.body;
  if (!ciphertext || typeof ciphertext !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid ciphertext' });
  }

  try {
    const plaintext = await decryptMessage(ciphertext, PRIVATE_KEY_B64);
    res.json({ plaintext });
  } catch (e) {
    // Log details server-side, but never leak internals to the client
    console.error('Decryption failed:', e);
    res.status(500).json({ error: 'Failed to decrypt' });
  }
});

/* Serve the public key so clients can fetch it at runtime
   (also authenticated — you decide who may obtain the key) */
app.get('/public-key', requireApiKey, async (_req, res) => {
  const sodium = await initCrypto();
  const privKey = sodium.from_base64(PRIVATE_KEY_B64, sodium.base64_variants.ORIGINAL);
  const pubKey = sodium.crypto_scalarmult_base(privKey);
  res.json({ publicKey: sodium.to_base64(pubKey, sodium.base64_variants.ORIGINAL) });
});

/* -------------------------------------------------------------
   Error handler — catch CORS errors and bad JSON bodies
   ------------------------------------------------------------- */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

/* -------------------------------------------------------------
   Server bootstrap
   ------------------------------------------------------------- */
(async () => {
  // Ensure libsodium is ready before we start listening
  await initCrypto();

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
    console.log(`🔓 CORS allowing origins: ${ALLOWED_ORIGINS.join(', ')}`);
  });
})();
