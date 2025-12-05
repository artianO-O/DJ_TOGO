# computed 计算属性原理

> 理解 computed 的缓存机制和实现原理

## 🤔 什么是 computed？

**computed（计算属性）= 基于其他数据计算出来的值，有缓存**

```javascript
import { ref, computed } from 'vue'

const price = ref(10)
const quantity = ref(2)

// 计算属性
const total = computed(() => {
  console.log('计算 total')
  return price.value * quantity.value
})

console.log(total.value)  // 计算 total, 20
console.log(total.value)  // 20 （没有打印"计算 total"，用的缓存！）

price.value = 20          // 依赖变了
console.log(total.value)  // 计算 total, 40（重新计算）
```

---

## 🎯 computed vs 普通函数

### 普通函数：每次调用都执行

```javascript
const price = ref(10)
const quantity = ref(2)

// 普通函数
function getTotal() {
  console.log('计算中...')
  return price.value * quantity.value
}

getTotal()  // 计算中... 20
getTotal()  // 计算中... 20（又执行了一遍！）
getTotal()  // 计算中... 20（又执行了一遍！）
```

### computed：有缓存，依赖不变就不重新计算

```javascript
const total = computed(() => {
  console.log('计算中...')
  return price.value * quantity.value
})

total.value  // 计算中... 20
total.value  // 20（用缓存，没有重新计算）
total.value  // 20（用缓存，没有重新计算）

// 只有依赖变了，才重新计算
price.value = 100
total.value  // 计算中... 200
```

---

## 🔍 computed 的核心特性

### 1. 惰性求值（Lazy）

```javascript
const total = computed(() => {
  console.log('我被计算了')
  return price.value * quantity.value
})

// 此时还没有打印！computed 是懒的，不访问就不计算
// ...

total.value  // 现在才打印：我被计算了
```

### 2. 缓存（Cache）

```javascript
// 第一次访问：计算并缓存结果
total.value  // 计算，返回 20，缓存 20

// 后续访问：直接返回缓存
total.value  // 返回缓存的 20
total.value  // 返回缓存的 20
```

### 3. 依赖追踪

```javascript
const total = computed(() => {
  // 内部会自动追踪：这个计算依赖了 price 和 quantity
  return price.value * quantity.value
})

// 当 price 或 quantity 变化时，缓存失效
price.value = 50  // total 的缓存标记为"脏"
total.value       // 重新计算
```

---

## 💡 实现一个简易 computed

```javascript
// 简化版 computed 实现
function computed(getter) {
  let value           // 缓存的值
  let dirty = true    // 是否需要重新计算（脏标记）
  
  // 创建一个 effect 来追踪依赖
  const effect = () => {
    if (dirty) {
      value = getter()
      dirty = false
    }
    return value
  }
  
  // 返回一个类 ref 的对象
  return {
    get value() {
      // 这里会触发依赖收集
      return effect()
    }
  }
}
```

但这个版本有问题：依赖变化时，`dirty` 不会自动变成 `true`！

### 完整版实现

```javascript
function computed(getter) {
  let value
  let dirty = true
  
  // 创建响应式 effect
  const effectFn = effect(getter, {
    lazy: true,  // 懒执行，不立即运行
    scheduler() {
      // 当依赖变化时，不立即执行 getter
      // 而是把 dirty 标记为 true
      if (!dirty) {
        dirty = true
        // 通知依赖了这个 computed 的地方更新
        trigger(obj, 'value')
      }
    }
  })
  
  const obj = {
    get value() {
      if (dirty) {
        // 脏了才重新计算
        value = effectFn()
        dirty = false
      }
      // 收集依赖（别人可能依赖这个 computed）
      track(obj, 'value')
      return value
    }
  }
  
  return obj
}
```

---

