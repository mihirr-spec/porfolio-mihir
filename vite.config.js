import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  ssr: {
    // Output ESM so prerender.mjs can import it with dynamic import()
    format: 'esm',
  },
});
