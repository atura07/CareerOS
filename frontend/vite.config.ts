import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Pin the dev server to the CORS-approved origin (http://localhost:5173),
    // which is what the backend CorsConfig allows. Do NOT let Vite drift to
    // 5174/5175, or cross-origin requests to the backend will be blocked.
    port: 5173,
    strictPort: true,
  },
})

