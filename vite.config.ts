import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],

  resolve: {
    alias: {
      '@/': '/src/',
    },
  },

  server: {
    port: 3000,
    hmr: false,
  },

  worker: {
    format: 'es',
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: 'Workers/[name].[hash].js',
      },
    },
  },
})
