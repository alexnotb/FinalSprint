import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This helps ensure proper module resolution
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom')
    }
  },
  optimizeDeps: {
    include: ['react-router-dom']
  },
  server: {
    // Add more detailed logs to help troubleshoot
    hmr: {
      overlay: true
    }
  }
})
