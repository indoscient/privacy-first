const dotenv = require('dotenv');
const sodium = require('libsodium-wrappers');
const fs = require('fs');

dotenv.config();

(async () => {
  await sodium.ready;
  
  const priv = sodium.from_base64(process.env.PRIVATE_KEY, sodium.base64_variants.ORIGINAL);
  const pub = sodium.crypto_scalarmult_base(priv);
  
  const msg = sodium.from_string('Hello Lumo test');
  const sealed = sodium.crypto_box_seal(msg, pub);
  const b64 = sodium.to_base64(sealed, sodium.base64_variants.ORIGINAL);
  
  console.log('Generated valid ciphertext:');
  console.log(b64);
  
  // Save for curl test
  fs.writeFileSync('test-body.json', JSON.stringify({ ciphertext: b64 }));
  console.log('\nSaved to test-body.json');
  
  // Print the exact key we'll use
  console.log('\nAPI_KEY from .env:');
  console.log(process.env.API_KEY);
})();
