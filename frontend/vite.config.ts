import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/fukusuke-sushi/',
  plugins: [react()],
  server: {
    allowedHosts: ['4379-186-79-198-40.ngrok-free.app']
  }
})