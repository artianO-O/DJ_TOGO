<template>
  <div class="page">
    <h1>🏠 首页</h1>
    <p>欢迎来到 Nuxt 3</p>
    
    <div class="counter">
      <p>计数: {{ count }}</p>
      <button @click="count++">+1</button>
    </div>

    <div class="link">
      <NuxtLink to="/about">👉 去关于页面</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const count = ref(0)
</script>

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

.counter {
  margin: 40px 0;
}

.counter p {
  font-size: 24px;
  margin-bottom: 10px;
}

.counter button {
  background: #00DC82;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
}

.counter button:hover {
  background: #00b86d;
}

.link a {
  display: inline-block;
  margin-top: 30px;
  padding: 12px 24px;
  background: #333;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
}

.link a:hover {
  background: #555;
}
</style>

