<template>
  <div class="heavy-component">
    <h3>🎉 重组件已加载！</h3>
    <p>这是一个模拟的"重量级"组件，演示动态导入的效果。</p>
    
    <div class="component-content">
      <div class="feature-list">
        <div v-for="feature in features" :key="feature.id" class="feature-item">
          <div class="feature-icon">{{ feature.icon }}</div>
          <div class="feature-info">
            <h4>{{ feature.title }}</h4>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
      
      <div class="stats">
        <div class="stat-card" v-for="stat in stats" :key="stat.label">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
    
    <p class="load-time">⏱️ 组件加载时间: {{ loadTime }}ms</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loadTime = ref(0)
const startTime = performance.now()

const features = [
  {
    id: 1,
    icon: '🚀',
    title: '按需加载',
    description: '只在需要时才加载此组件'
  },
  {
    id: 2,
    icon: '📦',
    title: '代码分割',
    description: '减少初始包体积'
  },
  {
    id: 3,
    icon: '⚡',
    title: '性能提升',
    description: '提升首屏加载速度'
  }
]

const stats = [
  { value: '100KB', label: '组件大小' },
  { value: '500ms', label: '加载时间' },
  { value: '95%', label: '性能提升' }
]

onMounted(() => {
  // 模拟一些初始化操作
  setTimeout(() => {
    loadTime.value = Math.round(performance.now() - startTime)
    console.log(`✅ 重组件加载完成，耗时: ${loadTime.value}ms`)
  }, 500)
})
</script>

<style lang="scss" scoped>
.heavy-component {
  margin-top: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  animation: slideIn 0.5s ease-out;
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    text-align: center;
  }
  
  > p {
    text-align: center;
    color: #666;
    margin-bottom: 1.5rem;
  }
}

.component-content {
  .feature-list {
    display: grid;
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    .feature-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      .feature-icon {
        font-size: 2rem;
        margin-right: 1rem;
      }
      
      .feature-info {
        flex: 1;
        
        h4 {
          margin: 0 0 0.25rem 0;
          color: #2c3e50;
        }
        
        p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }
      }
    }
  }
  
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    
    .stat-card {
      text-align: center;
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      .stat-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #667eea;
        margin-bottom: 0.5rem;
      }
      
      .stat-label {
        font-size: 0.9rem;
        color: #666;
      }
    }
  }
}

.load-time {
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
  color: #667eea;
  background: white;
  padding: 0.75rem;
  border-radius: 4px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

