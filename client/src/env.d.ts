/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend API URL; falls back to http://localhost:4000/decrypt in App.tsx */
  readonly VITE_API_URL?: string;
  /** Server's libsodium public key (Base-64, ORIGINAL variant) */
  readonly VITE_SERVER_PUBLIC_KEY?: string;
  /** API key sent as X-API-Key header — NOTE: bundled into client JS, treat as public */
  readonly VITE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
