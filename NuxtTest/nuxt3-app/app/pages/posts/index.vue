<template>
  <div class="posts-page">
    <div class="page-header">
      <h1>📝 文章列表</h1>
      <p>使用 useFetch 从 API 获取数据</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="pending" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <p>❌ 加载失败: {{ error.message }}</p>
      <BaseButton @click="refresh">重试</BaseButton>
    </div>

    <!-- 文章列表 -->
    <div v-else class="posts-grid">
      <NuxtLink 
        v-for="post in posts" 
        :key="post.id" 
        :to="`/posts/${post.id}`"
        class="post-link"
      >
        <BaseCard hoverable>
          <template #header>
            <span class="post-id">#{{ post.id }}</span>
          </template>
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-body">{{ post.body.slice(0, 100) }}...</p>
        </BaseCard>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
/**
 * useFetch 示例
 * 
 * 特点：
 * 1. 自动处理 loading/error 状态
 * 2. SSR 友好 - 服务端获取数据
 * 3. 返回响应式数据
 */
const { data: posts, pending, error, refresh } = await useFetch(
  'https://jsonplaceholder.typicode.com/posts',
  {
    query: { _limit: 12 } // 只获取前 12 条
  }
)
</script>

<style scoped>
.posts-page {
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

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px;
  color: rgba(255, 255, 255, 0.6);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #00dc82;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 60px;
  color: #ff6b6b;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.post-link {
  text-decoration: none;
}

.post-id {
  color: #00dc82;
  font-size: 0.875rem;
}

.post-title {
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 12px;
  text-transform: capitalize;
}

.post-body {
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.5);
}
</style>


