// src/App.tsx
import React, { useEffect, useState } from 'react';
import { initCrypto, encryptMessage } from './crypto';
import './index.css';

const SERVER_PUBLIC_KEY_B64 = import.meta.env.VITE_SERVER_PUBLIC_KEY ?? '';
const SERVER_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/decrypt';

function App() {
  const [msg, setMsg] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!SERVER_PUBLIC_KEY_B64) {
      setError('⚠️ VITE_SERVER_PUBLIC_KEY not set in client/.env');
    }
    initCrypto()
      .then(() => {
        setReady(true);
        if (SERVER_PUBLIC_KEY_B64) {
          console.log('✅ Crypto initialized with public key:', SERVER_PUBLIC_KEY_B64.slice(0, 16) + '...');
        }
      })
      .catch(err => setError('libsodium init failed: ' + err.message));
  }, []);

  // client/src/App.tsx — updated handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!ready || !SERVER_PUBLIC_KEY_B64) return;

  try {
    setError(null);
    const ciphertext = encryptMessage(msg, SERVER_PUBLIC_KEY_B64);

    const resp = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': import.meta.env.VITE_API_KEY ?? '',
      },
      body: JSON.stringify({ ciphertext }),
    });

    if (resp.status === 401) throw new Error('Unauthorized — check your API key');
    if (resp.status === 429) throw new Error('Rate limit hit — try again shortly');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);

    const data = await resp.json();
    setResult(data.plaintext);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    setError(errorMessage);
    setResult(null);
  }
};

  return (
    <div className="container">
      <h1>🔐 End‑to‑End Demo</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter a secret message…"
          value={msg}
          onChange={e => setMsg(e.target.value)}
          rows={4}
          cols={60}
          required
          disabled={!ready || !SERVER_PUBLIC_KEY_B64}
        />
        <br />
        <button type="submit" disabled={!ready || !SERVER_PUBLIC_KEY_B64}>
          {ready ? 'Encrypt & Send' : 'Initializing...'}
        </button>
      </form>

      {result && (
        <div className="result">
          <h2>Decrypted on server:</h2>
          <pre>{result}</pre>
        </div>
      )}

      {!SERVER_PUBLIC_KEY_B64 && (
        <div className="hint">
          <p><strong>Note:</strong> Set <code>VITE_SERVER_PUBLIC_KEY</code> in client/.env</p>
        </div>
      )}
    </div>
  );
}

export default App;
