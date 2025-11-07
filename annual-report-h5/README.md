# 2024 年度音乐回忆报告 H5

基于 React + Swiper.js + GSAP 实现的年度回忆报告页面

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📦 技术栈

- **React 18** - 前端框架
- **Vite** - 构建工具
- **Swiper.js** - 页面切换轮播
- **GSAP** - 动画效果
- **Sass** - CSS 预处理器

## 🎨 功能特性

- ✨ 5个精美页面的年度报告
- 🎵 背景音乐播放控制
- 📱 完全响应式设计
- 🎭 流畅的页面切换动画
- 🖱️ 支持鼠标滚轮/触摸滑动
- 💫 GSAP 动画效果

## 📄 页面结构

1. **封面页** - 2024 年度回忆开场
2. **统计页** - 音乐聆听时长和数据统计
3. **最爱页** - 最喜欢的歌曲和艺人
4. **情绪页** - 音乐情绪分析
5. **总结页** - 年度亮点和分享

## 🛠️ 项目结构

```
annual-report-h5/
├── src/
│   ├── components/       # 页面组件
│   │   ├── CoverPage.jsx
│   │   ├── StatsPage.jsx
│   │   ├── FavoritePage.jsx
│   │   ├── MoodPage.jsx
│   │   └── SummaryPage.jsx
│   ├── data/            # 数据配置
│   │   └── reportData.js
│   ├── utils/           # 工具函数
│   │   └── AudioManager.js
│   ├── styles/          # 样式文件
│   │   ├── index.scss
│   │   └── App.scss
│   ├── App.jsx          # 主应用组件
│   └── main.jsx         # 入口文件
├── index.html
├── package.json
└── vite.config.js
```

## 🎮 操作方式

- 🖱️ **PC端**: 鼠标滚轮上下滚动切换页面
- 📱 **移动端**: 上下滑动切换页面
- 🔊 **音乐控制**: 点击右上角按钮控制背景音乐

## 📝 自定义数据

修改 `src/data/reportData.js` 文件中的数据即可自定义报告内容：

```javascript
export const reportData = {
  year: 2024,
  userName: '你的名字',
  pages: [
    // 自定义页面数据
  ]
}
```

## 🎨 自定义样式

所有样式文件位于 `src/styles/` 目录：
- `index.scss` - 全局样式
- `App.scss` - 页面和组件样式

## 📱 移动端适配

项目已完全适配移动端，支持：
- 触摸滑动
- 响应式布局
- 防止双击缩放
- 优化的字体大小

## 🌟 效果预览

- 流畅的页面过渡动画
- 渐变背景色
- 卡片动画
- 数据动画展示
- 进度条动画

## 📄 License

MIT

