# Vue3 核心原理学习指南 🚀

> 从零开始，深入理解 Vue3 的核心原理

## 📚 学习目录

| 序号 | 章节 | 核心内容 | 难度 |
|:---:|------|---------|:----:|
| 01 | [响应式原理](./01-响应式原理.md) | Proxy、依赖收集、触发更新 | ⭐⭐ |
| 02 | [ref 与 reactive](./02-ref与reactive.md) | 两种响应式 API 的区别和原理 | ⭐⭐ |
| 03 | [computed 原理](./03-computed原理.md) | 惰性求值、缓存机制 | ⭐⭐⭐ |
| 04 | [watch 原理](./04-watch原理.md) | watch/watchEffect 实现 | ⭐⭐⭐ |
| 05 | [虚拟DOM与Diff](./05-虚拟DOM与Diff.md) | VNode、Diff 算法、key 的作用 | ⭐⭐⭐⭐ |
| 06 | [组件渲染流程](./06-组件渲染流程.md) | 挂载、更新、生命周期 | ⭐⭐⭐⭐ |
| 07 | [模板编译原理](./07-模板编译原理.md) | Parse、Transform、Generate | ⭐⭐⭐⭐⭐ |
| 08 | [面试题总结](./08-面试题总结.md) | 高频面试题及详细解答 | ⭐⭐⭐ |

---

## 🎯 学习路线建议

```
第1周：响应式核心
├── 01-响应式原理 ⬅️ 最重要！
├── 02-ref与reactive
└── 动手实现一个迷你响应式系统

第2周：响应式进阶
├── 03-computed原理
├── 04-watch原理
└── 动手实现 computed 和 watch

第3周：渲染原理
├── 05-虚拟DOM与Diff
├── 06-组件渲染流程
└── 理解整体渲染流程

第4周：编译 & 面试
├── 07-模板编译原理
├── 08-面试题总结
└── 刷面试题，查漏补缺
```

---

## 💡 学习方法

### 1. 动手实现

每个章节都有代码示例，**一定要动手敲一遍**！

```bash
# 创建测试文件
touch test.html

# 把代码复制进去，用浏览器打开测试
```

### 2. 画图理解

响应式流程、Diff 算法、渲染流程，**画图帮助理解**。

### 3. 阅读源码

学完原理后，尝试阅读 Vue3 源码：

```bash
git clone https://github.com/vuejs/core.git
cd core

# 核心代码位置
# packages/reactivity  - 响应式
# packages/runtime-core - 运行时核心
# packages/compiler-core - 编译器核心
```

### 4. 输出总结

学完一个章节，尝试：
- 用自己的话复述原理
- 写一篇学习笔记
- 给别人讲解

---

## 🔑 核心概念速查

### 响应式

| 概念 | 说明 |
|-----|------|
| `Proxy` | ES6 代理对象，拦截读写操作 |
| `track` | 依赖收集，记录谁读了数据 |
| `trigger` | 触发更新，通知依赖重新执行 |
| `effect` | 副作用函数，依赖变化时重新执行 |

### 虚拟 DOM

| 概念 | 说明 |
|-----|------|
| `VNode` | 用 JS 对象描述 DOM |
| `h()` | 创建 VNode 的函数 |
| `patch` | 对比新旧 VNode，更新 DOM |
| `key` | 帮助 Diff 识别节点 |

### 编译

| 概念 | 说明 |
|-----|------|
| `Parse` | 把模板解析成 AST |
| `Transform` | 转换优化 AST |
| `Generate` | 生成渲染函数代码 |
| `PatchFlag` | 标记动态内容 |

---

## 📖 推荐资源

### 书籍

- 📕 **《Vue.js 设计与实现》** - 霍春阳（强烈推荐）

### 视频

- 🎬 [Vue Mastery](https://www.vuemastery.com/)
- 🎬 [尚硅谷 Vue3 源码解读](https://www.bilibili.com/video/BV1Zy4y1J73E)

### 文章

- 📝 [Vue3 官方文档](https://cn.vuejs.org/)
- 📝 [Vue3 源码仓库](https://github.com/vuejs/core)

---

## ✅ 学习检查清单

完成后打勾 ✓

- [ ] 理解响应式原理，能手写简易版
- [ ] 清楚 ref 和 reactive 的区别
- [ ] 理解 computed 的缓存机制
- [ ] 理解 watch 和 watchEffect 的区别
- [ ] 理解虚拟 DOM 和 Diff 算法
- [ ] 知道 key 的作用和原理
- [ ] 理解组件渲染流程和生命周期
- [ ] 了解模板编译的三个阶段
- [ ] 能回答常见面试题

---

## 🚀 下一步

学完 Vue3 原理后，可以继续学习：

1. **Vue3 生态**：Pinia、Vue Router、VueUse
2. **TypeScript**：Vue3 + TS 最佳实践
3. **性能优化**：大型项目性能调优
4. **源码贡献**：尝试给 Vue 提 PR

---

**祝你学习顺利！有问题随时问我 🎉**



