<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>🚀 性能优化练习项目</h1>
        <nav class="nav">
          <router-link to="/">首页</router-link>
          <router-link to="/image-optimization">图片优化</router-link>
          <router-link to="/list-optimization">列表优化</router-link>
          <router-link to="/lazy-load">懒加载</router-link>
          <router-link to="/code-split">代码分割</router-link>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>Vue3 + Vite 性能优化练习项目 © 2025</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('🎉 应用已启动！')
  console.log('💡 打开开发者工具查看性能监控数据')
})
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0 0 1rem 0;
    font-size: 1.8rem;
  }

  .nav {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;

    a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s;
      background: rgba(255, 255, 255, 0.1);

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      &.router-link-active {
        background: rgba(255, 255, 255, 0.3);
        font-weight: bold;
      }
    }
  }
}

.app-main {
  flex: 1;
  padding: 2rem 0;
}

.app-footer {
  background: #2c3e50;
  color: white;
  padding: 1.5rem 0;
  text-align: center;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

// 路由切换动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

