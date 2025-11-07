# 代码压缩与 Terser 优化

## 📚 目录

1. 什么是代码压缩
2. 代码压缩 vs Gzip 压缩
3. Terser 配置详解
4. 压缩技术原理
5. 实际效果对比
6. 测试方法
7. 高级配置选项
8. 最佳实践
9. 常见问题
10. 实战案例

---

## 🎯 核心概念

### 什么是代码压缩（Minification）？

代码压缩是在**不改变代码功能**的前提下，**减少源代码文件大小**的过程。

**关键特点**：
- 🔄 功能完全保留（无损处理）
- 📦 体积显著减小（30-65%）
- ⚡ 下载速度更快
- 🔐 一定程度的代码混淆

### 作用时机

```
开发环境 (npm run dev)
├─ ❌ 不压缩代码
├─ 便于调试和阅读
├─ 保留变量名、注释
└─ 快速热更新

生产环境 (npm run build)
├─ ✅ 压缩代码
├─ 减小文件体积
├─ 提升加载速度
└─ 移除调试代码
```

---

## 🆚 代码压缩 vs Gzip 压缩

### 核心区别

**简单理解**：
- **代码压缩** = 改写源代码让它更短
- **Gzip 压缩** = 用算法压缩文件数据

### 详细对比表

| 对比项 | 代码压缩（Terser） | Gzip 压缩 |
|--------|------------------|-----------|
| **执行时机** | 构建时（npm run build） | 传输时（HTTP） |
| **作用对象** | JavaScript 源代码 | 所有文件（JS/CSS/HTML） |
| **压缩方式** | 删除空格、重命名变量、删除注释 | 通用算法压缩二进制数据 |
| **是否需要解压** | 否（直接执行） | 是（浏览器自动） |
| **典型压缩率** | 30-65% | 60-70% |
| **文件存在形式** | 只有压缩后的代码 | 原文件 + .gz 文件 |
| **是否可叠加** | ✅ 是 | ✅ 是 |
| **压缩工具** | Terser, esbuild, uglify | gzip, brotli |
| **CPU 消耗** | 构建时一次性 | 传输时每次（或预压缩） |

### 叠加使用效果（推荐！）

```
原始 JavaScript 代码：240 KB
├─ 完整变量名
├─ 所有注释
├─ 格式化代码
└─ console.log

  ↓ 第一步：代码压缩（Terser）
  
压缩后代码：85 KB
├─ 单字母变量
├─ 无注释
├─ 单行代码
└─ 无 console
减少：155 KB（65%）

  ↓ 第二步：Gzip 压缩
  
网络传输：28 KB
├─ 二进制压缩
└─ 浏览器自动解压
减少：57 KB（67%）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
最终效果：240 KB → 28 KB
总计减少：212 KB（88%）🎉
```

### 为什么要两者都用？

```
只用代码压缩：
240 KB → 85 KB（传输 85 KB）

只用 Gzip：
240 KB → 85 KB（传输 85 KB）

两者结合：
240 KB → 85 KB → 28 KB（传输 28 KB）✅

结论：两者相辅相成，缺一不可！
```

---

## 🔧 Vite 中的 Terser 配置

### 基础配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // 选择压缩器
    minify: 'terser',  // 'terser' | 'esbuild' | false
    
    // Terser 配置选项
    terserOptions: {
      compress: {
        drop_console: true,    // 移除 console.log
        drop_debugger: true,   // 移除 debugger
      },
      format: {
        comments: false,       // 移除注释
      },
    },
  }
})
```

### 压缩器对比

| 压缩器 | 速度 | 压缩率 | 功能 | 配置复杂度 | 推荐场景 |
|--------|------|--------|------|----------|---------|
| **terser** | 慢 ⭐⭐ | 最好 ⭐⭐⭐⭐⭐ | 最强 ⭐⭐⭐⭐⭐ | 高 | 生产环境 ✅ |
| **esbuild** | 快 ⭐⭐⭐⭐⭐ | 较好 ⭐⭐⭐⭐ | 基础 ⭐⭐⭐ | 低 | 开发/快速构建 |
| **false** | 最快 ⭐⭐⭐⭐⭐ | 无 | 无 | 无 | 调试专用 |

**构建时间对比**（中型项目）：
```
terser:   3.5 秒  → 85 KB
esbuild:  1.5 秒  → 95 KB
false:    1.2 秒  → 240 KB

