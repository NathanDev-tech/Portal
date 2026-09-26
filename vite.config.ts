import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site:
// https://nathandev-tech.github.io/Portal/
export default defineConfig({
  base: '/Portal/',
  plugins: [react(), tailwindcss()],
})
