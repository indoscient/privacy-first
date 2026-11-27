// api/netlify/functions/decrypt.mts
import { Config, Context } from '@netlify/functions';
import sodium from 'libsodium-wrappers';

const env = (k: string) => Netlify.env.get(k) ?? '';

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const json = (data: unknown, status = 200, origin?: string | null) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });

export default async (req: Request, _context: Context): Promise<Response> => {
  const origin = req.headers.get('Origin');
  const allowed = env('ALLOWED_ORIGINS').split(',').map(o => o.trim()).filter(Boolean);
  if (origin && !allowed.includes(origin)) {
    return json({ error: 'Origin not allowed by CORS' }, 403);
  }
  if (req.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  // Auth — fail-closed, same semantics as server/src/index.ts
  const provided =
    req.headers.get('x-api-key') ??
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
    undefined;
  const apiKey = env('API_KEY');
  if (!apiKey || !provided || !timingSafeEqual(provided, apiKey)) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const body = await req.text();
  if (body.length > 64 * 1024) return json({ error: 'Payload too large' }, 413);

  let ciphertext: unknown;
  try { ciphertext = JSON.parse(body)?.ciphertext; }
  catch { return json({ error: 'Invalid JSON' }, 400); }
  if (typeof ciphertext !== 'string' || !ciphertext) {
    return json({ error: 'Missing or invalid ciphertext' }, 400);
  }

  await sodium.ready;
  const privKey = sodium.from_base64(env('PRIVATE_KEY'), sodium.base64_variants.ORIGINAL);
  const pubKey = sodium.crypto_scalarmult_base(privKey);
  try {
    const plain = sodium.crypto_box_seal_open(
      sodium.from_base64(ciphertext, sodium.base64_variants.ORIGINAL),
      pubKey,
      privKey
    );
    return json({ plaintext: sodium.to_string(plain) }, 200, origin);
  } catch {
    return json({ error: 'Failed to decrypt' }, 500);
  }
};

// Clean URL: https://<site>/decrypt — and this path then serves ONLY the function
export const config: Config = { path: '/decrypt' };
