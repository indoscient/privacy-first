/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL of the backend API (optional) */
  readonly VITE_API_URL?: string;
  // add any other VITE_… variables you use, e.g.:
  // readonly VITE_OTHER_VAR: string;
}

/**
 * Extends the built‑in ImportMeta interface with the `env` field.
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
