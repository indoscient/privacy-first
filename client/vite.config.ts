// client/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
+  base: '/privacy-first/',
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
      output: {}
    }
  }
});
