import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon-32x32.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Patas Seguras',
        short_name: 'Patas Seguras',
        description: 'Plataforma gratuita de proteção animal',
        theme_color: '#0F6E56',
        background_color: '#0F6E56',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // pré-cache dos arquivos estáticos gerados pelo build (HTML, CSS, JS, ícones).
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // nunca cachear chamadas de API — sempre buscar dados frescos do backend,
        // tanto em dev (localhost) quanto em produção (domínio separado no Render).
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/api/'),
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
})
