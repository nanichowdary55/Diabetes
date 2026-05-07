import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/bb-api': {
        target: 'https://sandbox.bluebutton.cms.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bb-api/, ''),
        secure: true,
      }
    }
  }
})
