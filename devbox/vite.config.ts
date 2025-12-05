import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // GitHub Pages 部署路径：/仓库名/子目录/
  // 例如仓库名是 DJ_TOGO，子目录是 devbox
  base: process.env.NODE_ENV === 'production' ? '/DJ_TOGO/devbox/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})

