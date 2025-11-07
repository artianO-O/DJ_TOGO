# Gzip 压缩原理与实践

## 📚 核心概念

### Gzip 是什么？

Gzip 是一种**文件压缩算法**，用于减少 HTTP 传输时的数据大小。

**关键特点**：
- 🔄 无损压缩（解压后和原文件完全一致）
- 📦 压缩率：通常 60-70%
- ⚡ 浏览器自动解压（用户无感知）
- 🌐 广泛支持（所有现代浏览器）

### Gzip 的作用范围

```
❌ 开发环境 (npm run dev)
- 直接从内存读取文件
- 不经过压缩
- Gzip 插件不生效

✅ 生产环境 (npm run build)
- 生成 .js 和 .js.gz 两个版本
- 服务器根据客户端能力选择
- Gzip 插件生效
```

---

## 🌐 浏览器与服务器之间的完整流程

### 流程图

```
浏览器端                           服务器端
   │                                  │
   │  ① 发送请求                      │
   │  ─────────────────────────────>  │
   │  GET /assets/js/app.js           │
   │  Accept-Encoding: gzip, deflate  │
   │                                  │
   │                                  │  ② 检查支持
   │                                  │  - 读取 Accept-Encoding
   │                                  │  - 支持 gzip ✓
   │                                  │
   │                                  │  ③ 选择文件
   │                                  │  - 有 app.js.gz? ✓
   │                                  │  - 使用 app.js.gz
   │                                  │
   │  ④ 返回压缩文件                  │
   │  <─────────────────────────────  │
   │  Content-Encoding: gzip          │
   │  Content-Length: 28KB            │
   │  [压缩数据 28KB]                 │
   │                                  │
   │  ⑤ 浏览器解压                    │
   │  - 检测到 Content-Encoding      │
   │  - 自动解压 28KB → 85KB         │
   │                                  │
   │  ⑥ 执行 JavaScript               │
   │  - 解压后的代码                  │
   │  - 正常运行                      │
```

---

## 🔍 六个详细步骤

### 步骤 1：浏览器发送请求

浏览器访问网页时，会在请求头中声明支持的压缩格式：

```http
GET /assets/js/app-abc123.js HTTP/1.1
Host: example.com
Accept-Encoding: gzip, deflate, br
User-Agent: Chrome/119.0.0.0
```

**关键请求头**：
- `Accept-Encoding: gzip, deflate, br`
  - 告诉服务器："我支持这些压缩格式"
  - gzip = 最常用的压缩格式
  - deflate = 旧版压缩格式
  - br = Brotli，更新的压缩格式

**类比**：就像去餐厅点菜说"我吃中餐、西餐都可以"

---

### 步骤 2：服务器检查支持

服务器收到请求后，检查客户端是否支持压缩：

```javascript
// 服务器端伪代码
function handleRequest(request) {
  const acceptEncoding = request.headers['accept-encoding'];
  
  if (acceptEncoding && acceptEncoding.includes('gzip')) {
    console.log('✅ 客户端支持 Gzip');
    return 'gzip';
  } else {
    console.log('❌ 客户端不支持压缩');
    return 'none';
  }
}
```

---

### 步骤 3：服务器选择文件

服务器决定返回哪个版本的文件：

```
服务器文件系统：
dist/
├─ assets/
│  ├─ js/
│  │  ├─ app-abc123.js      (85 KB) ← 原始文件
│  │  └─ app-abc123.js.gz   (28 KB) ← 压缩文件

决策流程：
1. 客户端支持 gzip? → 是 ✓
2. app-abc123.js.gz 存在? → 是 ✓
3. 返回 → app-abc123.js.gz (28 KB)
```

**Nginx 配置**：

```nginx
location ~ \.js$ {
    gzip_static on;  # 优先使用预压缩的 .gz 文件
    # 如果存在 app.js.gz，就返回它
}
```

**Node.js/Express 配置**：

```javascript
const express = require('express');
const expressStaticGzip = require('express-static-gzip');

app.use('/', expressStaticGzip('./dist', {
  enableBrotli: true,
  orderPreference: ['br', 'gz'], // br > gzip > 原文件
}));
```