## 🔄 computed 的工作流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                   computed 工作流程                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 创建 computed                                               │
│  ┌─────────────────────────────────┐                           │
│  │ const total = computed(() => {  │                           │
│  │   return price + quantity       │   dirty = true            │
│  │ })                              │   value = undefined       │
│  └─────────────────────────────────┘                           │
│                                                                 │
│  2. 首次访问 total.value                                        │
│  ┌─────────────────────────────────┐                           │
│  │ if (dirty) {                    │                           │
│  │   value = getter() // 执行计算   │   dirty = false          │
│  │   dirty = false                 │   value = 20              │
│  │ }                               │                           │
│  │ return value                    │                           │
│  └─────────────────────────────────┘                           │
│                    │                                            │
│                    ▼ 同时收集依赖                                │
│  ┌─────────────────────────────────┐                           │
│  │ price    ──→ [computedEffect]   │                           │
│  │ quantity ──→ [computedEffect]   │                           │
│  └─────────────────────────────────┘                           │
│                                                                 │
│  3. 再次访问 total.value                                        │
│  ┌─────────────────────────────────┐                           │
│  │ dirty === false                 │                           │
│  │ 直接返回缓存的 value (20)        │   ← 不重新计算！           │
│  └─────────────────────────────────┘                           │
│                                                                 │
│  4. 依赖变化 (price = 50)                                       │
│  ┌─────────────────────────────────┐                           │
│  │ trigger → scheduler 执行        │                           │
│  │ dirty = true  // 标记为脏       │   dirty = true            │
│  └─────────────────────────────────┘                           │
│                                                                 │
│  5. 下次访问 total.value                                        │
│  ┌─────────────────────────────────┐                           │
│  │ dirty === true                  │                           │
│  │ 重新执行 getter()               │   dirty = false           │
│  │ value = 100                     │   value = 100             │
│  └─────────────────────────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 computed 的使用场景

### 1. 派生数据

```javascript
const firstName = ref('张')
const lastName = ref('三')

const fullName = computed(() => {
  return firstName.value + lastName.value
})
// fullName.value = '张三'
```

### 2. 过滤/排序列表

```javascript
const todos = ref([
  { text: '学Vue', done: true },
  { text: '学React', done: false },
  { text: '学Three.js', done: false }
])

const filter = ref('all')

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'done':
      return todos.value.filter(t => t.done)
    case 'undone':
      return todos.value.filter(t => !t.done)
    default:
      return todos.value
  }
})
```

### 3. 格式化数据

```javascript
const price = ref(1234567.89)

const formattedPrice = computed(() => {
  return '¥' + price.value.toLocaleString()
})
// formattedPrice.value = '¥1,234,567.89'
```

---

## ⚠️ 注意事项

### 1. 不要在 computed 中做副作用

```javascript
// ❌ 错误：computed 应该是纯计算
const total = computed(() => {
  console.log('计算了')  // 不要有副作用
  fetch('/api/log')      // 不要发请求
  return price.value * quantity.value
})

// ✅ 正确：只做计算
const total = computed(() => {
  return price.value * quantity.value
})
```

### 2. 可写的 computed

```javascript
const firstName = ref('张')
const lastName = ref('三')

// 可写的 computed
const fullName = computed({
  get() {
    return firstName.value + lastName.value
  },
  set(newValue) {
    // 假设格式是 "姓 名"
    const [first, last] = newValue.split(' ')
    firstName.value = first
    lastName.value = last
  }
})

fullName.value = '李 四'  // 触发 set
console.log(firstName.value)  // 李
console.log(lastName.value)   // 四
```

---

## 🎓 总结

| 特性 | 说明 |
|-----|------|
| **惰性求值** | 不访问就不计算 |
| **缓存** | 依赖不变，直接返回缓存值 |
| **依赖追踪** | 自动追踪内部用到的响应式数据 |
| **智能更新** | 只有依赖变化才重新计算 |

### computed vs methods

```javascript
// computed：有缓存
const total = computed(() => price.value * quantity.value)

// methods：无缓存，每次调用都执行
function getTotal() {
  return price.value * quantity.value
}
```

**什么时候用 computed**：
- 需要基于现有数据计算新数据
- 计算比较耗时，需要缓存
- 需要在模板中多次使用

**什么时候用 methods**：
- 需要传参数
- 需要做副作用操作
- 每次调用都需要重新执行

---

## 🚀 下一步

- [04-watch 侦听器原理](./04-watch原理.md)



