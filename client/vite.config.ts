import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.VITE_PORT || '5173'),
    watch: {
      usePolling: true,
    },
  },
  define: {
    'import.meta.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL || 'http://localhost:8000'),
  },
})