生产环境推荐：terser（质量优先）
CI/CD 推荐：esbuild（速度优先）
```

---

## 📖 Terser 配置详解

### 1. compress 选项（压缩配置）

#### 1.1 drop_console（移除 console）

**作用**：移除所有 console 相关代码

```javascript
terserOptions: {
  compress: {
    drop_console: true  // 移除所有 console
  }
}
```

**压缩前**：
```javascript
function login(user) {
  console.log('用户登录:', user);
  console.warn('检查权限');
  console.error('错误信息');
  console.debug('调试信息');
  console.info('提示信息');
  console.table([user]);
  console.group('用户组');
  console.groupEnd();
  
  // 业务逻辑
  return validateUser(user);
}

// 文件大小：约 350 字节
```

**压缩后**：
```javascript
function login(user){return validateUser(user)}

// 文件大小：约 50 字节
```

**效果**：
- ✅ 减少代码体积（85%）
- ✅ 保护敏感信息（不在生产环境暴露日志）
- ✅ 提升执行效率（减少函数调用）
- ✅ 防止信息泄露（用户数据、API 信息等）

**何时保留 console**：
```javascript
// 条件性移除（推荐）
export default defineConfig(({ mode }) => ({
  build: {
    terserOptions: {
      compress: {
        drop_console: mode === 'production',  // 只在生产环境移除
      }
    }
  }
}))
```

---

#### 1.2 drop_debugger（移除 debugger）

**作用**：移除所有 debugger 语句

```javascript
terserOptions: {
  compress: {
    drop_debugger: true
  }
}
```

**压缩前**：
```javascript
function calculate(a, b) {
  debugger;  // 开发时用于断点
  const result = a + b;
  
  if (result > 100) {
    debugger;  // 检查异常情况
  }
  
  return result;
}
```

**压缩后**：
```javascript
function calculate(a,b){const result=a+b;return result}
```

**为什么要移除**：
- `debugger` 会**暂停代码执行**
- 生产环境不需要断点调试
- 防止恶意调试和逆向工程
- 提升代码执行速度
- 避免用户遇到断点弹窗

**安全提示**：
```javascript
// ❌ 不安全：debugger 暴露在生产环境
if (DEBUG_MODE) {
  debugger;
}

// ✅ 安全：构建时完全移除
// 配置 drop_debugger: true
```

---

#### 1.3 pure_funcs（移除特定函数）

**作用**：移除指定的"纯函数"调用

```javascript
terserOptions: {
  compress: {
    pure_funcs: ['console.log', 'console.debug', 'logger.debug']
  }
}
```

**压缩前**：
```javascript
function processData(data) {
  console.log('开始处理');      // 会被移除
  console.debug('数据:', data);  // 会被移除
  logger.debug('调试信息');      // 会被移除
  
  console.error('错误');         // 保留
  console.warn('警告');          // 保留
  
  return data.map(x => x * 2);
}
```

**压缩后**：
```javascript
function processData(data){console.error('错误');console.warn('警告');return data.map(x=>x*2)}
```

**使用场景**：
- 保留 error/warn（生产环境可能需要）
- 移除 log/debug（开发调试用）
- 移除自定义日志函数

---

#### 1.4 dead_code（移除无用代码）

**作用**：自动删除永远不会执行的代码

```javascript
terserOptions: {
  compress: {
    dead_code: true  // 默认开启
  }
}
```

**压缩前**：
```javascript
function example() {
  return 'hello';
  console.log('永远不会执行');  // 死代码
  const x = 100;                 // 死代码
}

if (false) {
  console.log('永远不会执行');  // 死代码
}

