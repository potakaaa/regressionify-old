import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/regressionify/client",
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  }
})
