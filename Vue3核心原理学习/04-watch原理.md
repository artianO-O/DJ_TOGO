# watch 侦听器原理

> 深入理解 watch 和 watchEffect 的工作原理

## 🤔 watch 是什么？

**watch = 监听数据变化，执行回调**

```javascript
import { ref, watch } from 'vue'

const count = ref(0)

// 监听 count 的变化
watch(count, (newValue, oldValue) => {
  console.log(`count 从 ${oldValue} 变成了 ${newValue}`)
})

count.value = 1  // count 从 0 变成了 1
count.value = 2  // count 从 1 变成了 2
```

---

## 🎯 watch vs computed vs watchEffect

| 特性 | computed | watch | watchEffect |
|-----|----------|-------|-------------|
| 用途 | 计算派生值 | 监听变化执行副作用 | 自动追踪依赖执行副作用 |
| 返回值 | 有（计算结果） | 无 | 无 |
| 缓存 | 有 | 无 | 无 |
| 立即执行 | 访问时执行 | 默认不立即执行 | 立即执行 |
| 获取旧值 | 无 | 有 | 无 |

### 什么时候用什么？

```javascript
// computed：需要计算一个值
const fullName = computed(() => firstName.value + lastName.value)

// watch：需要在数据变化时做事情，需要旧值
watch(userId, async (newId, oldId) => {
  console.log(`用户从 ${oldId} 切换到 ${newId}`)
  const user = await fetchUser(newId)
  userData.value = user
})

// watchEffect：需要在数据变化时做事情，不关心旧值
watchEffect(() => {
  // 自动追踪内部用到的响应式数据
  console.log(`当前用户ID: ${userId.value}`)
  document.title = `用户 ${userId.value}`
})
```

---

## 💡 watch 的基本用法

### 1. 监听 ref

```javascript
const count = ref(0)

watch(count, (newVal, oldVal) => {
  console.log(newVal, oldVal)
})
```

### 2. 监听 reactive 的属性

```javascript
const state = reactive({ count: 0 })

// 需要用函数返回要监听的值
watch(
  () => state.count,
  (newVal, oldVal) => {
    console.log(newVal, oldVal)
  }
)
```

### 3. 监听多个数据源

```javascript
const firstName = ref('张')
const lastName = ref('三')

watch(
  [firstName, lastName],
  ([newFirst, newLast], [oldFirst, oldLast]) => {
    console.log(`名字从 ${oldFirst}${oldLast} 变成 ${newFirst}${newLast}`)
  }
)
```

### 4. 立即执行

```javascript
watch(count, (newVal) => {
  console.log('count:', newVal)
}, { immediate: true })  // 创建时立即执行一次
```

### 5. 深度监听

```javascript
const obj = ref({ a: { b: { c: 1 } } })

watch(
  obj,
  (newVal) => {
    console.log('obj 变了')
  },
  { deep: true }  // 深度监听嵌套对象
)

obj.value.a.b.c = 2  // 触发回调
```

---

## 🔍 watch 的实现原理

### 核心思路

1. 把监听的数据源包装成 getter 函数
2. 创建一个 effect 来追踪依赖
3. 依赖变化时，调用回调函数

### 简化实现

```javascript
function watch(source, callback, options = {}) {
  // 1. 统一处理数据源，转成 getter 函数
  let getter
  
  if (typeof source === 'function') {
    // watch(() => state.count, callback)
    getter = source
  } else if (isRef(source)) {
    // watch(count, callback)
    getter = () => source.value
  } else if (isReactive(source)) {
    // watch(state, callback) - 需要深度遍历
    getter = () => traverse(source)
  }
  
  // 2. 保存旧值
  let oldValue
  
  // 3. 定义调度器（依赖变化时执行）
  const job = () => {
    // 获取新值
    const newValue = effectFn()
    // 调用回调
    callback(newValue, oldValue)
    // 更新旧值
    oldValue = newValue
  }
  
  // 4. 创建 effect
  const effectFn = effect(getter, {
    lazy: true,  // 不立即执行
    scheduler: job  // 依赖变化时执行 job
  })
  
  // 5. 处理 immediate 选项
  if (options.immediate) {
    job()  // 立即执行一次
  } else {
    oldValue = effectFn()  // 只获取旧值，不执行回调
  }
}

// 深度遍历函数（用于深度监听）
function traverse(value, seen = new Set()) {
  // 基本类型或已访问过，直接返回
  if (typeof value !== 'object' || value === null || seen.has(value)) {
    return value
  }
  
  seen.add(value)
  
  // 遍历对象的所有属性（触发 get，收集依赖）
  for (const key in value) {
    traverse(value[key], seen)
  }
  
  return value
}
```

---

