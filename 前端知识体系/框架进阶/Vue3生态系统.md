# 🌟 Vue3 生态系统完全指南

> Vue Router、Pinia、Composition API、VueUse - 构建现代化 Vue 应用

---

## 📚 目录

1. [Vue Router 4](#vue-router-4)
2. [Pinia 状态管理](#pinia-状态管理)
3. [Composition API 最佳实践](#composition-api-最佳实践)
4. [VueUse 工具库](#vueuse-工具库)
5. [组件库](#组件库)

---

## Vue Router 4

### 🚀 快速开始

```bash
npm install vue-router@4
```

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // 懒加载
    component: () => import('@/views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

---

### 🎯 核心功能

#### 1. 动态路由

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    props: true  // 将路由参数作为 props 传递
  }
]
```

```vue
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
console.log(route.params.id)  // 获取参数

// 或者通过 props 接收
defineProps(['id'])
</script>
```

---

#### 2. 嵌套路由

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        path: '',  // 默认子路由
        component: UserHome
      },
      {
        path: 'profile',  // /user/:id/profile
        component: UserProfile
      },
      {
        path: 'posts',  // /user/:id/posts
        component: UserPosts
      }
    ]
  }
]
```

```vue
<!-- User.vue -->
<template>
  <div>
    <h1>用户页面</h1>
    <!-- 子路由渲染位置 -->
    <router-view />
  </div>
</template>
```

---

#### 3. 编程式导航

```vue
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到路由
const goToAbout = () => {
  router.push('/about')
}

// 带参数跳转
const goToUser = (id) => {
  router.push({ name: 'User', params: { id } })
}

// 带查询参数
const search = () => {
  router.push({ path: '/search', query: { q: 'vue' } })
}

// 替换当前路由（不会留下历史记录）
const replace = () => {
  router.replace('/home')
}

// 前进/后退
const go = () => {
  router.go(-1)  // 后退一步
  router.go(1)   // 前进一步
}
</script>
```

---

#### 4. 路由守卫

```javascript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要登录
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/login')
  } else {
    next()
  }
})

// 全局后置守卫
router.afterEach((to, from) => {
  // 设置页面标题
  document.title = to.meta.title || '默认标题'
})
```

```javascript
// 路由独享守卫
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      if (isAdmin()) {
        next()
      } else {
        next('/403')
      }
    }
  }
]
```

```vue
<!-- 组件内守卫 -->
<script setup>
import { onBeforeRouteEnter, onBeforeRouteLeave } from 'vue-router'

// 进入路由前
onBeforeRouteEnter((to, from) => {
  console.log('进入组件')
})

// 离开路由前
onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('确定要离开吗？')
  if (!answer) return false
})
</script>
```

---

### 🎨 路由元信息

```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: {
      requiresAuth: true,
      title: '管理后台',
      icon: 'admin',
      roles: ['admin']
    }
  }
]
```

```vue
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
console.log(route.meta.title)
</script>
```

---

## Pinia 状态管理

### 🚀 为什么选择 Pinia

```
Pinia vs Vuex 4:

✅ 更简单的 API（无需 mutations）
✅ TypeScript 支持更好
✅ 模块化更容易
✅ 开发工具支持更好
✅ Vue 3 官方推荐
```

---

### 📦 快速开始

```bash
npm install pinia
```

```javascript
// main.js
import { createPinia } from 'pinia'

const pinia = createPinia()
app.use(pinia)
```

---

### 🎯 定义 Store

```javascript
// stores/counter.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Option Store 写法
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Counter'
  }),
  
  getters: {
    doubleCount: (state) => state.count * 2,
    
    doubleCountPlusOne() {
      return this.doubleCount + 1
    }
  },
  
  actions: {
    increment() {
      this.count++
    },
    
    async fetchCount() {
      const response = await fetch('/api/count')
      this.count = await response.json()
    }
  }
})

// Setup Store 写法（推荐）
export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)
  const name = ref('Counter')
  
  // getters
  const doubleCount = computed(() => count.value * 2)
  
  // actions
  function increment() {
    count.value++
  }
  
  async function fetchCount() {
    const response = await fetch('/api/count')
    count.value = await response.json()
  }
  
  return {
    count,
    name,
    doubleCount,
    increment,
    fetchCount
  }
})
```

---

### 🎨 使用 Store

```vue
<template>
  <div>
    <p>Count: {{ store.count }}</p>
    <p>Double: {{ store.doubleCount }}</p>
    <button @click="store.increment">+1</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const store = useCounterStore()

// ✅ 保持响应式的解构
const { count, doubleCount } = storeToRefs(store)

// ❌ 这样会失去响应式
// const { count } = store
</script>
```

---

### 🔄 Store 组合

```javascript
// stores/user.js
export const useUserStore = defineStore('user', () => {
  const name = ref('张三')
  const isAdmin = ref(false)
  
  return { name, isAdmin }
})

// stores/posts.js
export const usePostsStore = defineStore('posts', () => {
  const userStore = useUserStore()  // 使用其他 store
  
  const posts = ref([])
  
  const userPosts = computed(() => {
    return posts.value.filter(post => 
      post.author === userStore.name
    )
  })
  
  return { posts, userPosts }
})
```

---

### 💾 持久化

```bash
npm install pinia-plugin-persistedstate
```

```javascript
// main.js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
```

```javascript
// stores/user.js
export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref(null)
  
  return { token, userInfo }
}, {
  persist: true  // 自动持久化到 localStorage
})

// 自定义持久化
export const useUserStore = defineStore('user', () => {
  // ...
}, {
  persist: {
    key: 'my-user',
    storage: sessionStorage,
    paths: ['token']  // 只持久化 token
  }
})
```

---

## Composition API 最佳实践

### 🎯 组合式函数 (Composables)

#### 1. 封装可复用逻辑

```javascript
// composables/useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }
  
  onMounted(() => {
    window.addEventListener('mousemove', update)
  })
  
  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })
  
  return { x, y }
}
```

```vue
<script setup>
import { useMouse } from '@/composables/useMouse'

const { x, y } = useMouse()
</script>

<template>
  <div>鼠标位置：{{ x }}, {{ y }}</div>
</template>
```

---

#### 2. 异步数据获取

```javascript
// composables/useFetch.js
import { ref, watch } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(true)
  
  async function fetchData() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url.value)
      data.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  
  // 监听 URL 变化
  watch(url, fetchData, { immediate: true })
  
  return { data, error, loading, refetch: fetchData }
}
```

```vue
<script setup>
import { ref } from 'vue'
import { useFetch } from '@/composables/useFetch'

const userId = ref(1)
const url = computed(() => `/api/user/${userId.value}`)
const { data, error, loading } = useFetch(url)
</script>
```

---

#### 3. 表单处理

```javascript
// composables/useForm.js
import { reactive, computed } from 'vue'

export function useForm(initialValues) {
  const form = reactive({ ...initialValues })
  const errors = reactive({})
  
  function validate(rules) {
    Object.keys(rules).forEach(key => {
      const rule = rules[key]
      const value = form[key]
      
      if (rule.required && !value) {
        errors[key] = '此字段必填'
      } else if (rule.min && value.length < rule.min) {
        errors[key] = `最少 ${rule.min} 个字符`
      } else {
        delete errors[key]
      }
    })
    
    return Object.keys(errors).length === 0
  }
  
  const isValid = computed(() => Object.keys(errors).length === 0)
  
  function reset() {
    Object.assign(form, initialValues)
    Object.keys(errors).forEach(key => delete errors[key])
  }
  
  return {
    form,
    errors,
    isValid,
    validate,
    reset
  }
}
```

---

### 🎨 defineProps 与 defineEmits

```vue
<script setup>
// Props
const props = defineProps({
  title: String,
  count: {
    type: Number,
    default: 0,
    required: true
  }
})

// Emits
const emit = defineEmits(['update', 'delete'])

function handleUpdate() {
  emit('update', props.count + 1)
}

// TypeScript 类型定义
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})
</script>
```

---

## VueUse 工具库

### 🚀 简介

**VueUse** 是最大的 Vue Composition API 工具库，提供 200+ 个实用函数。

```bash
npm install @vueuse/core
```

---

### 🎯 常用功能

#### 1. useLocalStorage

```vue
<script setup>
import { useLocalStorage } from '@vueuse/core'

// 自动同步到 localStorage
const token = useLocalStorage('token', '')
const user = useLocalStorage('user', null)

// 使用就像普通 ref
token.value = 'abc123'  // 自动保存
</script>
```

---

#### 2. useDark

```vue
<script setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <button @click="toggleDark()">
    切换{{ isDark ? '浅色' : '深色' }}模式
  </button>
</template>
```

---

#### 3. useIntersectionObserver

```vue
<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const target = ref(null)
const isVisible = ref(false)

useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    isVisible.value = isIntersecting
  }
)
</script>

<template>
  <div ref="target">
    {{ isVisible ? '可见' : '不可见' }}
  </div>
</template>
```

---

#### 4. useDebounce / useThrottle

```vue
<script setup>
import { ref } from 'vue'
import { useDebounceFn, useThrottleFn } from '@vueuse/core'

const input = ref('')

// 防抖
const debouncedSearch = useDebounceFn(() => {
  console.log('搜索:', input.value)
}, 500)

// 节流
const throttledScroll = useThrottleFn(() => {
  console.log('滚动')
}, 1000)
</script>
```

---

#### 5. useClipboard

```vue
<script setup>
import { useClipboard } from '@vueuse/core'

const { text, copy, copied, isSupported } = useClipboard()

const copyText = () => {
  copy('Hello VueUse!')
}
</script>

<template>
  <button @click="copyText">
    {{ copied ? '已复制' : '复制' }}
  </button>
</template>
```

---

## 组件库

### 🎨 流行组件库

| 组件库 | 特点 | 适用场景 |
|:---:|:---|:---|
| **Element Plus** | 功能全面，企业级 | 后台管理系统 |
| **Ant Design Vue** | 蚂蚁金服出品 | 企业级应用 |
| **Naive UI** | 性能好，TypeScript | 现代化应用 |
| **Vuetify** | Material Design | Material 风格应用 |
| **Vant** | 移动端 | 移动 H5 应用 |
| **Arco Design** | 字节跳动出品 | 企业级应用 |

---

### 📦 Element Plus 示例

```bash
npm install element-plus
```

#### 自动导入（推荐）

```javascript
// vite.config.js
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default {
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ]
}
```

```vue
<template>
  <!-- 自动导入，无需手动 import -->
  <el-button type="primary">按钮</el-button>
  <el-input v-model="input" placeholder="请输入" />
</template>
```

---

## 🎯 项目架构示例

```
src/
├── assets/              # 静态资源
├── components/          # 公共组件
│   ├── common/         # 通用组件
│   └── business/       # 业务组件
├── composables/         # 组合式函数
│   ├── useMouse.js
│   ├── useFetch.js
│   └── useAuth.js
├── stores/              # Pinia stores
│   ├── user.js
│   ├── app.js
│   └── index.js
├── router/              # 路由配置
│   ├── index.js
│   └── routes.js
├── views/               # 页面组件
│   ├── Home.vue
│   └── About.vue
├── utils/               # 工具函数
├── api/                 # API 接口
└── main.js
```

---

## 📚 学习资源

- 📖 [Vue Router 文档](https://router.vuejs.org/zh/)
- 📖 [Pinia 文档](https://pinia.vuejs.org/zh/)
- 📖 [VueUse 文档](https://vueuse.org/)
- 📖 [Element Plus 文档](https://element-plus.org/zh-CN/)

---

## ✅ 学习检查清单

- [ ] 掌握 Vue Router 路由配置
- [ ] 理解路由守卫
- [ ] 掌握 Pinia 状态管理
- [ ] 会编写组合式函数
- [ ] 熟悉 VueUse 常用功能
- [ ] 会使用组件库

---

**构建强大的 Vue3 应用！** 🚀

