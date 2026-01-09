# Nuxt 3 学习路线图

## 📊 学习进度追踪

### 阶段 1：核心基础 ✅
- [x] 项目初始化与配置
- [x] 基础页面路由 (pages/)
- [x] NuxtLink 导航
- [x] Vue 3 响应式 (ref)

### 阶段 2：布局与组件 🎯 当前
- [ ] Layouts 布局系统
- [ ] Components 自动导入
- [ ] Composables 可复用逻辑
- [ ] 动态路由

### 阶段 3：数据获取
- [ ] useFetch 数据获取
- [ ] useAsyncData
- [ ] Server API (server/api/)
- [ ] useState 状态管理

### 阶段 4：进阶特性
- [ ] SSR 服务端渲染
- [ ] Middleware 中间件
- [ ] Plugins 插件
- [ ] SEO 与 Meta 标签

---

## 🚀 下一步实践任务

### 任务 1：创建布局系统

在 `app/layouts/` 目录下创建默认布局：

```vue
<!-- app/layouts/default.vue -->
<template>
  <div class="layout">
    <header class="header">
      <nav>
        <NuxtLink to="/">首页</NuxtLink>
        <NuxtLink to="/about">关于</NuxtLink>
        <NuxtLink to="/posts">文章</NuxtLink>
      </nav>
    </header>
    
    <main class="main">
      <slot />
    </main>
    
    <footer class="footer">
      © 2025 Nuxt 学习项目
    </footer>
  </div>
</template>
```

### 任务 2：创建可复用组件

```vue
<!-- app/components/BaseCard.vue -->
<template>
  <div class="card">
    <slot name="header" />
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>
```

组件会被自动导入，可以直接在页面中使用 `<BaseCard />`

### 任务 3：创建 Composable

```ts
// app/composables/useCounter.ts
export const useCounter = (initial = 0) => {
  const count = ref(initial)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initial
  
  return { count, increment, decrement, reset }
}
```

使用方式（无需导入）：
```vue
<script setup>
const { count, increment } = useCounter(10)
</script>
```

### 任务 4：动态路由

创建文章列表和详情页：

```
app/pages/
├── posts/
│   ├── index.vue      # /posts - 文章列表
│   └── [id].vue       # /posts/123 - 文章详情
```

### 任务 5：数据获取

```vue
<script setup>
// 使用 useFetch 获取数据
const { data: posts, pending, error } = await useFetch(
  'https://jsonplaceholder.typicode.com/posts?_limit=10'
)
</script>
```

### 任务 6：Server API

创建后端接口：

```ts
// server/api/hello.get.ts
export default defineEventHandler((event) => {
  return {
    message: 'Hello from Nuxt Server!'
  }
})
```

前端调用：
```vue
<script setup>
const { data } = await useFetch('/api/hello')
</script>
```

---

## 📖 推荐学习资源

1. **官方文档**: https://nuxt.com/docs
2. **Nuxt 3 Modules**: https://nuxt.com/modules
3. **VueUse**: https://vueuse.org (可与 Nuxt 配合使用)

---

## 💡 实用技巧

### 自动导入规则

| 目录 | 自动导入 |
|------|----------|
| `components/` | 组件自动注册 |
| `composables/` | 组合函数自动导入 |
| `utils/` | 工具函数自动导入 |
| `server/api/` | API 路由自动注册 |

### 常用 Nuxt 组件

- `<NuxtLink>` - 路由导航
- `<NuxtPage>` - 页面渲染
- `<NuxtLayout>` - 布局包装
- `<ClientOnly>` - 仅客户端渲染
- `<NuxtImg>` - 优化图片 (@nuxt/image)

### 常用 Composables

- `useFetch()` - 数据获取
- `useAsyncData()` - 异步数据
- `useState()` - 状态管理
- `useRoute()` - 当前路由
- `useRouter()` - 路由实例
- `useHead()` - 设置页面 meta
- `useRuntimeConfig()` - 运行时配置