## 🔄 watch 工作流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                      watch 工作流程                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 创建 watch                                                  │
│  ┌─────────────────────────────────┐                           │
│  │ watch(source, callback)         │                           │
│  │   ↓                             │                           │
│  │ 将 source 转成 getter 函数       │                           │
│  │   ↓                             │                           │
│  │ 创建 effect(getter, scheduler)  │                           │
│  └─────────────────────────────────┘                           │
│                                                                 │
│  2. 首次执行 effect                                             │
│  ┌─────────────────────────────────┐                           │
│  │ effectFn()                      │                           │
│  │   ↓                             │                           │
│  │ 执行 getter，收集依赖            │                           │
│  │   ↓                             │                           │
│  │ oldValue = 返回值               │                           │
│  └─────────────────────────────────┘                           │
│                                                                 │
│  3. 数据变化                                                    │
│  ┌─────────────────────────────────┐                           │
│  │ source 的值改变                 │                           │
│  │   ↓                             │                           │
│  │ trigger 触发更新                │                           │
│  │   ↓                             │                           │
│  │ 执行 scheduler (不是直接执行 effect)                         │
│  └─────────────────────────────────┘                           │
│                                                                 │
│  4. scheduler 执行                                              │
│  ┌─────────────────────────────────┐                           │
│  │ newValue = effectFn()           │ // 获取新值                │
│  │   ↓                             │                           │
│  │ callback(newValue, oldValue)    │ // 执行用户回调            │
│  │   ↓                             │                           │
│  │ oldValue = newValue             │ // 更新旧值                │
│  └─────────────────────────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 watchEffect 的实现

`watchEffect` 比 `watch` 更简单：不需要指定监听源，自动追踪内部依赖。

```javascript
function watchEffect(fn) {
  effect(fn, {
    scheduler() {
      // 依赖变化时，重新执行 fn
      fn()
    }
  })
}

// 使用
watchEffect(() => {
  // 自动追踪 count 和 name
  console.log(count.value, name.value)
})
```

### watch vs watchEffect 对比

```javascript
const userId = ref(1)
const userData = ref(null)

// watch 方式
watch(userId, async (newId) => {
  userData.value = await fetchUser(newId)
})

// watchEffect 方式
watchEffect(async () => {
  userData.value = await fetchUser(userId.value)
})
```

**区别**：
- `watch`：明确指定监听哪个数据
- `watchEffect`：自动追踪内部用到的数据

---

## 🛠️ 高级用法

### 1. 停止监听

```javascript
const stop = watch(count, (newVal) => {
  console.log(newVal)
})

// 停止监听
stop()

count.value = 100  // 不会触发回调
```

### 2. 清理副作用

```javascript
watch(userId, async (newId, oldId, onCleanup) => {
  let cancelled = false
  
  // 注册清理函数
  onCleanup(() => {
    cancelled = true
  })
  
  const data = await fetchUser(newId)
  
  // 如果在请求过程中 userId 又变了，cancelled 会变成 true
  if (!cancelled) {
    userData.value = data
  }
})
```

这解决了**竞态问题**：
```
userId = 1 → 发起请求A（耗时3秒）
userId = 2 → 发起请求B（耗时1秒）

请求B 先返回 → userData = B的数据
请求A 后返回 → userData = A的数据（错了！）

使用 onCleanup：
userId = 2 时，请求A的 cancelled = true
请求A 返回后不会更新 userData
```

### 3. flush 时机

```javascript
watch(source, callback, {
  flush: 'pre'   // 默认，组件更新前执行
  // flush: 'post'  // 组件更新后执行
  // flush: 'sync'  // 同步执行（不推荐）
})
```

---

## 📝 常见使用场景

### 1. 监听路由变化

```javascript
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.params.id,
  async (newId) => {
    const data = await fetchData(newId)
    // ...
  },
  { immediate: true }
)
```

### 2. 防抖搜索

```javascript
import { ref, watch } from 'vue'
import { debounce } from 'lodash-es'

const searchQuery = ref('')
const searchResults = ref([])

// 防抖搜索
watch(searchQuery, debounce(async (query) => {
  if (query) {
    searchResults.value = await search(query)
  } else {
    searchResults.value = []
  }
}, 300))
```

### 3. 本地存储同步

```javascript
const settings = ref({
  theme: 'dark',
  language: 'zh'
})

// 监听变化，同步到 localStorage
watch(
  settings,
  (newSettings) => {
    localStorage.setItem('settings', JSON.stringify(newSettings))
  },
  { deep: true }
)
```

---

## ⚠️ 注意事项

### 1. 避免无限循环

```javascript
// ❌ 危险：在回调中修改监听的数据
watch(count, (newVal) => {
  count.value = newVal + 1  // 无限循环！
})
```

### 2. 监听 reactive 对象要注意

```javascript
const state = reactive({ count: 0 })

// ❌ 这样监听不到 count 的变化
watch(state.count, (newVal) => { /* ... */ })

// ✅ 正确：用函数返回
watch(() => state.count, (newVal) => { /* ... */ })
```

### 3. 深度监听的性能

```javascript
// 深度监听大对象可能有性能问题
watch(bigObject, callback, { deep: true })

// 如果只关心特定属性，精确监听更好
watch(() => bigObject.specificProp, callback)
```

---

## 🎓 总结

| 特性 | watch | watchEffect |
|-----|-------|-------------|
| 指定监听源 | ✅ 需要 | ❌ 自动追踪 |
| 获取旧值 | ✅ 有 | ❌ 无 |
| 立即执行 | 需要配置 `immediate` | 默认立即 |
| 精确控制 | ✅ 更精确 | 较粗放 |

### 选择指南

- 需要**旧值** → `watch`
- 需要**精确控制**监听什么 → `watch`  
- 只想**响应式地执行副作用** → `watchEffect`
- **初始化时就要执行** → `watchEffect` 或 `watch` + `immediate`

---

## 🚀 下一步

- [05-虚拟DOM与Diff算法](./05-虚拟DOM与Diff.md)



