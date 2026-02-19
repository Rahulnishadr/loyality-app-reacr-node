import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    {
      name: 'treat-js-as-jsx',
      async transform(code, id) {
        if (!id.includes('node_modules') && /\.js$/.test(id) && id.includes('src')) {
          return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
        }
      },
    },
    react({ include: /\.(jsx|js|tsx|ts)$/ }),
  ],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/auth': { target: 'https://6393-103-206-131-194.ngrok-free.app', changeOrigin: true },
      '/webhooks': { target: 'https://6393-103-206-131-194.ngrok-free.app', changeOrigin: true },
      '/api': { target: 'https://6393-103-206-131-194.ngrok-free.app', changeOrigin: true },
      '/health': { target: 'https://6393-103-206-131-194.ngrok-free.app', changeOrigin: true },
    },
  },
  define: {
    'import.meta.env.VITE_SHOPIFY_API_KEY': JSON.stringify(process.env.VITE_SHOPIFY_API_KEY || ''),
  },
});