const DEBUG = false;
if (DEBUG) {
  console.log('调试代码');       // 死代码
}
```

**压缩后**：
```javascript
function example(){return'hello'}const DEBUG=false;
```

---

#### 1.5 unused（移除未使用变量）

**作用**：删除声明但未使用的变量

```javascript
terserOptions: {
  compress: {
    unused: true
  }
}
```

**压缩前**：
```javascript
function calculate(a, b) {
  const unused1 = 'never used';       // 未使用
  const unused2 = 100;                // 未使用
  const sum = a + b;                  // 使用了
  const difference = a - b;           // 未使用
  
  return sum;
}
```

**压缩后**：
```javascript
function calculate(a,b){const sum=a+b;return sum}
```

---

#### 1.6 其他常用 compress 选项

```javascript
terserOptions: {
  compress: {
    // === 移除相关 ===
    drop_console: true,        // 移除所有 console
    drop_debugger: true,       // 移除 debugger
    pure_funcs: [],           // 移除指定函数
    dead_code: true,          // 移除死代码
    unused: true,             // 移除未使用变量
    
    // === 代码优化 ===
    collapse_vars: true,      // 合并变量声明
    reduce_vars: true,        // 优化变量赋值
    join_vars: true,          // 合并连续的 var 声明
    sequences: true,          // 用逗号运算符合并语句
    
    // === 表达式优化 ===
    booleans: true,           // 优化布尔表达式
    loops: true,              // 优化循环
    if_return: true,          // 优化 if-return
    conditionals: true,       // 优化条件表达式
    comparisons: true,        // 优化比较运算
    
    // === 高级选项 ===
    passes: 2,                // 压缩轮数（1-3，越多越小但越慢）
    toplevel: false,          // 不压缩顶级作用域
    keep_classnames: false,   // 不保留类名
    keep_fnames: false,       // 不保留函数名
    keep_infinity: false,     // 用 1/0 替代 Infinity
  }
}
```

---

### 2. format 选项（格式配置）

#### 2.1 comments（注释处理）

**作用**：控制注释的保留方式

```javascript
terserOptions: {
  format: {
    comments: false  // 移除所有注释
  }
}
```

**选项值**：

```javascript
// 1. 移除所有注释（推荐）
comments: false

// 2. 保留所有注释
comments: 'all'

// 3. 保留 license 注释（/*! */）
comments: /^!/

// 4. 保留特定注释
comments: /important/

// 5. 自定义函数
comments: function(node, comment) {
  return comment.value.includes('@license');
}
```

**示例**：

**压缩前**：
```javascript
/**
 * 用户登录函数
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @return {Promise} 登录结果
 */
function login(username, password) {
  // 验证用户名长度
  if (username.length < 3) {
    return Promise.reject('用户名太短');
  }
  
  /*! 
   * Important License Information
   * MIT License
   * Copyright (c) 2025
   */
  
  // 调用登录 API
  return api.login(username, password);
}
```

**压缩后（comments: false）**：
```javascript
function login(e,n){return e.length<3?Promise.reject("用户名太短"):api.login(e,n)}
```

**压缩后（comments: /^!/）**：
```javascript
/*! Important License Information MIT License Copyright (c) 2025 */
function login(e,n){return e.length<3?Promise.reject("用户名太短"):api.login(e,n)}
```

---

#### 2.2 其他 format 选项

```javascript
terserOptions: {
  format: {
    comments: false,           // 移除注释
    beautify: false,           // 不格式化代码（压缩模式）
    ascii_only: true,          // 转义 Unicode 字符
    ecma: 2015,               // ECMAScript 版本
    indent_level: 0,          // 缩进级别
    quote_style: 0,           // 引号风格（0=自动,1=单,2=双,3=原始）
    wrap_iife: false,         // 不包装立即执行函数
    preamble: null,           // 文件头部添加的内容
  }
}
```

---

### 3. mangle 选项（变量名混淆）

**作用**：缩短变量名、函数名

```javascript
terserOptions: {
  mangle: {
    toplevel: false,           // 不混淆顶级变量
    eval: false,              // 不混淆 eval 中的变量
    keep_classnames: false,   // 不保留类名
    keep_fnames: false,       // 不保留函数名
    properties: false,        // 不混淆对象属性
  }
}
```

**示例**：

**压缩前**：
```javascript
function calculateTotalPrice(itemPrice, quantity, taxRate) {
  const subtotal = itemPrice * quantity;
  const taxAmount = subtotal * taxRate;
  const totalPrice = subtotal + taxAmount;
  return totalPrice;
}
```

**压缩后（mangle: true）**：
```javascript
function calculateTotalPrice(e,t,n){const r=e*t,o=r*n;return r+o}
```

**注意**：
- ✅ 局部变量会被混淆：`itemPrice` → `e`
- ✅ 函数名默认保留：`calculateTotalPrice` 不变
- ❌ 对象属性不混淆：`obj.name` 中的 `name` 不变

---

## 🔬 压缩技术原理

### 1. 移除空白字符

**压缩前**：
```javascript
function   sum (  a  ,  b  )  {
    return    a   +   b  ;
}
```

**压缩后**：
```javascript
function sum(a,b){return a+b}
```

**节省**：约 60 字节 → 30 字节（50%）

---

### 2. 移除换行和缩进

**压缩前**：
```javascript
function greet(name) {
  const message = 'Hello, ' + name;
  return message;
}
```

**压缩后**：
```javascript
function greet(name){const message='Hello, '+name;return message}
```

---

### 3. 缩短变量名

**压缩前**：
```javascript
function processUserData(userData) {
  const userName = userData.name;
  const userAge = userData.age;
  return { userName, userAge };
}
```

**压缩后**：
```javascript
function processUserData(e){const t=e.name,n=e.age;return{userName:t,userAge:n}}
```

**注意**：对象的键名（`userName`, `userAge`）不会被混淆，因为可能被外部引用。

---

### 4. 简化表达式

**压缩前**：
```javascript
const isValid = value !== undefined && value !== null;
const result = condition ? true : false;
const doubled = array.map(function(x) { return x * 2; });
```

**压缩后**：
```javascript
const isValid=null!=value;
const result=!!condition;
const doubled=array.map(x=>x*2);
```

---

### 5. 合并变量声明

**压缩前**：
```javascript
const a = 1;
const b = 2;
const c = 3;
let x = 10;
let y = 20;
```

**压缩后**：
```javascript
const a=1,b=2,c=3;let x=10,y=20;
```

---

### 6. 内联简单函数

**压缩前**：
```javascript
function double(x) {
  return x * 2;
}

