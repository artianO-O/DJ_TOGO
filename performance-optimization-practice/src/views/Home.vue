<template>
  <div class="container">
    <h1 class="page-title">欢迎来到性能优化练习项目</h1>
    <p class="page-subtitle">
      本项目包含多个性能优化场景，帮助你学习和实践 Vue3 应用的性能优化技术
    </p>

    <div class="grid grid-2">
      <div
        class="card feature-card"
        v-for="feature in features"
        :key="feature.id"
      >
        <div class="feature-icon">{{ feature.icon }}</div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
        <ul class="feature-list">
          <li v-for="(item, index) in feature.items" :key="index">
            {{ item }}
          </li>
        </ul>
        <router-link :to="feature.path" class="btn btn-primary">
          开始练习 →
        </router-link>
      </div>
    </div>

    <div class="performance-tips card" style="margin-top: 2rem">
      <h3>🎯 性能优化核心指标</h3>
      <div class="metrics">
        <div class="metric">
          <strong>FCP</strong>
          <span>首次内容绘制</span>
          <code>&lt; 1.8s</code>
        </div>
        <div class="metric">
          <strong>LCP</strong>
          <span>最大内容绘制</span>
          <code>&lt; 2.5s</code>
        </div>
        <div class="metric">
          <strong>FID</strong>
          <span>首次输入延迟</span>
          <code>&lt; 100ms</code>
        </div>
        <div class="metric">
          <strong>CLS</strong>
          <span>累积布局偏移</span>
          <code>&lt; 0.1</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const features = [
  {
    id: 1,
    icon: "🖼️",
    title: "图片优化",
    description: "学习各种图片加载和优化技术",
    path: "/image-optimization",
    items: ["响应式图片", "图片懒加载", "WebP 格式", "图片预加载"],
  },
  {
    id: 2,
    icon: "📋",
    title: "列表优化",
    description: "处理大量数据列表的性能优化",
    path: "/list-optimization",
    items: ["虚拟滚动", "分页加载", "无限滚动", "防抖节流"],
  },
  {
    id: 3,
    icon: "⏳",
    title: "懒加载",
    description: "按需加载资源，提升首屏速度",
    path: "/lazy-load",
    items: ["组件懒加载", "图片懒加载", "路由懒加载", "IntersectionObserver"],
  },
  {
    id: 4,
    icon: "✂️",
    title: "代码分割",
    description: "优化打包体积和加载速度",
    path: "/code-split",
    items: ["动态导入", "Chunk 分割", "Tree Shaking", "打包分析"],
  },
];
</script>

<style lang="scss" scoped>
.feature-card {
  text-align: center;

  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    margin-bottom: 1rem;
  }

  .feature-list {
    list-style: none;
    text-align: left;
    margin-bottom: 1.5rem;

    li {
      padding: 0.5rem 0;
      color: #555;

      &::before {
        content: "✓ ";
        color: #667eea;
        font-weight: bold;
      }
    }
  }
}

.performance-tips {
  h3 {
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;

    .metric {
      text-align: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;

      strong {
        display: block;
        font-size: 1.5rem;
        color: #667eea;
        margin-bottom: 0.5rem;
      }

      span {
        display: block;
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }

      code {
        display: block;
        background: white;
        padding: 0.5rem;
        border-radius: 4px;
        color: #27ae60;
        font-weight: bold;
      }
    }
  }
}
</style>
