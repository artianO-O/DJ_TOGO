# DevBox React 学习笔记

> 跟着代码一步步学习 React 核心概念

---

## 📚 学习路线

```
1. 项目结构 → 了解整体布局
2. 入口文件 → React 应用如何启动
3. 路由配置 → 页面如何组织
4. 布局组件 → 复用布局的技巧
5. 状态管理 → Zustand 的使用
6. 工具页面 → 实际功能实现
7. 自定义 Hooks → 逻辑复用
```

---

## 🔰 第一步：理解项目结构

### 目录说明

```
devbox/
├── src/
│   ├── main.tsx           # 🚀 入口文件（React 从这里启动）
│   ├── App.tsx            # 📍 根组件（路由配置）
│   │
│   ├── components/        # 📦 通用组件
│   │   └── Layout/        # 布局组件（侧边栏、头部）
│   │
│   ├── pages/             # 📄 页面组件
│   │   ├── HomePage.tsx   # 首页
│   │   └── tools/         # 各种工具页面
│   │
│   ├── stores/            # 🗄️ 状态管理（Zustand）
│   ├── hooks/             # 🪝 自定义 Hooks
│   ├── utils/             # 🔧 工具函数
│   ├── types/             # 📝 TypeScript 类型
│   └── styles/            # 🎨 全局样式
│
├── package.json           # 依赖配置
├── vite.config.ts         # Vite 构建配置
├── tailwind.config.js     # Tailwind CSS 配置
└── tsconfig.json          # TypeScript 配置
```

---

## 🚀 第二步：入口文件 main.tsx

这是 React 应用的**起点**，理解它非常重要！

```tsx
// main.tsx 代码解析
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

### 逐行解释：

| 代码 | 作用 |
|-----|------|
| `ReactDOM.createRoot()` | 创建 React 根节点 |
| `document.getElementById('root')` | 找到 HTML 中的 `<div id="root">` |
| `<React.StrictMode>` | 开发模式严格检查（生产环境无影响） |
| `<BrowserRouter>` | 启用浏览器路由（URL 导航） |
| `<App />` | 渲染根组件 |

### 🎯 关键概念：组件嵌套

```
React.StrictMode
  └── BrowserRouter      ← 提供路由能力
       └── App           ← 你的应用
            └── Layout
                 └── 各种页面
```

---

## 📍 第三步：路由配置 App.tsx

React Router v6 的核心用法：

```tsx
// App.tsx
import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import JsonFormatter from "./pages/tools/JsonFormatter"
// ... 其他导入

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="json" element={<JsonFormatter />} />
        <Route path="timestamp" element={<TimestampConverter />} />
        {/* 更多路由... */}
      </Route>
    </Routes>
  )
}
```

### 路由结构解析：

```
/              → Layout + HomePage
/json          → Layout + JsonFormatter
/timestamp     → Layout + TimestampConverter
/base64        → Layout + Base64Converter
```

### 🎯 关键概念：嵌套路由

```tsx
<Route path="/" element={<Layout />}>    // 父路由
  <Route index element={<HomePage />} /> // 子路由
  <Route path="json" element={...} />    // 子路由
</Route>
```

- **父路由** `<Layout />` 提供共享布局（侧边栏、头部）
- **子路由** 渲染到 Layout 的 `<Outlet />` 位置

---

## 🏗️ 第四步：布局组件 Layout

### Layout/index.tsx

```tsx
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* 侧边栏 - 固定在左侧 */}
      <Sidebar />
      
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 头部 */}
        <Header />
        
        {/* 内容区域 - 子路由渲染到这里！ */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />  {/* ⬅️ 关键！子路由组件渲染位置 */}
        </main>
      </div>
    </div>
  )
}
```

### 🎯 关键概念：`<Outlet />`

`<Outlet />` 是 React Router 的**插槽**，子路由组件会渲染到这里：

```
访问 /json 时：
┌─────────────────────────────────────────┐
│ Layout                                  │
│ ┌──────────┬───────────────────────────┐│
│ │ Sidebar  │ Header                    ││
│ │          ├───────────────────────────┤│
│ │          │ <Outlet />                ││
│ │          │   ↓                       ││
│ │          │ JsonFormatter 渲染到这里  ││
│ └──────────┴───────────────────────────┘│
└─────────────────────────────────────────┘
```

---

## 🗄️ 第五步：状态管理 Zustand

Zustand 是一个**超轻量**的状态管理库，比 Redux 简单 10 倍！

### stores/themeStore.ts

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 定义状态类型
interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
}

// 创建 store
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // 状态
      isDark: false,
      
      // 方法
      toggleTheme: () => {
        set((state) => {
          const newIsDark = !state.isDark
          // 更新 DOM class
          if (newIsDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { isDark: newIsDark }
        })
      },
      
      setTheme: (isDark: boolean) => {
        // ...
      },
    }),
    {
      name: 'devbox-theme', // localStorage 的 key
    }
  )
)
```