const result = double(5);
```

**压缩后**：
```javascript
const result=10;
```

---

### 7. 优化条件语句

**压缩前**：
```javascript
if (condition) {
  return true;
} else {
  return false;
}
```

**压缩后**：
```javascript
return!!condition;
```

---

## 📊 实际效果对比

### 案例 1：Vue 组件压缩

**压缩前（开发版本）**：

```vue
<template>
  <div class="user-card">
    <div class="user-header">
      <h3>{{ userName }}</h3>
      <span class="user-role">{{ userRole }}</span>
    </div>
    <div class="user-body">
      <p class="user-email">{{ userEmail }}</p>
      <button @click="handleEdit">编辑</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 用户数据
const userName = ref('张三')
const userEmail = ref('zhangsan@example.com')
const userRole = ref('管理员')

/**
 * 编辑用户信息
 */
function handleEdit() {
  console.log('开始编辑用户')
  console.debug('当前用户:', {
    name: userName.value,
    email: userEmail.value,
    role: userRole.value
  })
  
  // 打开编辑对话框
  openEditDialog()
  
  console.log('编辑对话框已打开')
}

/**
 * 打开编辑对话框
 */
function openEditDialog() {
  // 实现逻辑
}
</script>

<style scoped>
.user-card { padding: 20px; }
.user-header { margin-bottom: 10px; }
</style>

编译后的 JS（未压缩）：约 2.8 KB
```

**压缩后（生产版本）**：

```javascript
// 编译 + 压缩后的最终代码
function _sfc_render(e,t){return o(),i("div",{class:"user-card"},[n("div",{class:"user-header"},[n("h3",null,s(e.userName),1),n("span",{class:"user-role"},s(e.userRole),1)]),n("div",{class:"user-body"},[n("p",{class:"user-email"},s(e.userEmail),1),n("button",{onClick:e.handleEdit},"编辑",8,["onClick"])])])}const userName=ref("张三"),userEmail=ref("zhangsan@example.com"),userRole=ref("管理员");function handleEdit(){openEditDialog()}function openEditDialog(){}export{_sfc_render,userName,userEmail,userRole,handleEdit}

最终大小：约 0.9 KB
```

**效果**：
- 原始：2.8 KB
- 压缩：0.9 KB
- **减少：68%** 🎉

---

### 案例 2：工具函数库压缩

**压缩前**：

```javascript
/**
 * 工具函数库
 * @author Your Name
 * @version 1.0.0
 */

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 延迟时间
 * @return {Function} 防抖后的函数
 */
