import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [react()],
  build: {
      rollupOptions: {
        input: {
          main: resolve(dirname(fileURLToPath(import.meta.url)), 'index.html'),
          about: resolve(dirname(fileURLToPath(import.meta.url)), 'about.html'),
      }
    }
  }
})