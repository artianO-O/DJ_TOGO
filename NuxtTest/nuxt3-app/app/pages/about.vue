<template>
  <div class="page">
    <h1>📖 关于页面</h1>
    <p>这是一个 Nuxt 3 学习项目</p>
    
    <div class="info">
      <h3>使用技术：</h3>
      <ul>
        <li>Nuxt 3</li>
        <li>Vue 3</li>
        <li>TypeScript</li>
      </ul>
    </div>

    <div class="link">
      <NuxtLink to="/">⬅️ 返回首页</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #00DC82;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.info {
  margin: 40px 0;
  padding: 30px;
  background: #f5f5f5;
  border-radius: 8px;
}

.info h3 {
  margin-bottom: 20px;
}

.info ul {
  list-style: none;
  padding: 0;
}

.info li {
  padding: 8px 0;
  font-size: 18px;
}

.link a {
  display: inline-block;
  margin-top: 30px;
  padding: 12px 24px;
  background: #00DC82;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
}

.link a:hover {
  background: #00b86d;
}
</style>