export function debounce(func, delay = 300) {
  let timeoutId = null;
  
  return function(...args) {
    // 清除之前的定时器
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // 设置新的定时器
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 延迟时间
 * @return {Function} 节流后的函数
 */
export function throttle(func, delay = 300) {
  let lastTime = 0;
  
  return function(...args) {
    const currentTime = Date.now();
    
    // 判断是否超过延迟时间
    if (currentTime - lastTime >= delay) {
      func.apply(this, args);
      lastTime = currentTime;
    }
  };
}

// 文件大小：约 1.2 KB
```

**压缩后**：

```javascript
export function debounce(e,t=300){let n=null;return function(...r){n&&clearTimeout(n),n=setTimeout(()=>{e.apply(this,r),n=null},t)}}export function throttle(e,t=300){let n=0;return function(...r){const o=Date.now();o-n>=t&&(e.apply(this,r),n=o)}}

// 文件大小：约 0.25 KB
```

**效果**：
- 原始：1.2 KB
- 压缩：0.25 KB
- **减少：79%** 🚀

---

## 🧪 测试方法

### 方法 1：查看构建输出

```bash
cd /Users/atian/Desktop/2025/DJ_TOGO/performance-optimization-practice
npm run build
```

**输出示例**：

```
✓ 150 modules transformed.

dist/index.html                    0.52 kB │ gzip: 0.35 kB
dist/assets/index-abc123.css      12.45 kB │ gzip: 3.21 kB
dist/assets/index-def456.js       85.67 kB │ gzip: 28.34 kB
dist/assets/vue-vendor-xyz789.js  45.23 kB │ gzip: 15.67 kB

✓ built in 3.45s
```

---

### 方法 2：对比开启/关闭压缩

#### 开启压缩（默认配置）

```javascript
// vite.config.js
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
    format: {
      comments: false,
    },
  },
}
```

```bash
npm run build
ls -lh dist/assets/js/

# 输出示例：
# -rw-r--r--  85K  index-def456.js
```

#### 关闭压缩（对比）

```javascript
// vite.config.js
build: {
  minify: false,  // 关闭压缩
}
```

```bash
npm run build
ls -lh dist/assets/js/

# 输出示例：
# -rw-r--r--  240K  index-def456.js

体积对比：
- 压缩：85 KB
- 未压缩：240 KB
- 减少：155 KB（65%）⚡
```

---

### 方法 3：查看实际压缩代码

```bash
# 打开压缩后的文件（只看前 500 字符）
head -c 500 dist/assets/js/index-*.js
```

**压缩成功的特征**：

```javascript
function t(){return r(),i("div",{class:"app"},[n("h1",null,"Hello")])}const e=ref("张三");function o(t,n){e.value=t}const a=computed(()=>e.value.toUpperCase());export{t as default,a,o}
```

- ✅ 单行代码（没有换行）
- ✅ 没有空格和缩进
- ✅ 变量名是单字母（t, e, n, r, o, a...）
- ✅ 没有注释

**未压缩的特征**：

```javascript
function MyComponent() {
  return createVNode("div", {
    class: "app"
  }, [
    createVNode("h1", null, "Hello")
  ]);
}

const userName = ref("张三");
```

- ❌ 多行代码，有缩进
- ❌ 有空格和换行
- ❌ 变量名完整（userName, MyComponent...）
- ❌ 可能有注释

---

### 方法 4：测试 console 是否被移除

#### 步骤 1：添加测试代码

在任意组件中添加：

```vue
<script setup>
console.log('这是测试日志');
console.warn('这是警告');
console.error('这是错误');

function test() {
  debugger;
  console.log('函数内的日志');
  return 'test';
}
</script>
```

#### 步骤 2：构建项目

```bash
npm run build
```

#### 步骤 3：检查构建文件

```bash
# 在构建的 JS 文件中搜索 console
grep -r "console" dist/assets/js/

# 应该找不到任何结果（如果配置了 drop_console: true）
```

或者用编辑器打开 `dist/assets/js/index-*.js`，搜索 `console`，应该找不到。

---

### 方法 5：使用在线工具对比

**工具推荐**：
- [JavaScript Minifier](https://javascript-minifier.com/)
- [Terser REPL](https://try.terser.org/)

**步骤**：
1. 复制你的源代码
2. 粘贴到工具中
3. 配置压缩选项
4. 查看压缩结果和体积对比

---

## 🎛️ 高级配置

### 1. 条件性配置（推荐）

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  build: {
    minify: mode === 'production' ? 'terser' : 'esbuild',
    
    terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug'],
      },
      format: {
        comments: false,
      },
    } : {},
  }
}))
```