### 在组件中使用：

```tsx
function Header() {
  // 从 store 中取状态和方法
  const { isDark, toggleTheme } = useThemeStore()
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? <Sun /> : <Moon />}
    </button>
  )
}
```

### 🎯 Zustand vs Vue 的 Pinia

| Zustand | Pinia | 说明 |
|---------|-------|------|
| `create()` | `defineStore()` | 创建 store |
| `set()` | `this.xxx = yyy` | 修改状态 |
| `useXxxStore()` | `useXxxStore()` | 使用 store |
| `persist` | `persist` | 持久化 |

---

## 📄 第六步：工具页面分析

以 **JSON 格式化** 为例，学习 React 的核心模式：

### pages/tools/JsonFormatter.tsx

```tsx
import { useState, useCallback } from 'react'

export default function JsonFormatter() {
  // 1️⃣ 状态定义
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  
  // 2️⃣ 处理函数（用 useCallback 优化）
  const formatJson = useCallback(() => {
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError('')
    } catch (e) {
      setError((e as Error).message)
    }
  }, [input])
  
  // 3️⃣ 渲染 JSX
  return (
    <div>
      {/* 输入框 - 受控组件 */}
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onBlur={formatJson}
      />
      
      {/* 条件渲染 */}
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <textarea value={output} readOnly />
      )}
      
      {/* 按钮 */}
      <button onClick={formatJson}>格式化</button>
    </div>
  )
}
```

### 🎯 关键概念对照

| React | Vue3 | 说明 |
|-------|------|------|
| `useState` | `ref` | 响应式状态 |
| `useCallback` | 无（自动优化） | 缓存函数 |
| `value + onChange` | `v-model` | 双向绑定 |
| `{condition && <X/>}` | `v-if` | 条件渲染 |
| `{list.map(x => <X/>)}` | `v-for` | 列表渲染 |

---

## 🪝 第七步：自定义 Hooks

Hooks 是 React 逻辑复用的核心方式（类似 Vue 的 composables）

### hooks/useCopy.ts

```tsx
import { useState, useCallback } from 'react'

export function useCopy(timeout = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), timeout)
  }, [timeout])

  return { copied, copy }
}
```

### 使用自定义 Hook：

```tsx
function MyComponent() {
  const { copied, copy } = useCopy()
  
  return (
    <button onClick={() => copy('Hello')}>
      {copied ? '已复制 ✓' : '复制'}
    </button>
  )
}
```

### 🎯 Hook vs Vue Composable

```tsx
// React Hook
function useCopy() {
  const [copied, setCopied] = useState(false)
  const copy = async (text) => { ... }
  return { copied, copy }
}

// Vue Composable
function useCopy() {
  const copied = ref(false)
  const copy = async (text) => { ... }
  return { copied, copy }
}
```

几乎一样！核心区别：
- React 需要遵循 **Hooks 规则**（只能在顶层调用）
- Vue 的 `ref` 返回的是对象，要用 `.value`

---

## ✅ 学习检查清单

- [ ] 理解 `main.tsx` 启动流程
- [ ] 理解 React Router 嵌套路由
- [ ] 理解 `<Outlet />` 的作用
- [ ] 能使用 Zustand 创建 store
- [ ] 理解 `useState` 和 `useCallback`
- [ ] 能写自定义 Hook

---

## 🎯 下一步练习

1. **修改主题色**：在 `tailwind.config.js` 中修改 `brand` 颜色
2. **添加新工具**：参考现有工具，自己实现一个
3. **添加收藏功能**：用 Zustand 存储用户收藏的工具

---

**继续加油！有问题随时问我 🚀**

