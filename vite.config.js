import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version)
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'assets/*.png'],
      manifest: {
        name: 'Golfyeah!',
        short_name: 'Golfyeah!',
        description: "Suivez vos parties de golf entre amis.",
        theme_color: '#005239',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: '/index.html',
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024
      }
    })
  ]
});