**效果**：
- 生产环境：完整压缩
- 测试环境：快速构建

---

### 2. 保留特定 console（实用）

```javascript
terserOptions: {
  compress: {
    // 只移除 log 和 debug，保留 error 和 warn
    pure_funcs: ['console.log', 'console.debug'],
    drop_console: false,  // 不移除所有 console
  }
}
```

**使用场景**：生产环境可能需要查看错误和警告

---

### 3. 保留函数名（调试友好）

```javascript
terserOptions: {
  mangle: {
    keep_fnames: true,  // 保留函数名
  }
}
```

**优点**：
- 错误堆栈更易读
- Sentry/Bugsnag 等工具能显示真实函数名
- 便于生产环境调试

**缺点**：
- 体积稍大（约增加 5-10%）

---

### 4. 极致压缩（追求最小体积）

```javascript
terserOptions: {
  compress: {
    drop_console: true,
    drop_debugger: true,
    pure_funcs: ['console.log'],
    passes: 3,              // 压缩 3 轮（更慢但更小）
    unsafe: true,           // 启用不安全优化
    unsafe_math: true,      // 数学优化
    unsafe_methods: true,   // 方法优化
  },
  mangle: {
    toplevel: true,         // 混淆顶级作用域
    properties: {
      regex: /^_/           // 混淆以 _ 开头的属性
    }
  }
}
```

**警告**：`unsafe` 选项可能导致代码行为改变，谨慎使用！

---

### 5. 多压缩器组合

```javascript
// vite.config.js
export default defineConfig({
  build: {
    minify: 'esbuild',  // 快速初步压缩
  },
  
  plugins: [
    // 再用 terser 精细压缩
    {
      name: 'terser-post-process',
      async generateBundle(options, bundle) {
        const { minify } = await import('terser');
        
        for (const fileName in bundle) {
          if (fileName.endsWith('.js')) {
            const chunk = bundle[fileName];
            if (chunk.type === 'chunk') {
              const result = await minify(chunk.code, {
                compress: { drop_console: true }
              });
              chunk.code = result.code;
            }
          }
        }
      }
    }
  ]
})
```

---

## 💡 最佳实践

### 1. 开发环境 vs 生产环境

```javascript
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    build: {
      // 开发/测试：快速构建
      // 生产：完整压缩
      minify: isProduction ? 'terser' : 'esbuild',
      
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        format: {
          comments: false,
        },
      } : undefined,
    }
  };
});
```

---

### 2. 保留重要注释

```javascript
terserOptions: {
  format: {
    comments: /^!|@preserve|@license|@cc_on/i
  }
}
```

**支持的注释格式**：
```javascript
/*! Important License */
/*@preserve Keep this */
/*@license MIT */
```

---

### 3. Source Map 配置

```javascript
build: {
  minify: 'terser',
  sourcemap: true,  // 生成 source map
  
  terserOptions: {
    // ... 压缩配置
  }
}
```

**优点**：
- 压缩代码 + source map = 最佳体验
- 生产环境可以调试
- 错误堆栈指向源代码

---

### 4. CI/CD 优化

```javascript
// 根据环境变量选择策略
const CI = process.env.CI === 'true';

export default defineConfig({
  build: {
    // CI 环境用 esbuild（快）
    // 正式发布用 terser（小）
    minify: CI ? 'esbuild' : 'terser',
  }
})
```

---

## 🚨 常见问题

### Q1: 压缩后代码出错怎么办？

**A**: 可能原因和解决方案：

```javascript
// 1. 关闭不安全优化
terserOptions: {
  compress: {
    unsafe: false,
    unsafe_math: false
  }
}

// 2. 保留特定函数名
terserOptions: {
  mangle: {
    keep_fnames: true,
    reserved: ['MyClass', 'importantFunction']
  }
}

// 3. 生成 source map 调试
build: {
  sourcemap: true
}
```

---

### Q2: 为什么有些 console 没被移除？

**A**: 检查配置：

```javascript
// ✅ 正确
terserOptions: {
  compress: {
    drop_console: true  // 注意是 compress 对象内
  }
}

// ❌ 错误
terserOptions: {
  drop_console: true  // 位置错误
}
```

