# 虚拟 DOM 与 Diff 算法

> 理解 Vue3 如何高效更新页面

## 🤔 为什么需要虚拟 DOM？

### 传统方式的问题

```javascript
// 假设有一个列表需要更新
const list = ['苹果', '香蕉', '橙子']

// 传统方式：直接操作 DOM
function render(items) {
  const ul = document.getElementById('list')
  ul.innerHTML = ''  // 清空
  items.forEach(item => {
    const li = document.createElement('li')
    li.textContent = item
    ul.appendChild(li)
  })
}

// 问题：只改了一项，却要重新渲染整个列表！
list[0] = '葡萄'
render(list)  // 全部重新创建 DOM 节点
```

**问题**：
1. DOM 操作很**慢**（浏览器要重新计算布局、绘制）
2. 全部重新渲染太**浪费**

### 虚拟 DOM 的思路

```
数据变化 
    ↓
生成新的虚拟 DOM
    ↓
对比新旧虚拟 DOM（Diff）
    ↓
只更新变化的真实 DOM
```

---

## 🎯 什么是虚拟 DOM？

**虚拟 DOM = 用 JavaScript 对象描述 DOM 结构**

```javascript
// 真实 DOM
<div id="app" class="container">
  <h1>Hello</h1>
  <p>World</p>
</div>

// 虚拟 DOM（VNode）
const vnode = {
  type: 'div',
  props: {
    id: 'app',
    class: 'container'
  },
  children: [
    {
      type: 'h1',
      props: {},
      children: 'Hello'
    },
    {
      type: 'p',
      props: {},
      children: 'World'
    }
  ]
}
```

### 虚拟 DOM 的优点

1. **跨平台**：可以渲染到 DOM、Canvas、Native 等
2. **性能优化**：批量更新、最小化 DOM 操作
3. **声明式编程**：只描述结果，框架处理过程

---

## 💡 实现一个简易虚拟 DOM

### 1. 创建 VNode

```javascript
// h 函数：创建虚拟节点
function h(type, props, children) {
  return {
    type,
    props: props || {},
    children
  }
}

// 使用
const vnode = h('div', { id: 'app' }, [
  h('h1', null, 'Hello'),
  h('p', { class: 'text' }, 'World')
])
```

### 2. 渲染 VNode 到真实 DOM

```javascript
// 将虚拟节点渲染成真实 DOM
function render(vnode, container) {
  const el = createElement(vnode)
  container.appendChild(el)
}

function createElement(vnode) {
  // 文本节点
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(vnode)
  }
  
  // 元素节点
  const el = document.createElement(vnode.type)
  
  // 设置属性
  for (const key in vnode.props) {
    el.setAttribute(key, vnode.props[key])
  }
  
  // 处理子节点
  if (vnode.children) {
    if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        el.appendChild(createElement(child))
      })
    } else {
      el.appendChild(createElement(vnode.children))
    }
  }
  
  return el
}
```

---

## 🔍 Diff 算法

### 什么是 Diff？

**Diff = 对比新旧虚拟 DOM 树，找出差异**

```javascript
// 旧的虚拟 DOM
const oldVNode = h('div', null, [
  h('p', null, 'A'),
  h('p', null, 'B'),
  h('p', null, 'C')
])

// 新的虚拟 DOM
const newVNode = h('div', null, [
  h('p', null, 'A'),
  h('p', null, 'D'),  // B 变成了 D
  h('p', null, 'C')
])

// Diff 找出：只有第二个 p 的文本变了
// 只更新这一个地方，而不是重新创建整个 div
```

### Diff 的核心策略

Vue3 采用了三个假设来简化 Diff：

1. **同层比较**：只比较同一层级的节点
2. **类型相同才复用**：类型不同直接替换
3. **key 标识节点**：通过 key 判断是否是同一个节点

