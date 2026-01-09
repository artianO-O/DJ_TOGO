<template>
  <div class="layout">
    <header class="header">
      <div class="container">
        <div class="logo">
          <NuxtLink to="/">🚀 Nuxt Lab</NuxtLink>
        </div>
        <nav class="nav">
          <NuxtLink to="/" class="nav-link">首页</NuxtLink>
          <NuxtLink to="/about" class="nav-link">关于</NuxtLink>
          <NuxtLink to="/posts" class="nav-link">文章</NuxtLink>
          <NuxtLink to="/demo" class="nav-link">示例</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <div class="container">
        <p>© 2025 Nuxt 3 学习项目 | 使用 Vue {{ vueVersion }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { version as vueVersion } from 'vue'
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.header {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  font-size: 1.5rem;
  font-weight: 700;
  color: #00dc82;
  text-decoration: none;
  letter-spacing: -0.5px;
}

.nav {
  display: flex;
  gap: 8px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  color: #00dc82;
  background: rgba(0, 220, 130, 0.15);
}

.main {
  flex: 1;
  padding: 40px 24px;
}

.footer {
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  text-align: center;
}

.footer p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  margin: 0;
}
</style>


