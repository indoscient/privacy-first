// client/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
  base: '/privacy-first/',
  plugins: [react()],
  optimizeDeps: {
    include: ['libsodium-wrappers'],
    noExternal: ['libsodium-wrappers'],
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({ buffer: true }),
        NodeModulesPolyfillPlugin()
      ]
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('libsodium')) return 'sodium';
            if (id.includes('react') || id.includes('scheduler')) return 'vendor-react';
            return 'vendor';
          }
        }
      }
    }
  }
});