```
         A                    A'
       / | \                / | \
      B  C  D    ===>      B' C' D'
     /|     |              /|     |
    E F     G             E' F'   G'

只比较同层：A-A', B-B', C-C', D-D', E-E', F-F', G-G'
不会跨层比较：不会比较 E 和 D'
```

---

## 💡 简易 Diff 实现

```javascript
function patch(oldVNode, newVNode, container) {
  // 1. 如果新节点不存在，删除旧节点
  if (!newVNode) {
    container.removeChild(oldVNode.el)
    return
  }
  
  // 2. 如果旧节点不存在，创建新节点
  if (!oldVNode) {
    const el = createElement(newVNode)
    container.appendChild(el)
    return
  }
  
  // 3. 类型不同，直接替换
  if (oldVNode.type !== newVNode.type) {
    const el = createElement(newVNode)
    container.replaceChild(el, oldVNode.el)
    return
  }
  
  // 4. 类型相同，更新属性和子节点
  const el = (newVNode.el = oldVNode.el)
  
  // 更新属性
  patchProps(el, oldVNode.props, newVNode.props)
  
  // 更新子节点
  patchChildren(oldVNode, newVNode, el)
}

function patchProps(el, oldProps, newProps) {
  // 添加或更新属性
  for (const key in newProps) {
    if (newProps[key] !== oldProps[key]) {
      el.setAttribute(key, newProps[key])
    }
  }
  
  // 删除旧属性
  for (const key in oldProps) {
    if (!(key in newProps)) {
      el.removeAttribute(key)
    }
  }
}

function patchChildren(oldVNode, newVNode, container) {
  const oldChildren = oldVNode.children
  const newChildren = newVNode.children
  
  // 简化处理：这里只做简单 Diff
  // 实际 Vue3 的 Diff 更复杂
  
  if (typeof newChildren === 'string') {
    // 新的是文本
    if (typeof oldChildren === 'string') {
      if (newChildren !== oldChildren) {
        container.textContent = newChildren
      }
    } else {
      container.textContent = newChildren
    }
  } else if (Array.isArray(newChildren)) {
    // 新的是数组
    if (Array.isArray(oldChildren)) {
      // 都是数组，需要详细 Diff
      diffChildren(oldChildren, newChildren, container)
    } else {
      container.innerHTML = ''
      newChildren.forEach(child => {
        container.appendChild(createElement(child))
      })
    }
  }
}
```

---

## 🔑 key 的作用

### 没有 key 的问题

```javascript
// 旧列表
['A', 'B', 'C']  →  <li>A</li> <li>B</li> <li>C</li>

// 新列表（在头部插入 D）
['D', 'A', 'B', 'C']

// 没有 key 时，Vue 会这样更新：
// <li>A</li> → <li>D</li>  （A 变成 D）
// <li>B</li> → <li>A</li>  （B 变成 A）
// <li>C</li> → <li>B</li>  （C 变成 B）
// 创建新的 <li>C</li>
// 更新了 4 个节点！
```

### 有 key 的优化

```javascript
// 有 key 时：
// <li key="A">A</li>  →  保持不变
// <li key="B">B</li>  →  保持不变
// <li key="C">C</li>  →  保持不变
// 只需要创建 <li key="D">D</li> 并插入到最前面
// 只操作了 1 个节点！
```

### key 的最佳实践

```vue
<template>
  <!-- ✅ 正确：使用唯一标识作为 key -->
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
  
  <!-- ❌ 错误：使用 index 作为 key -->
  <li v-for="(item, index) in items" :key="index">
    {{ item.name }}
  </li>
</template>
```

**为什么 index 不好？**

```javascript
// 原列表
items = [
  { id: 1, name: 'A' },  // index: 0
  { id: 2, name: 'B' },  // index: 1
]

// 删除 A 后
items = [
  { id: 2, name: 'B' },  // index: 0（index 变了！）
]

// 用 index 作为 key，Vue 会认为：
// key=0 的节点内容从 A 变成了 B（更新内容）
// key=1 的节点被删除了
// 实际上应该是：key=1(A) 被删除，key=2(B) 保持不变
```

