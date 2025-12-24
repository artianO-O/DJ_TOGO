# ⚡ Vite 配置速查表

> 工作中常用的配置，复制即用，无需记忆

---

## 🎯 使用说明

**不要死记硬背！** 需要时来这里复制配置即可。

重要的是**理解原理**，而不是记住每个配置项。

---

## 📦 基础配置模板

### 1. 最小化配置（新项目起步）

```javascript
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
});
```

**何时使用：** 创建新项目时，从这个最小配置开始

---

## 🔧 常用配置场景

### 2. 路径别名配置 ⭐⭐⭐

```javascript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@api": path.resolve(__dirname, "src/api"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
});
```

**使用频率：** ⭐⭐⭐ 几乎每个项目都用

**在代码中使用：**

```javascript
// 之前
import Button from "../../../components/Button.vue";

// 之后
import Button from "@components/Button.vue";
```

---

### 3. 开发服务器 + 代理配置 ⭐⭐⭐

```javascript
export default defineConfig({
  server: {
    // 端口
    port: 3000,

    // 自动打开浏览器
    open: true,

    // 监听所有地址（允许外部访问）
    host: true,

    // API 代理（解决跨域）
    proxy: {
      // 代理 /api 开头的请求
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },

      // 多个代理示例
      "/admin-api": {
        target: "http://localhost:9000",
        changeOrigin: true,
      },
    },
  },
});
```

**使用频率：** ⭐⭐⭐ 前后端分离项目必用

**实际效果：**

```javascript
// 前端请求
fetch("/api/users");

// 实际请求地址
// http://localhost:8080/users  （/api 被去掉了）
```

---

### 4. 环境变量配置 ⭐⭐

```javascript
// vite.config.js
export default defineConfig({
  // 环境变量前缀（默认 VITE_）
  envPrefix: "VITE_",
});
```

```bash
# .env.development（开发环境）
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=开发环境

# .env.production（生产环境）
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=生产环境
```

**在代码中使用：**

```javascript
console.log(import.meta.env.VITE_API_BASE_URL);
```

---

### 5. 构建优化配置 ⭐⭐

```javascript
export default defineConfig({
  build: {
    // 输出目录
    outDir: "dist",

    // 静态资源目录
    assetsDir: "assets",

    // 小于此值的资源将内联为 base64
    assetsInlineLimit: 4096, // 4KB

    // 是否生成 source map
    sourcemap: false,

    // 代码分割策略
    rollupOptions: {
      output: {
        // 手动分包
        manualChunks: {
          // 将 Vue 相关的库打包到一起
          "vue-vendor": ["vue", "vue-router", "pinia"],
          // 将 UI 库单独打包
          "ui-vendor": ["element-plus"],
        },

        // 文件命名
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: "[ext]/[name]-[hash].[ext]",
      },
    },

    // 压缩配置
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // 删除 console.log
        drop_debugger: true, // 删除 debugger
      },
    },
  },
});
```

**何时使用：**

- 打包体积过大时
- 需要优化加载性能时
- 生产环境去掉 console

---

## 🔌 常用插件配置

### 6. 自动导入插件 ⭐⭐⭐

```javascript
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    vue(),

    // 自动导入 Vue API
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      resolvers: [ElementPlusResolver()],
    }),

    // 自动导入组件
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
});
```

**效果：**

```vue
<script setup>
// ❌ 之前需要手动导入
import { ref, computed } from "vue";

// ✅ 现在自动导入
const count = ref(0);
const double = computed(() => count.value * 2);
</script>

<template>
  <!-- ✅ Element Plus 组件也自动导入 -->
  <el-button>按钮</el-button>
</template>
```

**使用频率：** ⭐⭐⭐ 提升开发效率必备

---

### 7. Gzip 压缩插件 ⭐⭐

```javascript
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    vue(),

    // Gzip 压缩
    viteCompression({
      verbose: true, // 输出压缩信息
      disable: false,
      threshold: 10240, // 10KB 以上才压缩
      algorithm: "gzip", // 算法
      ext: ".gz", // 文件扩展名
    }),
  ],
});
```