---

### Q3: 压缩后体积还是很大？

**A**: 检查清单：

1. 是否开启了 Gzip？
```javascript
// 需要配合 Gzip
import viteCompression from 'vite-plugin-compression'

plugins: [
  viteCompression()
]
```

2. 是否有大型依赖？
```bash
npm run analyze  # 查看打包分析
```

3. 是否使用了代码分割？
```javascript
// 路由懒加载
const Home = () => import('./Home.vue')
```

---

### Q4: 压缩后如何调试？

**A**: 使用 Source Map：

```javascript
build: {
  sourcemap: true,  // 或 'hidden'
  minify: 'terser'
}
```

浏览器 DevTools 会自动加载 source map，显示源代码。

---

### Q5: Terser vs esbuild 如何选择？

**A**: 

| 场景 | 推荐 | 原因 |
|------|------|------|
| 生产发布 | terser | 体积最小 |
| CI/CD | esbuild | 速度最快 |
| 开发测试 | esbuild | 快速迭代 |
| 库开发 | terser | 更多配置项 |

---

## 📈 实战案例

### 案例：优化 Vue3 + Vite 项目

#### 优化前

**配置**：
```javascript
// vite.config.js
export default defineConfig({
  build: {
    minify: 'esbuild'  // 默认配置
  }
})
```

**构建结果**：
```
dist/assets/index.js      145 KB
dist/assets/vendor.js      95 KB
总计：240 KB
```

---

#### 优化后

**配置**：
```javascript
// vite.config.js
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug'],
        passes: 2,
      },
      format: {
        comments: false,
      },
      mangle: {
        safari10: true,
      }
    }
  },
  plugins: [
    viteCompression({
      algorithm: 'gzip'
    })
  ]
})
```

**构建结果**：
```
文件体积：
  dist/assets/index.js      85 KB  (-60 KB)
  dist/assets/vendor.js      55 KB  (-40 KB)
  小计：140 KB  (-100 KB, -42%)

Gzip 后：
  dist/assets/index.js.gz   28 KB
  dist/assets/vendor.js.gz  18 KB
  小计：46 KB  (-194 KB, -81%)

总优化：240 KB → 46 KB（传输）
节省：81% 🎉
```

---

#### 性能提升

**4G 网络（1 Mbps = 128 KB/s）**：

```
加载时间：
- 优化前：240 KB ÷ 128 KB/s = 1.88 秒
- 优化后：46 KB ÷ 128 KB/s = 0.36 秒
节省：1.52 秒（81%）

首屏渲染：
- 优化前：2.5 秒
- 优化后：1.0 秒
提升：60% ⚡
```

---

## 🎯 总结

### 核心要点

1. **代码压缩 ≠ Gzip 压缩**
   - 代码压缩：修改源代码结构
   - Gzip 压缩：压缩文件数据
   - 两者叠加效果最佳

2. **典型压缩率**
   - 代码压缩：30-65%
   - 叠加 Gzip：总计 80-90%

3. **推荐配置**
   ```javascript
   minify: 'terser'
   drop_console: true
   drop_debugger: true
   comments: false
   ```

4. **必须搭配 Gzip**
   - 单独使用效果有限
   - 两者配合才能达到最佳效果

5. **注意事项**
   - 生产环境才压缩
   - 保留 source map
   - 测试压缩后的代码

### 快速配置清单

```javascript
// vite.config.js - 推荐配置
export default defineConfig(({ mode }) => ({
  build: {
    minify: mode === 'production' ? 'terser' : 'esbuild',
    sourcemap: true,
    
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
      },
      format: {
        comments: /^!/,  // 保留 license 注释
      },
    },
  },
  
  plugins: [
    viteCompression()  // 叠加 Gzip
  ]
}))
```

### 实施步骤

```
1. 安装依赖（如果需要）
   npm install terser -D

2. 配置 vite.config.js
   添加 minify 和 terserOptions

3. 构建项目
   npm run build

4. 检查产物
   查看 dist 目录文件大小

5. 验证效果
   对比压缩前后体积

6. 测试功能
   确保代码正常运行
```

---

**记住**：代码压缩 + Gzip 压缩 = 黄金组合，可以将文件减小 80-90%！✨

