import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all keys from .env / .env.local (not only VITE_*), then expose Gemini settings to the client.
  const env = loadEnv(mode, __dirname, '')
  const apiKey = env.VITE_GEMINI_API_KEY?.trim() || env.GEMINI_API_KEY?.trim() || ''
  const model = env.VITE_GEMINI_MODEL?.trim() || env.GEMINI_MODEL?.trim() || ''

  return {
    plugins: [react(), tailwindcss()],
    envDir: __dirname,
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      allowedHosts: true,
      cors: true,
    },
    define: {
      ...(apiKey
        ? { 'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey) }
        : {}),
      ...(model ? { 'import.meta.env.VITE_GEMINI_MODEL': JSON.stringify(model) } : {}),
    },
  }
})