---

## 🚀 Vue3 的 Diff 优化

### 1. 静态提升

```vue
<template>
  <div>
    <p>静态文本</p>  <!-- 永远不变 -->
    <p>{{ dynamic }}</p>  <!-- 动态内容 -->
  </div>
</template>
```

Vue3 会把静态节点**提升**到渲染函数外部：

```javascript
// 静态节点只创建一次
const _hoisted_1 = h('p', null, '静态文本')

function render() {
  return h('div', null, [
    _hoisted_1,  // 复用，不参与 Diff
    h('p', null, this.dynamic)  // 只 Diff 这个
  ])
}
```

### 2. patchFlag 标记

Vue3 在编译时会标记节点的动态部分：

```javascript
// 模板
<div :id="id" class="static">{{ text }}</div>

// 编译结果
h('div', { id: id, class: 'static' }, text, PatchFlags.TEXT | PatchFlags.PROPS)
// PatchFlags.TEXT = 1：文本是动态的
// PatchFlags.PROPS = 2：有动态属性
```

Diff 时只需要检查标记的部分，不用逐个比较。

### 3. 快速 Diff 算法

Vue3 的快速 Diff 算法流程：

```
1. 从头比较相同节点
   old: A B C D E
   new: A B F C D E
   相同：A B

2. 从尾比较相同节点
   old: A B C D E
   new: A B F C D E
   相同：C D E

3. 处理中间不同的部分
   old: (nothing)
   new: F
   需要插入 F
```

---

## 📊 Diff 复杂度分析

| 算法 | 时间复杂度 | 说明 |
|-----|-----------|------|
| 传统树 Diff | O(n³) | 需要比较每个节点与所有节点 |
| Vue/React Diff | O(n) | 同层比较 + key 优化 |

---

## 🔄 完整的更新流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    Vue3 更新流程                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 数据变化                                                    │
│  ┌─────────────────────────────────┐                           │
│  │ state.count++                   │                           │
│  │   ↓                             │                           │
│  │ trigger() 触发更新              │                           │
│  └─────────────────────────────────┘                           │
│                                                                 │
│  2. 重新渲染                                                    │
│  ┌─────────────────────────────────┐                           │
│  │ 调用组件的 render 函数          │                           │
│  │   ↓                             │                           │
│  │ 生成新的虚拟 DOM 树             │                           │
│  └─────────────────────────────────┘                           │
│                                                                 │
│  3. Diff 对比                                                   │
│  ┌─────────────────────────────────┐                           │
│  │ patch(oldVNode, newVNode)       │                           │
│  │   ↓                             │                           │
│  │ 找出最小更新范围                │                           │
│  └─────────────────────────────────┘                           │
│                                                                 │
│  4. 更新真实 DOM                                                │
│  ┌─────────────────────────────────┐                           │
│  │ 只更新变化的节点                │                           │
│  │ - 修改文本                      │                           │
│  │ - 更新属性                      │                           │
│  │ - 添加/删除/移动节点            │                           │
│  └─────────────────────────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎓 总结

| 概念 | 说明 |
|-----|------|
| **虚拟 DOM** | 用 JS 对象描述 DOM 结构 |
| **Diff** | 对比新旧虚拟 DOM，找出差异 |
| **key** | 帮助 Diff 识别节点，优化更新 |
| **静态提升** | 静态节点不参与 Diff |
| **patchFlag** | 标记动态内容，精准更新 |

### 虚拟 DOM 不总是更快

- **首次渲染**：虚拟 DOM 多了一层，反而更慢
- **简单更新**：直接操作 DOM 可能更快
- **复杂更新**：虚拟 DOM 的 Diff 优势明显

虚拟 DOM 的真正价值：**声明式编程 + 跨平台 + 合理的性能**

---

## 🚀 下一步

- [06-组件渲染流程](./06-组件渲染流程.md)



