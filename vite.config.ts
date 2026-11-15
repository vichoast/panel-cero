import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Rutas relativas: la app funciona publicada en cualquier carpeta o subdominio.
  base: './',
  plugins: [react(), tailwindcss()],
})
