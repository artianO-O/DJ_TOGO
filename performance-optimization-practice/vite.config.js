import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      // Gzip 压缩
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240, // 10KB 以上才压缩
        algorithm: 'gzip',
        ext: '.gz',
      }),
      // 打包分析
      mode === 'analyze' && visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    
    // 开发服务器配置
    server: {
      port: 3000,
      open: true,
    },
    
    // 构建配置
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      
      // 代码压缩配置
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,    // 生产环境移除 console
          drop_debugger: true,   // 移除 debugger
        },
        format: {
          comments: false,       // 移除注释
        },
      },
      
      // CSS 代码分割
      cssCodeSplit: true,
      
      // 分包策略
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      
      // chunk 大小警告限制
      chunkSizeWarningLimit: 500,
    },
    
    // 依赖预构建优化
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia'],
    },
  }
})