**何时使用：** 生产环境，减少文件传输大小

---

### 8. 打包分析插件 ⭐

```javascript
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    vue(),

    // 打包分析（只在需要时使用）
    visualizer({
      open: true, // 自动打开报告
      gzipSize: true, // 显示 gzip 大小
      brotliSize: true, // 显示 brotli 大小
      filename: "dist/stats.html",
    }),
  ],
});
```

**何时使用：** 需要分析打包体积时才加

---

## 📋 完整项目配置模板

### 9. 企业级项目完整配置 ✨

```javascript
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import viteCompression from "vite-plugin-compression";
import path from "path";

export default defineConfig({
  // 插件
  plugins: [
    vue(),

    // 自动导入
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      resolvers: [ElementPlusResolver()],
    }),

    Components({
      resolvers: [ElementPlusResolver()],
    }),

    // Gzip 压缩
    viteCompression({
      threshold: 10240,
    }),
  ],

  // 路径别名
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  // 开发服务器
  server: {
    port: 3000,
    open: true,
    host: true,

    // API 代理
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  // 构建配置
  build: {
    outDir: "dist",
    sourcemap: false,

    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          "vue-vendor": ["vue", "vue-router", "pinia"],
        },
      },
    },

    // 压缩
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
```

**使用说明：** 复制这个模板，根据项目需求删减

---

## 🎯 快速查找指南

### 遇到问题时的查找路径

```
❓ 想要解决跨域问题
   → 查看 #3 开发服务器 + 代理配置

❓ 想要简化 import 路径
   → 查看 #2 路径别名配置

❓ 想要自动导入 Vue API
   → 查看 #6 自动导入插件

❓ 打包体积太大
   → 查看 #5 构建优化配置
   → 查看 #8 打包分析插件

❓ 想要使用环境变量
   → 查看 #4 环境变量配置

❓ 想要压缩文件
   → 查看 #7 Gzip 压缩插件
```

---

## 💡 记忆技巧

### 不需要记住所有配置，只需记住这 3 点：

1. **基础结构**

   ```javascript
   export default {
     plugins: [], // 插件
     server: {}, // 开发服务器
     build: {}, // 构建配置
   };
   ```

2. **常用场景**

   - 代理 → `server.proxy`
   - 别名 → `resolve.alias`
   - 分包 → `build.rollupOptions.output.manualChunks`

3. **查文档的位置**
   - 官方文档：https://cn.vitejs.dev/config/
   - 这个速查表 😊

---

## 🔍 实际工作流程

### 典型开发场景

```bash
# 1. 创建新项目（1次）
npm create vite@latest my-project

# 2. 配置路径别名（1次）
→ 复制 #2 路径别名配置

# 3. 配置代理（1次）
→ 复制 #3 代理配置

# 4. 开发中（99%的时间）
→ 不需要碰配置文件！专注写代码

# 5. 优化打包（偶尔）
→ 遇到问题时查看 #5 或 #8
```

---

## ⚠️ 常见错误

### 1. 路径别名不生效

```javascript
// ❌ 错误：忘记导入 path
import { defineConfig } from "vite";

// ✅ 正确
import path from "path";
```

### 2. 代理不生效

```javascript
// ❌ 错误：忘记 changeOrigin
proxy: {
  '/api': {
    target: 'http://localhost:8080'
  }
}

// ✅ 正确
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true  // 必须加这个！
  }
}
```

### 3. 环境变量获取不到

```bash
# ❌ 错误：没有 VITE_ 前缀
API_BASE_URL=xxx

# ✅ 正确
VITE_API_BASE_URL=xxx
```

---

## 📚 相关资源

- [Vite 官方文档](https://cn.vitejs.dev/)
- [Vite 深入学习](./Vite深入学习.md) - 理解原理
- [常用插件列表](https://github.com/vitejs/awesome-vite)

---

**记住：配置只是工具，不需要全部记住！**

**需要时来这里查，理解原理更重要！** 🚀
