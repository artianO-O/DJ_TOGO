<template>
  <div class="demo-page">
    <div class="page-header">
      <h1>🧪 组件与 Composables 示例</h1>
      <p>展示自动导入的组件和可复用逻辑</p>
    </div>

    <div class="demo-grid">
      <!-- Counter Composable 示例 -->
      <BaseCard>
        <template #header>
          📊 useCounter Composable
        </template>
        <div class="counter-demo">
          <div class="counter-display">
            <span class="count">{{ count }}</span>
            <span class="label">当前值</span>
          </div>
          <div class="counter-info">
            <p>翻倍值: <strong>{{ doubled }}</strong></p>
            <p>是否为正: <strong>{{ isPositive ? '✅ 是' : '❌ 否' }}</strong></p>
          </div>
          <div class="counter-actions">
            <BaseButton variant="secondary" size="sm" @click="decrement">
              -1
            </BaseButton>
            <BaseButton size="sm" @click="increment">
              +1
            </BaseButton>
            <BaseButton variant="outline" size="sm" @click="reset">
              重置
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <!-- Button 组件示例 -->
      <BaseCard>
        <template #header>
          🔘 BaseButton 组件
        </template>
        <div class="button-demo">
          <div class="button-row">
            <BaseButton variant="primary">Primary</BaseButton>
            <BaseButton variant="secondary">Secondary</BaseButton>
            <BaseButton variant="outline">Outline</BaseButton>
          </div>
          <div class="button-row">
            <BaseButton size="sm">Small</BaseButton>
            <BaseButton size="md">Medium</BaseButton>
            <BaseButton size="lg">Large</BaseButton>
          </div>
          <div class="button-row">
            <BaseButton disabled>Disabled</BaseButton>
            <BaseButton :loading="isLoading" @click="simulateLoading">
              {{ isLoading ? '加载中...' : '点击加载' }}
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <!-- LocalStorage Composable 示例 -->
      <BaseCard>
        <template #header>
          💾 useLocalStorage Composable
        </template>
        <div class="storage-demo">
          <p class="storage-info">数据会自动保存到 localStorage，刷新页面后依然存在</p>
          <div class="storage-input">
            <label>你的名字:</label>
            <input 
              v-model="userName" 
              type="text" 
              placeholder="输入你的名字..."
            />
          </div>
          <p class="storage-value">
            当前保存的值: <strong>{{ userName || '(空)' }}</strong>
          </p>
          <BaseButton variant="outline" size="sm" @click="userName = ''">
            清除
          </BaseButton>
        </div>
      </BaseCard>

      <!-- 路由信息 -->
      <BaseCard>
        <template #header>
          🛤️ 路由信息 (useRoute)
        </template>
        <div class="route-demo">
          <div class="route-item">
            <span class="route-label">当前路径:</span>
            <code>{{ route.path }}</code>
          </div>
          <div class="route-item">
            <span class="route-label">完整 URL:</span>
            <code>{{ route.fullPath }}</code>
          </div>
          <div class="route-item">
            <span class="route-label">路由名称:</span>
            <code>{{ route.name }}</code>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
// useCounter - 自动导入，无需 import
const { count, doubled, isPositive, increment, decrement, reset } = useCounter(0)

// useLocalStorage - 自动导入，数据持久化
const userName = useLocalStorage('demo-username', '')

// 模拟加载状态
const isLoading = ref(false)
const simulateLoading = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  isLoading.value = false
}

// useRoute - Nuxt 内置
const route = useRoute()

// 设置页面 Meta
useHead({
  title: '组件示例 - Nuxt 3 学习'
})
</script>

<style scoped>
.demo-page {
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

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

/* Counter Demo */
.counter-demo {
  text-align: center;
}

.counter-display {
  margin-bottom: 24px;
}

.counter-display .count {
  display: block;
  font-size: 4rem;
  font-weight: 700;
  color: #00dc82;
  line-height: 1;
}

.counter-display .label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 8px;
  display: block;
}

.counter-info {
  margin-bottom: 24px;
}

.counter-info p {
  margin: 8px 0;
}

.counter-info strong {
  color: #00dc82;
}

.counter-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* Button Demo */
.button-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.button-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

/* Storage Demo */
.storage-demo {
  text-align: center;
}

.storage-info {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 20px;
}

.storage-input {
  margin-bottom: 16px;
}

.storage-input label {
  display: block;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.7);
}

.storage-input input {
  width: 100%;
  max-width: 300px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.storage-input input:focus {
  border-color: #00dc82;
}

.storage-input input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.storage-value {
  margin-bottom: 16px;
}

.storage-value strong {
  color: #00dc82;
}

/* Route Demo */
.route-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.route-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.route-label {
  color: rgba(255, 255, 255, 0.6);
  min-width: 100px;
}

.route-item code {
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 12px;
  border-radius: 6px;
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 0.875rem;
  color: #00dc82;
}
</style>