---

### 步骤 4：服务器返回压缩文件

服务器返回 HTTP 响应，包含关键响应头：

```http
HTTP/1.1 200 OK
Content-Type: application/javascript
Content-Encoding: gzip              ← 关键！告诉浏览器这是压缩的
Content-Length: 28672               ← 压缩后的大小 (28 KB)
Cache-Control: max-age=31536000
Vary: Accept-Encoding               ← 提示内容因编码而异

[二进制压缩数据 28KB]               ← 实际传输的数据
```

**关键响应头说明**：

| 响应头 | 作用 | 示例值 |
|--------|------|--------|
| `Content-Encoding: gzip` | 告诉浏览器内容已压缩 | **必须有！** |
| `Content-Length: 28672` | 压缩后的字节数 | 传输 28KB |
| `Content-Type` | 文件类型 | application/javascript |
| `Vary: Accept-Encoding` | 提示内容因编码而异 | 缓存优化 |

---

### 步骤 5：浏览器自动解压

浏览器收到响应后，检测到 `Content-Encoding: gzip`，自动解压：

```javascript
// 浏览器内部处理流程（伪代码）
function processResponse(response) {
  const contentEncoding = response.headers['content-encoding'];
  let body = response.body; // 28KB 压缩数据
  
  if (contentEncoding === 'gzip') {
    console.log('📦 检测到 Gzip 压缩');
    console.log('压缩大小:', body.length, 'bytes'); // 28672
    
    // 自动解压（在内存中完成）
    body = decompress(body, 'gzip');
    
    console.log('✅ 解压完成');
    console.log('原始大小:', body.length, 'bytes'); // 87040
  }
  
  return body; // 85KB 原始 JavaScript 代码
}
```

**浏览器 DevTools 显示**：

```
Network 面板 → 选择文件：

Name: app-abc123.js
Status: 200
Type: javascript
Size: 85.0 KB                    ← 解压后的大小
Time: 250ms
Transferred: 28.7 KB             ← 实际传输的大小 ⭐

Response Headers:
  content-encoding: gzip
  content-length: 28672
```

**解压位置**：
- ❌ 不会解压到磁盘
- ✅ 在内存中实时解压
- 流程：下载 → 内存缓冲区 → 解压 → 执行

---

### 步骤 6：执行代码

浏览器使用解压后的完整代码（85KB）：

```javascript
// 浏览器拿到的是完整的 JavaScript 代码
function myApp() {
  console.log('应用启动！');
  // ... 其他代码
}

myApp(); // 正常执行
```

**用户完全无感知**：
- ✅ 代码正常执行
- ✅ 功能完全正常
- ✅ 唯一区别：下载速度更快

---

## 🛠️ Vite 项目中的 Gzip 配置

### 安装插件

```bash
npm install vite-plugin-compression -D
```

### vite.config.js 配置

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    vue(),
    // Gzip 压缩配置
    viteCompression({
      verbose: true,        // 输出压缩日志
      disable: false,       // false = 启用压缩
      threshold: 10240,     // 10KB 以上才压缩（小文件不值得）
      algorithm: 'gzip',    // 压缩算法
      ext: '.gz',          // 压缩文件扩展名
      deleteOriginFile: false // 保留原文件
    })
  ]
})
```

**配置参数说明**：

| 参数 | 说明 | 推荐值 |
|------|------|--------|
| `verbose` | 是否显示压缩日志 | `true` |
| `disable` | 是否禁用压缩 | `false` |
| `threshold` | 压缩阈值（字节） | `10240` (10KB) |
| `algorithm` | 压缩算法 | `'gzip'` 或 `'brotliCompress'` |
| `ext` | 压缩文件后缀 | `'.gz'` |
| `deleteOriginFile` | 是否删除原文件 | `false`（保留两个版本） |

---

## 🧪 测试 Gzip 效果

### 方法 1：构建并查看文件

```bash
# 构建项目
npm run build

# 查看生成的文件
ls -lh dist/assets/js/

