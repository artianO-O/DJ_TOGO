<template>
  <div class="home-page">
    <div class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">Nuxt 3</span>
          <br />
          学习实验室
        </h1>
        <p class="hero-desc">
          探索 Vue 3 + Nuxt 3 的现代化全栈开发体验
        </p>
        <div class="hero-actions">
          <BaseButton size="lg" @click="navigateTo('/demo')">
            🧪 查看示例
          </BaseButton>
          <BaseButton variant="outline" size="lg" @click="navigateTo('/posts')">
            📝 文章列表
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="features">
      <h2 class="section-title">✨ 已实现的功能</h2>
      <div class="feature-grid">
        <BaseCard hoverable>
          <div class="feature-icon">📁</div>
          <h3>基于文件的路由</h3>
          <p>pages/ 目录下的 .vue 文件自动成为路由</p>
        </BaseCard>

        <BaseCard hoverable>
          <div class="feature-icon">🧩</div>
          <h3>组件自动导入</h3>
          <p>components/ 目录下的组件无需手动导入</p>
        </BaseCard>

        <BaseCard hoverable>
          <div class="feature-icon">🎣</div>
          <h3>Composables</h3>
          <p>可复用的组合函数，自动导入使用</p>
        </BaseCard>

        <BaseCard hoverable>
          <div class="feature-icon">🎨</div>
          <h3>布局系统</h3>
          <p>layouts/ 目录实现页面布局复用</p>
        </BaseCard>

        <BaseCard hoverable>
          <div class="feature-icon">🔗</div>
          <h3>动态路由</h3>
          <p>[id].vue 实现动态参数路由</p>
        </BaseCard>

        <BaseCard hoverable>
          <div class="feature-icon">📡</div>
          <h3>数据获取</h3>
          <p>useFetch 自动处理 loading/error 状态</p>
        </BaseCard>
      </div>
    </div>

    <div class="counter-section">
      <BaseCard>
        <template #header>
          🎮 快速体验 - 计数器
        </template>
        <div class="counter-content">
          <div class="counter-display">{{ count }}</div>
          <div class="counter-actions">
            <BaseButton variant="secondary" @click="decrement">-1</BaseButton>
            <BaseButton @click="increment">+1</BaseButton>
            <BaseButton variant="outline" @click="reset">重置</BaseButton>
          </div>
        </div>
        <template #footer>
          <code class="code-hint">
            使用 useCounter() composable，自动导入无需 import
          </code>
        </template>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
// useCounter 自动导入
const { count, increment, decrement, reset } = useCounter(0)

// 设置页面元信息
useHead({
  title: '首页 - Nuxt 3 学习实验室',
  meta: [
    { name: 'description', content: 'Nuxt 3 学习项目，探索现代化全栈开发' }
  ]
})
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 60px 0 80px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 24px;
  letter-spacing: -2px;
}

.gradient-text {
  background: linear-gradient(135deg, #00dc82 0%, #36e4da 50%, #0047e1 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-desc {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 40px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Features Section */
.features {
  padding: 60px 0;
}

.section-title {
  text-align: center;
  font-size: 1.75rem;
  color: #fff;
  margin-bottom: 40px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.feature-grid h3 {
  color: #fff;
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.feature-grid p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
}

/* Counter Section */
.counter-section {
  padding: 40px 0 80px;
  max-width: 500px;
  margin: 0 auto;
}

.counter-content {
  text-align: center;
  padding: 20px 0;
}

.counter-display {
  font-size: 5rem;
  font-weight: 700;
  color: #00dc82;
  margin-bottom: 24px;
  line-height: 1;
}

.counter-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.code-hint {
  display: block;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'SF Mono', Monaco, monospace;
}
</style>
