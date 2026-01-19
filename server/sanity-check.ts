// sanity-check.ts  (you can keep this in the server folder)
import 'dotenv/config';
import sodium from 'libsodium-wrappers';

(async () => {
  await sodium.ready;
  const b64 = process.env.PRIVATE_KEY;
  if (!b64) {
    console.error('❌ PRIVATE_KEY not set');
    process.exit(1);
  }
  try {
    const buf = sodium.from_base64(b64, sodium.base64_variants.ORIGINAL);
    if (buf.length !== sodium.crypto_box_SECRETKEYBYTES) {
      console.error(`❌ Wrong length: ${buf.length} bytes`);
      process.exit(1);
    }
    console.log('✅ PRIVATE_KEY is a valid 32‑byte secret key');
  } catch (e) {
    console.error('❌ Failed to decode PRIVATE_KEY:', (e as Error).message);
    process.exit(1);
  }
})();
