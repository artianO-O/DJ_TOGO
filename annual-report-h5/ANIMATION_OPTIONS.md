# IntroPage 动画方案

## ✅ 当前方案：方案1 - 爆炸式登场（已实现）

### 🎬 动画效果
1. **标题爆炸放大** - 从0.5倍缩放弹性放大到1倍，带闪烁光晕
2. **卡片淡入** - 整体卡片缩放进入
3. **头像旋转弹出** - 从-180度旋转到0度，持续轻微跳动
4. **用户名滑入** - 从下方20px滑入
5. **消息波浪进入** - 平滑淡入
6. **详情卡片3D翻转** - Y轴90度翻转进入，鼠标悬停倾斜

### 🎯 特点
- ⚡ 视觉冲击力强
- 🎨 有层次感
- 💫 持续动画（头像跳动）
- 🖱️ 交互反馈（悬停效果）

---

## 🎨 其他可选方案

### 方案2: 科技感扫描 🤖

```javascript
// 标题扫描线效果
.from(titleRef.current, {
  opacity: 0,
  clipPath: 'inset(0 100% 0 0)',
  duration: 1.5,
  ease: 'power2.inOut'
})

// 数字滚动计数
{ value: 0 } to { value: 5 }
onUpdate: () => {
  element.textContent = Math.floor(value)
}
```

**特点**: 
- 黑客帝国风格
- 数字滚动效果
- 扫描线动画
- 科技感十足

---

### 方案3: 梦幻漂浮 ✨

```javascript
// 文字随机漂浮
chars.forEach((char, i) => {
  gsap.from(char, {
    opacity: 0,
    x: gsap.utils.random(-50, 50),
    y: gsap.utils.random(-50, 50),
    rotation: gsap.utils.random(-45, 45),
    duration: gsap.utils.random(0.8, 1.5)
  })
})

// 持续漂浮
gsap.to(element, {
  y: '+=10',
  duration: 2,
  yoyo: true,
  repeat: -1,
  ease: 'sine.inOut'
})
```

**特点**:
- 温馨柔和
- 漂浮晃动
- 梦幻氛围
- 适合情感类

---

### 方案4: 电影分镜 🎬

```javascript
// 3D透视飞入
.from(titleRef.current, {
  z: -1000,
  opacity: 0,
  duration: 1.5,
  ease: 'power3.out'
})

// 翻页效果
.from(cardRef.current, {
  rotationX: -90,
  transformOrigin: 'top',
  opacity: 0,
  duration: 1.2
})
```

**特点**:
- 电影镜头感
- 3D透视
- 翻页效果
- 视觉震撼

---

### 方案5: 音乐律动 🎵

```javascript
// 标题跳动
.to(titleRef.current, {
  scale: 1.1,
  duration: 0.2,
  yoyo: true,
  repeat: 3
})

// 波浪起伏
chars.forEach((char, i) => {
  gsap.to(char, {
    y: -10,
    duration: 0.5,
    delay: i * 0.05,
    yoyo: true,
    repeat: -1
  })
})
```

**特点**:
- 随节奏跳动
- 波浪效果
- 音乐感强
- 活力十足

---

## 🔄 如何切换方案

### 方案2 - 科技感（代码片段）
```javascript
// 替换 IntroPage.jsx 的 useEffect 部分
tl.from(titleRef.current, {
  opacity: 0,
  clipPath: 'inset(0 100% 0 0)',
  duration: 1.5,
  ease: 'power2.inOut'
})
.to(avatarRef.current, {
  opacity: 1,
  scale: 1,
  duration: 0.5
}, '+=0.3')

// 数字计数动画
const counter = { value: 0 }
tl.to(counter, {
  value: data.data.totalYears,
  duration: 2,
  onUpdate: () => {
    // 更新显示数字
  }
})
```

### 方案3 - 梦幻漂浮（代码片段）
```javascript
// 文字分散漂浮进入
const chars = titleRef.current.querySelectorAll('span')
gsap.from(chars, {
  opacity: 0,
  x: () => gsap.utils.random(-50, 50),
  y: () => gsap.utils.random(-50, 50),
  stagger: 0.05,
  duration: 1,
  ease: 'power2.out'
})

// 持续漂浮
gsap.to(cardRef.current, {
  y: '+=15',
  duration: 2,
  yoyo: true,
  repeat: -1,
  ease: 'sine.inOut'
})
```

---

## 💡 推荐搭配

- **数据类页面**: 方案1（爆炸） 或 方案2（科技）
- **情感类页面**: 方案3（梦幻）
- **宣传类页面**: 方案4（电影）
- **音乐类页面**: 方案5（律动）

## 🎯 当前实现特性

### ✨ 已实现（方案1）
- ✅ 标题爆炸式放大 + 闪烁
- ✅ 头像旋转弹出 + 持续跳动
- ✅ 卡片3D效果
- ✅ 详情卡片翻转 + 悬停交互
- ✅ 流畅的动画时序

### 🎨 视觉效果
- 光晕闪烁
- 阴影投影
- 3D透视
- 悬停反馈

---

## 📝 如果要换成其他方案

直接告诉我："换成方案X"，我会立即帮你实现！

例如：
- "换成方案2（科技感）"
- "换成方案3（梦幻漂浮）"
- "换成方案5（音乐律动）"

或者混合：
- "用方案2的扫描线 + 方案4的3D效果"

