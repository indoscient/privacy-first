// src/App.tsx
import React, { useEffect, useState } from 'react';
import { initCrypto, encryptMessage } from './crypto';
import './index.css';

/* -------------------------------------------------------------
   Configuration
   ------------------------------------------------------------- */
// The server prints its public key on start‑up. Paste that exact string here.
const SERVER_PUBLIC_KEY_B64 =
  'sFCuzaAkERysgkxzN3/fnTXWxStH7M3E3qjO2wwepUs='; // <-- replace with the real key

// The backend endpoint (fallback to local dev server)
const SERVER_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/decrypt';

function App() {
  const [msg, setMsg] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Initialise libsodium once when the component mounts
  useEffect(() => {
    initCrypto()
      .then(() => setReady(true))
      .catch(err => console.error('libsodium init failed:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return; // libsodium not ready yet

    // 1️⃣ Encrypt with the server’s public key (sealed box)
    const ciphertext = encryptMessage(msg, SERVER_PUBLIC_KEY_B64);
    console.log('🔐 ciphertext to send →', ciphertext);
 
    // 2️⃣ POST to the server
    const resp = await fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ciphertext })
    });

    // 3️⃣ Show the plaintext returned by the server
    const data = await resp.json();
    setResult(data.plaintext);
  };

  return (
    <div className="container">
      <h1>🔐 End‑to‑End Demo</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter a secret message…"
        value={msg}
          onChange={e => setMsg(e.target.value)}
          rows={4}
          cols={60}
          required
        />
        <br />
        <button type="submit" disabled={!ready}>
          Encrypt &amp; Send
        </button>
      </form>

      {result && (
        <div className="result">
          <h2>Decrypted on server:</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
