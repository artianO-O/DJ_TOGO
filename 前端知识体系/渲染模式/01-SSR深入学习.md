# SSR (服务端渲染) 深入学习 🚀

> Server-Side Rendering - 在服务器端渲染页面，提升首屏性能和 SEO

---

## 📚 目录

1. [什么是 SSR](#什么是-ssr)
2. [CSR vs SSR 对比](#csr-vs-ssr-对比)
3. [SSR 工作原理](#ssr-工作原理)
4. [Vue SSR 实现](#vue-ssr-实现)
5. [Nuxt.js 框架](#nuxtjs-框架)
6. [SSR 性能优化](#ssr-性能优化)
7. [实战案例](#实战案例)

---

## 什么是 SSR

### 🎯 定义

**SSR (Server-Side Rendering)** 是指在**服务器端**生成完整的 HTML 页面，然后发送给浏览器，而不是在客户端通过 JavaScript 动态生成。

### 🔄 渲染流程对比

#### 传统 CSR (客户端渲染)

```
1. 用户访问网站
2. 服务器返回空的 HTML + JS 文件
3. 浏览器下载 JS
4. JS 执行，渲染页面
5. 用户看到内容 ⏱️ 慢
```

#### SSR (服务端渲染)

```
1. 用户访问网站
2. 服务器执行 Vue/React 代码
3. 服务器生成完整的 HTML
4. 浏览器直接显示内容 ⏱️ 快
5. JS 下载完成后，页面"激活"(Hydration)
```

---

## CSR vs SSR 对比

| 特性 | CSR (客户端渲染) | SSR (服务端渲染) |
|:---:|:---:|:---:|
| **首屏速度** | 🐢 慢（需等待 JS 下载执行） | 🚀 快（直接返回 HTML） |
| **SEO** | ❌ 差（爬虫看不到内容） | ✅ 好（爬虫能看到完整 HTML） |
| **服务器压力** | ✅ 小（只返回静态文件） | ❌ 大（每次请求都要渲染） |
| **开发复杂度** | ✅ 简单 | ❌ 复杂（需处理同构代码） |
| **交互性** | ✅ 流畅 | ⚠️ 需要 Hydration |
| **适用场景** | 后台管理系统、工具应用 | 官网、博客、电商首页 |

---

## SSR 工作原理

### 🔧 核心概念

#### 1. 同构渲染 (Isomorphic Rendering)

同一套代码，既能在**服务端**运行，也能在**客户端**运行。

```javascript
// 这段代码在服务端和客户端都能运行
const App = {
  data() {
    return {
      message: 'Hello SSR!'
    }
  },
  template: '<div>{{ message }}</div>'
}
```

#### 2. Hydration (激活/水合)

服务端渲染出 HTML 后，客户端 JS 需要"接管"这个静态 HTML，绑定事件、添加交互性。

```html
<!-- 服务端渲染出的 HTML -->
<div id="app">
  <button>点击我</button>
</div>

<script>
  // 客户端 Hydration：给按钮绑定事件
  document.querySelector('button').addEventListener('click', handleClick)
</script>
```

---

### 🎨 SSR 渲染流程图

```
浏览器                           服务器                          数据库
  |                               |                               |
  |---(1) 发起请求---------------->|                               |
  |                               |                               |
  |                               |---(2) 获取数据--------------->|
  |                               |<----------(3) 返回数据--------|
  |                               |                               |
  |                               |---(4) 执行 Vue/React 代码      |
  |                               |     生成完整 HTML             |
  |                               |                               |
  |<--(5) 返回 HTML + 状态数据-----|                               |
  |                               |                               |
  |---(6) 浏览器显示内容           |                               |
  |                               |                               |
  |---(7) 下载 JS 文件------------>|                               |
  |<--(8) 返回 JS-----------------|                               |
  |                               |                               |
  |---(9) Hydration（激活页面）    |                               |
  |     绑定事件，添加交互性         |                               |
```

---

## Vue SSR 实现

### 📦 手写一个简单的 Vue SSR

#### 1. 项目结构

```
vue-ssr-demo/
├─ src/
│  ├─ App.vue          # 根组件
│  ├─ entry-client.js  # 客户端入口
│  └─ entry-server.js  # 服务端入口
├─ server.js           # Node.js 服务器
└─ package.json
```

---

#### 2. 根组件 (`App.vue`)

```vue
<template>
  <div id="app">
    <h1>{{ title }}</h1>
    <p>当前时间：{{ time }}</p>
    <button @click="updateTime">更新时间</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('Vue SSR Demo')
const time = ref(new Date().toLocaleTimeString())

const updateTime = () => {
  time.value = new Date().toLocaleTimeString()
}
</script>
```

---

#### 3. 服务端入口 (`entry-server.js`)

```javascript
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'

export async function render() {
  // 创建 Vue 应用实例
  const app = createSSRApp(App)
  
  // 渲染成 HTML 字符串
  const html = await renderToString(app)
  
  return { html }
}
```

---

#### 4. 客户端入口 (`entry-client.js`)

```javascript
import { createSSRApp } from 'vue'
import App from './App.vue'

// 创建应用实例
const app = createSSRApp(App)

// Hydration：激活服务端渲染的 HTML
app.mount('#app')
```

---

#### 5. Node.js 服务器 (`server.js`)

```javascript
import express from 'express'
import { render } from './src/entry-server.js'

const app = express()

// 静态资源
app.use('/dist', express.static('dist'))

// SSR 路由
app.get('*', async (req, res) => {
  try {
    // 服务端渲染
    const { html } = await render()
    
    // 返回完整的 HTML
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Vue SSR</title>
        </head>
        <body>
          <div id="app">${html}</div>
          <script src="/dist/client.js"></script>
        </body>
      </html>
    `)
  } catch (error) {
    res.status(500).send('Server Error')
  }
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
```

---

### ⚠️ SSR 开发注意事项

#### 1. 避免在服务端使用浏览器 API

```javascript
// ❌ 错误：服务端没有 window 对象
const width = window.innerWidth

// ✅ 正确：判断环境
if (typeof window !== 'undefined') {
  const width = window.innerWidth
}
```

---

#### 2. 生命周期限制

```javascript
// ⚠️ 服务端只会执行这些生命周期
setup()
onServerPrefetch()

// ❌ 服务端不会执行
onMounted()      // 只在客户端执行
onBeforeUnmount()
onUnmounted()
```

---

#### 3. 数据预取

```vue
<script setup>
import { ref, onServerPrefetch } from 'vue'

const data = ref(null)

// 服务端预取数据
onServerPrefetch(async () => {
  data.value = await fetchData()
})

// 客户端也需要获取数据
if (typeof window !== 'undefined' && !data.value) {
  data.value = await fetchData()
}
</script>
```

---

## Nuxt.js 框架

### 🎯 什么是 Nuxt.js

**Nuxt.js** 是基于 Vue3 的 SSR 框架，提供开箱即用的 SSR 能力。

### 🚀 快速开始

```bash
# 创建 Nuxt 项目
npx nuxi@latest init my-nuxt-app

cd my-nuxt-app
npm install
npm run dev
```

---

### 📁 Nuxt 项目结构

```
my-nuxt-app/
├─ pages/              # 页面目录（自动生成路由）
│  ├─ index.vue       # 首页 → /
│  ├─ about.vue       # 关于页 → /about
│  └─ blog/
│     └─ [id].vue    # 动态路由 → /blog/:id
│
├─ components/         # 组件目录（自动导入）
├─ composables/        # 组合式函数（自动导入）
├─ layouts/            # 布局组件
├─ public/             # 静态资源
├─ server/             # 服务端 API
├─ app.vue             # 根组件
└─ nuxt.config.ts      # 配置文件
```

---

### 🎨 Nuxt 页面示例

```vue
<!-- pages/blog/[id].vue -->
<template>
  <div>
    <h1>{{ article.title }}</h1>
    <p>{{ article.content }}</p>
  </div>
</template>

<script setup>
// 定义路由参数
const route = useRoute()

// 服务端数据预取（自动 SSR）
const { data: article } = await useFetch(`/api/article/${route.params.id}`)
</script>
```

✨ **Nuxt 会自动处理 SSR，无需额外配置！**

---

### 🔧 Nuxt 核心功能

#### 1. 自动路由

文件系统即路由，无需手动配置：

```
pages/index.vue        → /
pages/about.vue        → /about
pages/blog/[id].vue    → /blog/:id
pages/user/[id].vue    → /user/:id
```

---

#### 2. 自动导入

组件、组合式函数、工具函数自动导入，无需 `import`：

```vue
<template>
  <!-- 自动导入 components/UserCard.vue -->
  <UserCard :user="user" />
</template>

<script setup>
// 自动导入 composables/useUser.js
const user = useUser()

// 自动导入 Vue API
const count = ref(0)
</script>
```

---

#### 3. 数据获取

```vue
<script setup>
// useFetch：自动处理 SSR + 客户端缓存
const { data, pending, error } = await useFetch('/api/users')

// useAsyncData：更灵活的数据获取
const { data: user } = await useAsyncData('user', () => {
  return $fetch('/api/user')
})
</script>
```

---

#### 4. SEO 优化

```vue
<script setup>
// 设置页面元信息
useHead({
  title: '我的博客',
  meta: [
    { name: 'description', content: '这是一个博客网站' },
    { property: 'og:title', content: '我的博客' }
  ]
})

// 或者使用更简洁的 API
useSeoMeta({
  title: '我的博客',
  description: '这是一个博客网站',
  ogTitle: '我的博客',
  ogImage: '/og-image.jpg'
})
</script>
```

---

### ⚙️ Nuxt 配置 (`nuxt.config.ts`)

```typescript
export default defineNuxtConfig({
  // 开发工具
  devtools: { enabled: true },
  
  // SSR 配置
  ssr: true,  // 启用 SSR（默认）
  
  // 路由配置
  routeRules: {
    '/': { prerender: true },           // 首页预渲染（SSG）
    '/blog/**': { swr: 3600 },          // 博客页面缓存 1 小时
    '/api/**': { cors: true },          // API 跨域
    '/admin/**': { ssr: false },        // 后台关闭 SSR（CSR）
  },
  
  // 模块
  modules: [
    '@nuxtjs/tailwindcss',  // TailwindCSS
    '@pinia/nuxt',          // Pinia 状态管理
  ],
  
  // 运行时配置
  runtimeConfig: {
    // 服务端环境变量
    apiSecret: process.env.API_SECRET,
    
    // 公开配置（客户端可访问）
    public: {
      apiBase: process.env.API_BASE_URL
    }
  }
})
```

---

## SSR 性能优化

### 1. 组件级缓存

```vue
<!-- 缓存该组件 1 小时 -->
<template>
  <NuxtCache :max-age="3600">
    <ExpensiveComponent />
  </NuxtCache>
</template>
```

---

### 2. 页面缓存

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/blog/**': {
      swr: 3600,        // Stale-While-Revalidate 缓存
      cache: {
        maxAge: 3600    // 缓存 1 小时
      }
    }
  }
})
```

---

### 3. 懒加载组件

```vue
<script setup>
// 客户端懒加载（不在服务端渲染）
const LazyComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)
</script>

<template>
  <ClientOnly>
    <LazyComponent />
  </ClientOnly>
</template>
```

---

### 4. 减少服务端计算

```vue
<script setup>
// ❌ 每次 SSR 都计算
const result = expensiveCalculation()

// ✅ 只在客户端计算
const result = ref(null)
onMounted(() => {
  result.value = expensiveCalculation()
})
</script>
```

---

## 实战案例

### 📝 案例：博客网站

#### 需求
- 首页展示文章列表
- 文章详情页
- SEO 友好
- 首屏快速加载

---

#### 实现方案

```vue
<!-- pages/index.vue -->
<template>
  <div class="blog-home">
    <h1>我的博客</h1>
    <ArticleList :articles="articles" />
  </div>
</template>

<script setup>
// SEO 优化
useSeoMeta({
  title: '我的博客首页',
  description: '分享前端技术文章',
  ogImage: '/og-home.jpg'
})

// 服务端获取文章列表
const { data: articles } = await useFetch('/api/articles', {
  transform: (data) => data.slice(0, 10)  // 只显示前 10 篇
})
</script>
```

---

```vue
<!-- pages/article/[id].vue -->
<template>
  <article>
    <h1>{{ article.title }}</h1>
    <div v-html="article.content"></div>
  </article>
</template>

<script setup>
const route = useRoute()

// 服务端获取文章详情
const { data: article } = await useFetch(`/api/article/${route.params.id}`)

// 动态 SEO
useSeoMeta({
  title: article.value.title,
  description: article.value.summary,
  ogTitle: article.value.title,
  ogImage: article.value.cover
})
</script>
```

---

## 🎯 总结

### ✅ SSR 适用场景

1. **官网、博客** - 需要良好的 SEO
2. **电商首页** - 首屏速度要求高
3. **新闻网站** - 内容为主，需要快速展示
4. **社交媒体分享** - 需要 Open Graph 预览

### ❌ SSR 不适用场景

1. **后台管理系统** - 不需要 SEO，服务端压力大
2. **工具类应用** - 交互为主，CSR 更合适
3. **实时应用** - WebSocket 为主，SSR 意义不大

---

## 📚 学习资源

### 官方文档
- [Vue SSR 指南](https://vuejs.org/guide/scaling-up/ssr.html)
- [Nuxt.js 官方文档](https://nuxt.com/)
- [Next.js 文档](https://nextjs.org/) (React SSR)

### 视频教程
- 🎬 Nuxt.js 从入门到实战
- 🎬 Vue SSR 原理与实践

### 实战项目
- 🔨 用 Nuxt 搭建个人博客
- 🔨 用 Nuxt 搭建企业官网

---

## 🚀 下一步学习

- [ ] 实现一个简单的 Vue SSR Demo
- [ ] 学习 Nuxt.js 框架
- [ ] 对比 SSG (静态站点生成)
- [ ] 学习混合渲染策略

---

**开始你的 SSR 学习之旅吧！** 🎉

