<template>
  <div class="post-detail">
    <!-- 返回按钮 -->
    <NuxtLink to="/posts" class="back-link">
      ← 返回列表
    </NuxtLink>

    <!-- 加载状态 -->
    <div v-if="pending" class="loading">
      <div class="spinner"></div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <h2>😕 文章不存在</h2>
      <p>找不到 ID 为 {{ route.params.id }} 的文章</p>
      <BaseButton @click="navigateTo('/posts')">返回列表</BaseButton>
    </div>

    <!-- 文章内容 -->
    <article v-else class="article">
      <BaseCard>
        <template #header>
          <div class="article-header">
            <span class="article-id">文章 #{{ post?.id }}</span>
            <span class="article-user">作者 ID: {{ post?.userId }}</span>
          </div>
        </template>
        
        <h1 class="article-title">{{ post?.title }}</h1>
        <p class="article-body">{{ post?.body }}</p>
        
        <template #footer>
          <div class="article-actions">
            <BaseButton 
              v-if="post?.id > 1"
              variant="outline" 
              size="sm"
              @click="navigateTo(`/posts/${post.id - 1}`)"
            >
              ← 上一篇
            </BaseButton>
            <BaseButton 
              variant="outline" 
              size="sm"
              @click="navigateTo(`/posts/${post.id + 1}`)"
            >
              下一篇 →
            </BaseButton>
          </div>
        </template>
      </BaseCard>
    </article>
  </div>
</template>

<script setup>
/**
 * 动态路由示例
 * 
 * 文件名 [id].vue 表示这是一个动态路由
 * 访问 /posts/1 时，route.params.id = '1'
 */
const route = useRoute()

// 获取文章详情
const { data: post, pending, error } = await useFetch(
  () => `https://jsonplaceholder.typicode.com/posts/${route.params.id}`
)

// 设置页面标题
useHead({
  title: () => post.value?.title || '文章详情'
})
</script>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
}

.back-link {
  display: inline-block;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  margin-bottom: 24px;
  padding: 8px 0;
  transition: color 0.2s;
}

.back-link:hover {
  color: #00dc82;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 100px;
}

.spinner {
  width: 48px;
  height: 48px;
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
}

.error h2 {
  color: #fff;
  font-size: 2rem;
  margin-bottom: 12px;
}

.error p {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 24px;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-id {
  color: #00dc82;
  font-weight: 600;
}

.article-user {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
}

.article-title {
  color: #fff;
  font-size: 1.75rem;
  line-height: 1.4;
  text-transform: capitalize;
  margin-bottom: 24px;
}

.article-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.7);
}

.article-actions {
  display: flex;
  gap: 12px;
}
</style>