# 期望输出：
# -rw-r--r--  85K  index-abc.js      ← 原始文件
# -rw-r--r--  28K  index-abc.js.gz   ← 压缩文件
```

### 方法 2：对比开启与关闭

#### 开启 Gzip（默认）

```javascript
// vite.config.js
viteCompression({
  disable: false  // 启用
})
```

```bash
npm run build
ls -lh dist/assets/js/
# 看到 .gz 文件 ✅
```

#### 关闭 Gzip（对比）

```javascript
// vite.config.js
viteCompression({
  disable: true  // 禁用
})
```

```bash
npm run build
ls -lh dist/assets/js/
# 没有 .gz 文件 ❌
```

### 方法 3：使用静态服务器测试

```bash
# 安装 serve
npm install -g serve

# 启动服务器（自动识别 .gz 文件）
serve -s dist -p 5000
```

访问 http://localhost:5000，打开 DevTools：

**开启 Gzip 的响应头**：

```http
Response Headers:
  content-encoding: gzip        ← 关键标志
  content-length: 28340         ← 28KB（压缩后）
  
实际传输大小: 28 KB             ← 真正下载的大小 ✅
原始大小: 85 KB                  ← 解压后的大小
节省: 67%
```

**关闭 Gzip 的响应头**：

```http
Response Headers:
  (没有 content-encoding)
  content-length: 85670         ← 85KB（原始大小）
  
实际传输大小: 85 KB             ← 没有压缩 ❌
```

---

## 📊 性能对比

### 文件大小对比

| 文件类型 | 原始大小 | Gzip 后 | 压缩率 | 节省 |
|---------|---------|---------|--------|------|
| **JavaScript** | 85 KB | 28 KB | 67% | 57 KB |
| **CSS** | 12 KB | 3.2 KB | 73% | 8.8 KB |
| **HTML** | 5 KB | 1.5 KB | 70% | 3.5 KB |
| **JSON** | 80 KB | 15 KB | 81% | 65 KB |
| **总计** | 182 KB | 47.7 KB | 74% | 134.3 KB |

### 加载时间对比（4G 网络，1 Mbps = 128 KB/s）

#### ❌ 无 Gzip

```
总大小：182 KB
传输时间：182KB ÷ 128KB/s = 1.42 秒
解压时间：0 秒
总耗时：1.42 秒
```

#### ✅ 有 Gzip

```
总大小：47.7 KB（压缩后）
传输时间：47.7KB ÷ 128KB/s = 0.37 秒
解压时间：~0.01 秒（几乎忽略不计）
总耗时：0.38 秒

节省时间：1.04 秒（73%）⚡
```

---

## 🔧 验证 Gzip 是否生效

### 方法 1：Chrome DevTools

1. 打开网站，按 `F12`
2. 切换到 **Network** 面板
3. 刷新页面
4. 选择任意 JS/CSS 文件
5. 查看详情：

```
✅ Gzip 生效：
Response Headers:
  content-encoding: gzip ✓

Size: 85.0 KB              ← 原始大小
Transferred: 28.7 KB       ← 实际下载（小）

❌ Gzip 未生效：
Response Headers:
  (没有 content-encoding)

Size: 85.0 KB
Transferred: 85.0 KB       ← 两个一样（没压缩）
```

### 方法 2：curl 命令

```bash
# 发送支持 gzip 的请求
curl -H "Accept-Encoding: gzip" -I https://example.com/app.js

