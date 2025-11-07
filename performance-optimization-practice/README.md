# 🚀 性能优化练习项目

一个基于 Vue3 + Vite 的性能优化练习项目，包含多个实用的性能优化场景和示例。

## ✨ 项目特点

- 🎯 **实战导向** - 包含真实场景下的性能优化案例
- 📚 **学习友好** - 每个示例都有详细的代码注释和说明
- 🔧 **开箱即用** - 完整的项目配置，可直接运行学习
- 📊 **性能监控** - 内置性能指标监控和分析工具
- 💡 **最佳实践** - 遵循业界最佳的性能优化实践

## 📦 技术栈

- **框架**: Vue 3.4+
- **构建工具**: Vite 5.0+
- **路由**: Vue Router 4.2+
- **状态管理**: Pinia 2.1+
- **样式**: SCSS
- **包分析**: rollup-plugin-visualizer
- **压缩**: vite-plugin-compression

## 🎓 学习内容

### 1. 图片优化 📸

- ✅ 图片懒加载 (Lazy Loading)
- ✅ 响应式图片 (Responsive Images)
- ✅ WebP 格式自动转换
- ✅ 图片预加载 (Preload)

**核心技术**:
- IntersectionObserver API
- `srcset` 和 `sizes` 属性
- `<picture>` 标签

### 2. 列表优化 📋

- ✅ 虚拟滚动 (Virtual Scroll)
- ✅ 无限滚动 (Infinite Scroll)
- ✅ 防抖 (Debounce)
- ✅ 节流 (Throttle)

**核心技术**:
- 虚拟滚动算法
- IntersectionObserver
- 高频事件优化

### 3. 懒加载 ⏳

- ✅ 组件懒加载
- ✅ 路由懒加载
- ✅ 内容预加载
- ✅ IntersectionObserver 实践

**核心技术**:
- Dynamic Import
- `defineAsyncComponent`
- `<Suspense>` 组件
- 预加载策略

### 4. 代码分割 ✂️

- ✅ 动态导入 (Dynamic Import)
- ✅ 打包分析
- ✅ Chunk 分割策略
- ✅ Tree Shaking

**核心技术**:
- Vite 构建优化
- Manual Chunks 配置
- 依赖分析

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 开始学习！

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 打包分析

```bash
npm run analyze
```

运行后会自动打开浏览器，显示打包分析结果。

## 📊 性能监控

项目内置了多种性能监控工具：

### 1. Web Vitals 监控

自动监控以下核心指标：

- **LCP** (Largest Contentful Paint) - 最大内容绘制
- **FID** (First Input Delay) - 首次输入延迟
- **CLS** (Cumulative Layout Shift) - 累积布局偏移

打开浏览器控制台即可查看实时数据。

### 2. 性能 API

使用内置的性能工具函数：

```javascript
import { getPerformanceMetrics, logPerformanceReport } from '@/utils/performance'

// 获取性能指标
const metrics = getPerformanceMetrics()

// 打印性能报告
logPerformanceReport()
```

### 3. 打包分析

使用 `npm run analyze` 查看：

- 各个包的体积
- 依赖关系
- Gzip 压缩后的大小
- Brotli 压缩后的大小

## 🎯 性能优化最佳实践

### 资源优化

```javascript
// ✅ 使用图片懒加载
<img v-lazy="imageUrl" alt="示例图片" />

// ✅ 使用响应式图片
<img 
  :srcset="`${img400} 400w, ${img800} 800w`"
  sizes="(max-width: 600px) 400px, 800px"
/>

// ✅ WebP 格式支持
<picture>
  <source :srcset="imageWebp" type="image/webp" />
  <img :src="imageJpg" alt="示例" />
</picture>
```

### 代码优化

```javascript
// ✅ 路由懒加载
const Home = () => import('@/views/Home.vue')

// ✅ 组件懒加载
const HeavyComponent = defineAsyncComponent(() =>
  import('@/components/HeavyComponent.vue')
)

// ✅ 动态导入第三方库
const loadLibrary = async () => {
  const { default: lib } = await import('heavy-library')
  return lib
}
```

### 列表优化

```javascript
// ✅ 使用虚拟滚动
<VirtualList 
  :items="longList"
  :item-height="60"
  :container-height="400"
/>

// ✅ 防抖搜索
const handleSearch = debounce((keyword) => {
  // 执行搜索
}, 300)

// ✅ 节流滚动
const handleScroll = throttle(() => {
  // 处理滚动
}, 100)
```

## 📁 项目结构

```
performance-optimization-practice/
├── src/
│   ├── components/          # 组件
│   │   ├── VirtualList.vue  # 虚拟滚动组件
│   │   └── HeavyComponent.vue # 重组件示例
│   ├── composables/         # 组合式函数
│   │   ├── useLazyLoad.js   # 懒加载指令
│   │   └── useIntersectionObserver.js
│   ├── views/               # 页面
│   │   ├── Home.vue
│   │   ├── ImageOptimization.vue
│   │   ├── ListOptimization.vue
│   │   ├── LazyLoad.vue
│   │   └── CodeSplit.vue
│   ├── router/              # 路由配置
│   ├── styles/              # 全局样式
│   ├── utils/               # 工具函数
│   │   └── performance.js   # 性能工具
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js           # Vite 配置
├── package.json
└── README.md
```

## 🔧 Vite 配置说明

### 构建优化

```javascript
build: {
  // 使用 terser 压缩
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,    // 移除 console
      drop_debugger: true,   // 移除 debugger
    }
  },
  
  // 分包策略
  rollupOptions: {
    output: {
      manualChunks: {
        'vue-vendor': ['vue', 'vue-router', 'pinia'],
      }
    }
  }
}
```

### 依赖预构建

```javascript
optimizeDeps: {
  include: ['vue', 'vue-router', 'pinia'],
}
```

### 插件配置

- **Gzip 压缩**: 自动生成 .gz 文件
- **打包分析**: 可视化查看打包结果

## 📈 性能指标参考

| 指标 | 优秀 | 良好 | 需改进 |
|------|------|------|--------|
| **FCP** | < 1.8s | 1.8s - 3s | > 3s |
| **LCP** | < 2.5s | 2.5s - 4s | > 4s |
| **FID** | < 100ms | 100ms - 300ms | > 300ms |
| **CLS** | < 0.1 | 0.1 - 0.25 | > 0.25 |
| **TTI** | < 3.8s | 3.8s - 7.3s | > 7.3s |

## 💡 学习建议

1. **从简单到复杂** - 按顺序学习各个优化场景
2. **实际操作** - 打开浏览器开发者工具，观察性能变化
3. **对比测试** - 开启/关闭优化，对比性能差异
4. **阅读源码** - 理解每个优化技术的实现原理
5. **应用实践** - 将学到的技术应用到自己的项目中

## 📚 相关资源

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vite 官方文档](https://cn.vitejs.dev/)
- [Web Vitals](https://web.dev/vitals/)
- [MDN Performance](https://developer.mozilla.org/zh-CN/docs/Web/Performance)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT License

---

**Happy Learning! 🎉**

如有问题或建议，欢迎提出 Issue。

