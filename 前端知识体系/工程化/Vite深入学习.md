# ⚡ Vite 深入学习

> 下一代前端构建工具 - 快如闪电

---

## 📚 目录

1. [为什么选择 Vite](#为什么选择-vite)
2. [核心原理](#核心原理)
3. [开发服务器](#开发服务器)
4. [生产构建](#生产构建)
5. [插件系统](#插件系统)
6. [性能优化](#性能优化)

---

## 为什么选择 Vite

### 🐢 传统构建工具的问题（Webpack）

```
启动开发服务器：
1. 分析所有模块依赖
2. 打包所有代码
3. 启动服务器
时间：30s - 60s ❌ 慢！

热更新 (HMR)：
1. 重新打包修改的模块
2. 更新浏览器
时间：5s - 10s ❌ 慢！
```

---

### ⚡ Vite 的优势

```
启动开发服务器：
1. 直接启动服务器
2. 按需编译
时间：< 1s ✅ 快！

热更新 (HMR)：
1. 只编译修改的模块
2. 利用 ESM 原生支持
时间：< 100ms ✅ 极快！
```

---

### 📊 性能对比

| 特性 | Webpack | Vite |
|:---:|:---:|:---:|
| **冷启动** | 30-60s | < 1s |
| **热更新** | 5-10s | < 100ms |
| **构建速度** | 中等 | 快 (esbuild) |
| **配置复杂度** | 高 | 低 |

---

## 核心原理

### 🎯 两个核心技术

```
1. 开发环境：ESM (ES Modules) + esbuild
2. 生产环境：Rollup 打包
```

---

### 1️⃣ 利用浏览器原生 ESM

```html
<!-- 传统方式：需要打包 -->
<script src="/dist/bundle.js"></script>

<!-- Vite 方式：直接加载 ES 模块 -->
<script type="module" src="/src/main.js"></script>
```

```javascript
// main.js
import { createApp } from 'vue'  // 浏览器直接支持 import
import App from './App.vue'

createApp(App).mount('#app')
```

**浏览器会自动发起请求：**

```
GET /src/main.js
GET /node_modules/vue/dist/vue.runtime.esm-bundler.js
GET /src/App.vue
```

---

### 2️⃣ 按需编译

```
传统打包工具：
所有文件 → 打包 → 启动服务器

Vite：
启动服务器 → 浏览器请求什么 → 编译什么
```

**示例：**

```
访问首页：
GET /          → 返回 index.html
GET /main.js   → 实时编译并返回
GET /App.vue   → 实时编译并返回

访问其他页面：
GET /About.vue → 此时才编译（懒加载）
```

---

### 3️⃣ 依赖预构建

**问题**：`node_modules` 中的包可能不是 ESM 格式

**解决**：Vite 启动时，使用 **esbuild** 预构建依赖

```bash
# 预构建缓存位置
node_modules/.vite/deps/
├── vue.js           # 预构建后的 Vue
├── vue-router.js    # 预构建后的 Vue Router
└── pinia.js         # 预构建后的 Pinia
```

**好处：**
- 统一为 ESM 格式
- 合并小文件，减少请求数
- 极快（esbuild 用 Go 写的，比 JS 快 10-100 倍）

---

## 开发服务器

### 🚀 启动流程

```javascript
// vite.config.js
export default {
  server: {
    port: 3000,
    host: true,  // 监听所有地址
    open: true,  // 自动打开浏览器
    
    // 代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}
```

---

### ⚡ 热更新 (HMR)

```javascript
// Vite 的 HMR API
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // 模块更新时执行
    console.log('模块已更新:', newModule)
  })
  
  import.meta.hot.dispose(() => {
    // 模块销毁前执行
    console.log('模块即将销毁')
  })
}
```

**Vue 组件自动支持 HMR：**

```vue
<template>
  <div>{{ count }}</div>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)

// 修改这里，页面会自动更新，状态保持！
</script>
```

---

## 生产构建

### 📦 构建命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

---

### 🔧 构建配置

```javascript
// vite.config.js
export default {
  build: {
    // 输出目录
    outDir: 'dist',
    
    // 静态资源目录
    assetsDir: 'assets',
    
    // 小于此阈值的资源将内联为 base64
    assetsInlineLimit: 4096,  // 4KB
    
    // 代码分割策略
    rollupOptions: {
      output: {
        // 手动分包
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['element-plus']
        }
      }
    },
    
    // 压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,    // 移除 console
        drop_debugger: true    // 移除 debugger
      }
    },
    
    // 生成 source map
    sourcemap: false,
    
    // 启用 CSS 代码分割
    cssCodeSplit: true
  }
}
```

---

### 📊 打包分析

```javascript
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer'

export default {
  plugins: [
    visualizer({
      open: true,  // 构建完成后自动打开
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    })
  ]
}
```

---

## 插件系统

### 🔌 Vite 插件架构

Vite 插件兼容 **Rollup 插件**，同时有自己的特性。

```javascript
// vite.config.js
export default {
  plugins: [
    vue(),                    // Vue 支持
    vueJsx(),                 // Vue JSX 支持
    legacy(),                 // 兼容旧浏览器
    compression(),            // Gzip 压缩
    // 自定义插件
    myPlugin()
  ]
}
```

---

### 🛠️ 常用插件

#### 1. Vue 相关

```javascript
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default {
  plugins: [
    vue(),
    vueJsx()
  ]
}
```

---

#### 2. 自动导入

```javascript
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default {
  plugins: [
    // 自动导入 Vue API
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()]
    }),
    
    // 自动导入组件
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ]
}
```

**效果：**

```vue
<script setup>
// 无需 import，自动导入！
const count = ref(0)
const router = useRouter()
const store = useStore()
</script>

<template>
  <!-- Element Plus 组件自动导入 -->
  <el-button @click="count++">{{ count }}</el-button>
</template>
```

---

#### 3. SVG 图标

```javascript
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default {
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-[dir]-[name]'
    })
  ]
}
```

---

#### 4. Gzip 压缩

```javascript
import viteCompression from 'vite-plugin-compression'

export default {
  plugins: [
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,  // 10KB 以上才压缩
      algorithm: 'gzip',
      ext: '.gz'
    })
  ]
}
```

---

### 📝 编写自定义插件

```javascript
// plugins/my-plugin.js
export default function myPlugin() {
  return {
    name: 'my-plugin',
    
    // 开发服务器启动时
    configureServer(server) {
      console.log('服务器启动')
    },
    
    // 转换代码
    transform(code, id) {
      if (id.endsWith('.vue')) {
        // 处理 Vue 文件
        return {
          code: code.replace('Hello', 'Hi'),
          map: null
        }
      }
    },
    
    // 构建开始
    buildStart() {
      console.log('构建开始')
    },
    
    // 构建结束
    buildEnd() {
      console.log('构建结束')
    }
  }
}
```

---

## 性能优化

### 1️⃣ 代码分割

```javascript
// 路由懒加载
const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue')  // 懒加载
  },
  {
    path: '/about',
    component: () => import('./views/About.vue')
  }
]
```

---

### 2️⃣ 依赖预构建

```javascript
// vite.config.js
export default {
  optimizeDeps: {
    // 强制预构建的依赖
    include: ['vue', 'vue-router', 'pinia'],
    
    // 排除不需要预构建的依赖
    exclude: ['@vueuse/core']
  }
}
```

---

### 3️⃣ 资源处理

```javascript
// 图片压缩
import viteImagemin from 'vite-plugin-imagemin'

export default {
  plugins: [
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 80
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs', active: false }
        ]
      }
    })
  ]
}
```

---

### 4️⃣ CDN 加速

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      external: ['vue', 'vue-router'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter'
        }
      }
    }
  }
}
```

```html
<!-- index.html -->
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-router@4"></script>
```

---

### 5️⃣ 构建缓存

```javascript
// vite.config.js
export default {
  build: {
    // 生成稳定的 hash
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]'
      }
    }
  }
}
```

---

## 🎯 完整配置示例

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import path from 'path'

export default defineConfig({
  // 插件
  plugins: [
    vue(),
    
    // 自动导入
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia']
    }),
    
    Components({
      dts: true
    }),
    
    // Gzip 压缩
    viteCompression({
      threshold: 10240
    }),
    
    // 打包分析
    visualizer({
      open: true
    })
  ],
  
  // 路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  // 开发服务器
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: false,
    
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'lodash': ['lodash-es']
        }
      }
    },
    
    // 压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // 依赖优化
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  }
})
```

---

## 📚 学习资源

- 📖 [Vite 官方文档](https://cn.vitejs.dev/)
- 📖 [Rollup 官方文档](https://rollupjs.org/)
- 🎬 [Vite 从入门到精通](https://www.bilibili.com/video/BV1GN4y1M7P5)

---

## ✅ 学习检查清单

- [ ] 理解 Vite 为什么快
- [ ] 理解 ESM 和依赖预构建
- [ ] 掌握 HMR 原理
- [ ] 会配置开发服务器和代理
- [ ] 掌握生产构建配置
- [ ] 会使用常用插件
- [ ] 能编写自定义插件
- [ ] 掌握性能优化技巧

---

**Vite：让前端开发飞起来！** ⚡