# 查看响应头
HTTP/1.1 200 OK
Content-Encoding: gzip ✅
Content-Length: 28672
```

### 方法 3：在线检测工具

- 访问：https://www.giftofspeed.com/gzip-test/
- 输入你的网站 URL
- 查看 Gzip 压缩状态

---

## 💡 最佳实践

### 1. 哪些文件应该压缩？

✅ **应该压缩**：
- JavaScript (.js)
- CSS (.css)
- HTML (.html)
- JSON (.json)
- SVG (.svg)
- XML (.xml)

❌ **不要压缩**：
- JPEG (.jpg) - 已经压缩过
- PNG (.png) - 已经压缩过
- GIF (.gif) - 已经压缩过
- MP4 (.mp4) - 已经压缩过
- ZIP (.zip) - 已经压缩过

### 2. 压缩阈值设置

```javascript
viteCompression({
  threshold: 10240  // 10KB
})
```

**原因**：
- 小于 10KB 的文件压缩收益小
- 压缩/解压有 CPU 开销
- HTTP 头部开销相对更大

### 3. 同时生成 Gzip 和 Brotli

```javascript
// vite.config.js
plugins: [
  // Gzip 压缩
  viteCompression({
    algorithm: 'gzip',
    ext: '.gz',
  }),
  // Brotli 压缩（更高压缩率）
  viteCompression({
    algorithm: 'brotliCompress',
    ext: '.br',
  })
]
```

**效果对比**：
- Gzip：压缩率 65-70%
- Brotli：压缩率 75-80%（更好，但兼容性稍差）

---

## 🚨 常见问题

### Q1: 为什么开发环境看不到效果？

**A**: Gzip 只在生产构建时生效：
- `npm run dev` → 不压缩
- `npm run build` → 压缩

### Q2: 生成了 .gz 文件，但浏览器没用？

**A**: 需要服务器配置支持：

```nginx
# Nginx
gzip_static on;

# 或使用支持 gzip 的静态服务器
serve -s dist
```

### Q3: 如何确认浏览器收到的是压缩文件？

**A**: 查看 Response Headers：
- 有 `content-encoding: gzip` = 使用了压缩 ✅
- 没有此头 = 未使用压缩 ❌

### Q4: Gzip 会损坏文件吗？

**A**: 不会！Gzip 是**无损压缩**：
- 压缩：原文件 → 压缩文件
- 解压：压缩文件 → 完全相同的原文件

### Q5: 为什么有些文件压缩率低？

**A**: 取决于文件内容：
- 文本代码：压缩率高（70%）
- 已压缩文件：压缩率低（1-5%）
- 随机数据：几乎不可压缩

---

## 📈 实战案例

### 案例：优化一个 Vue3 项目

#### 优化前

```
构建产物：
├─ index.html           5 KB
├─ assets/
│  ├─ index.js        245 KB
│  └─ index.css        35 KB
总大小：285 KB
```

#### 添加 Gzip 配置

```javascript
// vite.config.js
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    vue(),
    viteCompression({
      verbose: true,
      threshold: 10240,
      algorithm: 'gzip'
    })
  ]
})
```

#### 优化后

```
构建产物：
├─ index.html           5 KB
├─ index.html.gz        1.5 KB   (-70%)
├─ assets/
│  ├─ index.js        245 KB
│  ├─ index.js.gz      80 KB     (-67%)
│  ├─ index.css        35 KB
│  └─ index.css.gz     9 KB      (-74%)

原始总大小：285 KB
压缩总大小：90.5 KB
节省：194.5 KB（68%）⚡
```

#### 实际效果

```
网络环境：4G (1 Mbps)

加载时间：
- 无 Gzip：2.23 秒
- 有 Gzip：0.71 秒
节省：1.52 秒（68%）

首屏渲染：
- 无 Gzip：2.5 秒
- 有 Gzip：1.0 秒
提升：60% ⬆️
```

---

## 🎯 总结

### 核心要点

1. **传输压缩，执行原文件**
   - 网络传输：28KB（压缩）
   - 浏览器执行：85KB（原始）

2. **用户无感知**
   - 自动压缩、自动解压
   - 代码正常运行
   - 体验明显提升

3. **只对生产环境生效**
   - 开发：`npm run dev` 不压缩
   - 生产：`npm run build` 压缩

4. **需要服务器支持**
   - 返回 `Content-Encoding: gzip`
   - 浏览器才会解压

5. **典型压缩率 65-75%**
   - JavaScript：67%
   - CSS：73%
   - HTML：70%

### 实施步骤

```
1. 安装插件
   npm install vite-plugin-compression -D

2. 配置 vite.config.js
   添加 viteCompression 插件

3. 构建项目
   npm run build

4. 检查产物
   查看 .gz 文件

5. 配置服务器
   支持返回 .gz 文件

6. 验证效果
   DevTools 查看 content-encoding
```

---

**记住**：Gzip 是前端性能优化的基础配置，几乎零成本就能获得 60-70% 的体积优化！✨

