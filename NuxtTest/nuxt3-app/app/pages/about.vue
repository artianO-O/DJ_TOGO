<template>
  <div class="about-page">
    <div class="page-header">
      <h1>📖 关于本项目</h1>
      <p>这是一个 Nuxt 3 学习实验项目</p>
    </div>

    <div class="about-grid">
      <BaseCard>
        <template #header>
          🎯 学习目标
        </template>
        <ul class="checklist">
          <li class="done">✅ 项目初始化与配置</li>
          <li class="done">✅ 基于文件的路由系统</li>
          <li class="done">✅ 布局系统 (Layouts)</li>
          <li class="done">✅ 组件自动导入</li>
          <li class="done">✅ Composables 可复用逻辑</li>
          <li class="done">✅ 动态路由</li>
          <li class="done">✅ useFetch 数据获取</li>
          <li class="todo">⬜ Server API 路由</li>
          <li class="todo">⬜ Middleware 中间件</li>
          <li class="todo">⬜ Plugins 插件</li>
          <li class="todo">⬜ SSR 服务端渲染</li>
        </ul>
      </BaseCard>

      <BaseCard>
        <template #header>
          🛠️ 技术栈
        </template>
        <div class="tech-list">
          <div class="tech-item">
            <span class="tech-name">Nuxt</span>
            <span class="tech-version">v4.2+</span>
          </div>
          <div class="tech-item">
            <span class="tech-name">Vue</span>
            <span class="tech-version">v3.5+</span>
          </div>
          <div class="tech-item">
            <span class="tech-name">Vue Router</span>
            <span class="tech-version">v4.6+</span>
          </div>
          <div class="tech-item">
            <span class="tech-name">TypeScript</span>
            <span class="tech-version">支持</span>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <template #header>
          📂 项目结构
        </template>
        <pre class="file-tree">app/
├── app.vue          # 根组件
├── layouts/         # 布局组件
│   └── default.vue
├── pages/           # 页面路由
│   ├── index.vue
│   ├── about.vue
│   ├── demo.vue
│   └── posts/
│       ├── index.vue
│       └── [id].vue
├── components/      # 自动导入组件
│   ├── BaseCard.vue
│   └── BaseButton.vue
└── composables/     # 可复用逻辑
    ├── useCounter.ts
    └── useLocalStorage.ts</pre>
      </BaseCard>

      <BaseCard>
        <template #header>
          📚 学习资源
        </template>
        <div class="resources">
          <a href="https://nuxt.com/docs" target="_blank" class="resource-link">
            📘 Nuxt 官方文档
          </a>
          <a href="https://vuejs.org/guide" target="_blank" class="resource-link">
            💚 Vue 3 指南
          </a>
          <a href="https://nuxt.com/modules" target="_blank" class="resource-link">
            🧩 Nuxt 模块
          </a>
          <a href="https://vueuse.org" target="_blank" class="resource-link">
            🔧 VueUse 工具库
          </a>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: '关于 - Nuxt 3 学习实验室'
})
</script>

<style scoped>
.about-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 12px;
}

.page-header p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

/* Checklist */
.checklist {
  list-style: none;
  padding: 0;
}

.checklist li {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.95rem;
}

.checklist li:last-child {
  border-bottom: none;
}

.checklist li.done {
  color: rgba(255, 255, 255, 0.9);
}

.checklist li.todo {
  color: rgba(255, 255, 255, 0.4);
}

/* Tech List */
.tech-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tech-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.tech-name {
  font-weight: 600;
  color: #fff;
}

.tech-version {
  color: #00dc82;
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 0.875rem;
}

/* File Tree */
.file-tree {
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 0.85rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  overflow-x: auto;
  margin: 0;
}

/* Resources */
.resources {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resource-link {
  display: block;
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s;
}

.resource-link:hover {
  background: rgba(0, 220, 130, 0.15);
  color: #00dc82;
  transform: translateX(4px);
}
</style>
