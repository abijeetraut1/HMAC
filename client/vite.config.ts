import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://crispy-eureka-pwxg4q7xwg4cr96v-3000.app.github.dev',
    },
  },
})