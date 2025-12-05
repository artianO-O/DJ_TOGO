# ref 与 reactive 的区别

> 搞懂 Vue3 中最常用的两个响应式 API

## 🤔 为什么有两个 API？

Vue3 提供了两种创建响应式数据的方式：
- `reactive()` - 用于对象
- `ref()` - 用于任意值（包括基本类型）

**问题来了**：为什么不统一用一个？

---

## 🎯 先理解问题：Proxy 的局限性

### Proxy 只能代理对象

```javascript
// ✅ Proxy 可以代理对象
const obj = { count: 0 }
const proxy = new Proxy(obj, { /* ... */ })

// ❌ Proxy 不能代理基本类型！
const num = 0
const proxy = new Proxy(num, { /* ... */ })  // 报错！
```

**基本类型**（number, string, boolean）不是对象，没法用 Proxy！

---

## 🎯 ref 的解决方案：包一层

既然基本类型不能代理，那就**把它包成对象**！

```javascript
// ref 的简化实现
function ref(value) {
  return {
    get value() {
      track(this, 'value')  // 收集依赖
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(this, 'value')  // 触发更新
    }
  }
}

// 使用
const count = ref(0)
console.log(count.value)  // 0 （必须用 .value）
count.value = 1           // 修改也要用 .value
```

**关键理解**：
- `ref(0)` 返回的是 `{ value: 0 }` 这样的对象
- 所以你必须用 `.value` 来访问和修改

---

## 🔍 对比 ref 和 reactive

### reactive - 用于对象

```javascript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  name: 'Vue3'
})

// 直接访问，不需要 .value
console.log(state.count)  // 0
state.count = 1           // 直接修改
```

### ref - 用于任意类型

```javascript
import { ref } from 'vue'

// 基本类型
const count = ref(0)
console.log(count.value)  // 0
count.value = 1

// 对象也可以（会自动转成 reactive）
const user = ref({ name: 'Vue3' })
console.log(user.value.name)  // Vue3
```

---

## 📊 什么时候用哪个？

| 场景 | 推荐使用 | 原因 |
|-----|---------|-----|
| 基本类型（number, string, boolean） | `ref` | reactive 不支持 |
| 单个值 | `ref` | 语义更清晰 |
| 对象/数组 | `reactive` 或 `ref` | 都可以 |
| 需要整体替换的对象 | `ref` | reactive 不能整体替换 |
| 表单数据 | `reactive` | 多个字段，用对象更方便 |

### 常见用法

```javascript
// ✅ 推荐：基本类型用 ref
const count = ref(0)
const name = ref('Vue3')
const isLoading = ref(false)

// ✅ 推荐：表单数据用 reactive
const form = reactive({
  username: '',
  password: '',
  email: ''
})

// ✅ 推荐：复杂状态用 reactive
const state = reactive({
  users: [],
  currentPage: 1,
  totalPages: 0
})
```

---

## ⚠️ 常见坑点

### 坑点1：忘记 .value

```javascript
const count = ref(0)

// ❌ 错误！
console.log(count)  // 打印的是 RefImpl 对象，不是 0

// ✅ 正确
console.log(count.value)  // 0
```

### 坑点2：解构 reactive 会丢失响应式

```javascript
const state = reactive({ count: 0, name: 'Vue3' })

// ❌ 解构后丢失响应式！
const { count, name } = state
count = 1  // 这不会触发更新！

// ✅ 使用 toRefs 保持响应式
import { toRefs } from 'vue'
const { count, name } = toRefs(state)
count.value = 1  // 正常触发更新
```

### 坑点3：整体替换 reactive 对象

```javascript
let state = reactive({ count: 0 })

// ❌ 整体替换会丢失响应式！
state = reactive({ count: 1 })  // 原来的响应式连接断了

// ✅ 使用 ref 可以整体替换
const state = ref({ count: 0 })
state.value = { count: 1 }  // 正常工作
```

---

## 🔍 深入理解：ref 的自动解包

### 在模板中自动解包

```vue
<template>
  <!-- 在模板中不需要 .value -->
  <div>{{ count }}</div>
  <button @click="count++">+1</button>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
```

### 在 reactive 中自动解包

```javascript
const count = ref(0)
const state = reactive({
  count  // ref 在 reactive 中会自动解包
})

// 不需要 .value
console.log(state.count)  // 0，不是 RefImpl 对象
state.count = 1           // 直接赋值
```

---

## 💡 ref 的完整实现

```javascript
// Vue3 中 ref 的简化实现
function ref(value) {
  return createRef(value)
}

function createRef(rawValue) {
  // 如果已经是 ref，直接返回
  if (isRef(rawValue)) {
    return rawValue
  }
  
  return new RefImpl(rawValue)
}

class RefImpl {
  constructor(value) {
    // 如果是对象，用 reactive 包装
    this._value = isObject(value) ? reactive(value) : value
    this._rawValue = value
  }
  
  get value() {
    // 收集依赖
    track(this, 'value')
    return this._value
  }
  
  set value(newValue) {
    // 值有变化才更新
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = isObject(newValue) ? reactive(newValue) : newValue
      // 触发更新
      trigger(this, 'value')
    }
  }
}

function isRef(r) {
  return !!(r && r.__v_isRef === true)
}
```

---

## 📝 总结

| 特性 | ref | reactive |
|-----|-----|----------|
| 支持基本类型 | ✅ | ❌ |
| 访问方式 | `.value` | 直接访问 |
| 整体替换 | ✅ | ❌ |
| 模板中使用 | 自动解包 | 直接使用 |
| 解构 | 保持响应式 | 丢失响应式 |

### 我的建议

> **统一用 ref 是最省心的选择**

为什么？
1. `ref` 支持所有类型，不用纠结
2. 模板中自动解包，不影响使用
3. 可以整体替换
4. `.value` 让你清楚知道这是响应式数据

```javascript
// 简单粗暴的选择：全部用 ref
const count = ref(0)
const user = ref({ name: 'Vue3' })
const list = ref([1, 2, 3])
```

---

## 🚀 下一步

- [03-computed 计算属性原理](./03-computed原理.md)



