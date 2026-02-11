import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { BASENAME } from './src/constants';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true, // Force update immediately
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Increase to 5MB
        runtimeCaching: [
          {
            // Cache CSS, JS, and other static assets with a CacheFirst strategy
            urlPattern:
              /\.(?:js|css|html|json|svg|png|jpg|jpeg|gif|ico|woff2?|ttf|eot)$/,
            handler: 'NetworkFirst', // Always fetch from network first
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60, // Cache for 1 hour
              },
              networkTimeoutSeconds: 1,
            },
          },
        ],
      },
    }),
  ],
  server: {
    allowedHosts: true,
    port: 5173,
    strictPort: true,
    host: true,
    hmr: {
      overlay: true
    }
  },
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss()],
    },
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]', // Add hash to file names
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
    outDir: 'build',
  },

  base: BASENAME
})
