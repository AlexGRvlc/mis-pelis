import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 👈 Importamos el plugin oficial

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 👈 Lo activamos aquí como plugin nativo
  ],
})
