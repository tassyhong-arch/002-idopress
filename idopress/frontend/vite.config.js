import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    hmr: {
      port: 3000
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    // 환경변수 설정
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:5000/api')
  }
})