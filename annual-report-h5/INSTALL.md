# 安装和运行指南

## 快速开始

### 1. 安装依赖
```bash
cd /Users/atian/Desktop/2025/DJ_TOGO/annual-report-h5
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

项目将自动在浏览器中打开 `http://localhost:3000`

### 3. 构建生产版本
```bash
npm run build
```

## 项目特色

### ✨ 10个精美页面
1. **封面页** - 2024年度回忆开场
2. **介绍页** - 用户信息和加入时间
3. **统计页** - 完整的音乐数据统计（6项数据）
4. **里程碑页** - 年度重要时刻回顾
5. **最爱歌曲页** - 最喜欢的歌曲详情
6. **最爱艺人页** - Top 5 艺人排行榜
7. **情绪分析页** - 音乐情绪分布
8. **时间分布页** - 一天中的音乐时间
9. **探索之旅页** - 音乐探索数据
10. **总结页** - 年度回顾和成就

### 🎬 GSAP 高级文字动画
- **字符逐个出现** - 每个字符带旋转和弹跳效果
- **打字机效果** - 文字逐字显示
- **文字分裂重组** - 3D旋转和位移效果
- **波浪效果** - 字符依次波动
- **闪烁出现** - 字符闪烁并放大
- **数字递增** - 数据数字从0开始计数
- **3D翻转** - 卡片3D翻转进入
- **圆形扩散** - 元素从中心圆形扩散
- **弹性进入** - 元素带弹性效果进入

### 🎨 视觉效果
- 10种不同的渐变背景色
- 流畅的页面切换动画
- 毛玻璃效果（backdrop-filter）
- 悬停交互效果
- 响应式设计

### 📱 操作方式
- **PC端**: 鼠标滚轮上下滚动
- **移动端**: 上下滑动
- **音乐控制**: 右上角按钮

## 技术栈

- React 18
- Swiper.js 11
- GSAP 3.12
- Sass
- Vite 5

## 目录结构

```
src/
├── components/
│   ├── CoverPage.jsx          # 封面页
│   ├── IntroPage.jsx           # 介绍页（新增）
│   ├── StatsPage.jsx           # 统计页
│   ├── MilestonePage.jsx       # 里程碑页（新增）
│   ├── FavoritePage.jsx        # 最爱歌曲页
│   ├── TopArtistsPage.jsx      # 最爱艺人页（新增）
│   ├── MoodPage.jsx            # 情绪页
│   ├── TimeDistributionPage.jsx # 时间分布页（新增）
│   ├── DiscoveryPage.jsx       # 探索页（新增）
│   └── SummaryPage.jsx         # 总结页
├── data/
│   └── reportData.js           # 数据配置
├── utils/
│   └── AudioManager.js         # 音频管理
├── styles/
│   ├── index.scss              # 全局样式
│   └── App.scss                # 组件样式
├── App.jsx                     # 主应用
└── main.jsx                    # 入口文件
```

## 自定义数据

编辑 `src/data/reportData.js` 即可修改所有页面内容。

## 注意事项

- 首次运行需要安装依赖（npm install）
- 确保 Node.js 版本 >= 16
- 建议使用 Chrome/Safari 浏览器以获得最佳体验

