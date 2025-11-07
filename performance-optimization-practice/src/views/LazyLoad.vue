<template>
  <div class="container">
    <h1 class="page-title">懒加载</h1>
    <p class="page-subtitle">按需加载资源，优化首屏加载速度</p>

    <!-- 组件懒加载 -->
    <section class="section card">
      <h2>📦 组件懒加载</h2>
      <p>使用动态导入 (Dynamic Import) 实现组件按需加载</p>
      
      <div class="component-lazy-demo">
        <button @click="loadHeavyComponent" class="btn btn-primary" :disabled="heavyComponentLoaded">
          {{ heavyComponentLoaded ? '组件已加载' : '加载重组件' }}
        </button>
        
        <Suspense v-if="showHeavyComponent">
          <template #default>
            <HeavyComponent />
          </template>
          <template #fallback>
            <div class="loading-placeholder">
              <div class="loading"></div>
              <p>组件加载中...</p>
            </div>
          </template>
        </Suspense>
      </div>
    </section>

    <!-- IntersectionObserver -->
    <section class="section card">
      <h2>👀 IntersectionObserver 懒加载</h2>
      <p>使用 IntersectionObserver API 监听元素进入视口</p>
      
      <div class="observer-demo">
        <div 
          v-for="i in 10" 
          :key="i"
          v-observe="{ callback: onElementVisible, threshold: 0.5 }"
          :data-index="i"
          class="observer-item"
          :class="{ 'visible': visibleItems.includes(i) }"
        >
          <div class="observer-content">
            <h4>元素 {{ i }}</h4>
            <p v-if="visibleItems.includes(i)">✅ 已进入视口</p>
            <p v-else>⏳ 未进入视口</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 内容预加载 -->
    <section class="section card">
      <h2>⚡ 内容预加载</h2>
      <p>根据用户行为预测并预加载可能访问的内容</p>
      
      <div class="prefetch-demo">
        <div class="tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @mouseenter="prefetchTab(tab.id)"
            @click="activeTab = tab.id"
            class="tab-button"
            :class="{ active: activeTab === tab.id }"
          >
            {{ tab.name }}
            <span v-if="prefetchedTabs.includes(tab.id)" class="prefetch-badge">已预加载</span>
          </button>
        </div>
        
        <div class="tab-content">
          <div v-if="tabContents[activeTab]" class="content-loaded">
            {{ tabContents[activeTab] }}
          </div>
          <div v-else class="content-loading">
            <div class="loading"></div>
            <p>加载中...</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 路由预加载 -->
    <section class="section card">
      <h2>🛣️ 路由预加载</h2>
      <p>鼠标悬停在链接上时预加载路由组件</p>
      
      <div class="route-prefetch-demo">
        <p class="tip">💡 将鼠标悬停在下方链接上，路由组件会自动预加载</p>
        <div class="route-links">
          <router-link 
            to="/image-optimization"
            @mouseenter="prefetchRoute('/image-optimization')"
            class="route-link"
          >
            图片优化
          </router-link>
          <router-link 
            to="/list-optimization"
            @mouseenter="prefetchRoute('/list-optimization')"
            class="route-link"
          >
            列表优化
          </router-link>
          <router-link 
            to="/code-split"
            @mouseenter="prefetchRoute('/code-split')"
            class="route-link"
          >
            代码分割
          </router-link>
        </div>
        <div v-if="prefetchedRoutes.length > 0" class="prefetch-status">
          已预加载的路由: {{ prefetchedRoutes.join(', ') }}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

// 组件懒加载
const HeavyComponent = defineAsyncComponent(() =>
  import('@/components/HeavyComponent.vue')
)

const showHeavyComponent = ref(false)
const heavyComponentLoaded = ref(false)

const loadHeavyComponent = () => {
  showHeavyComponent.value = true
  heavyComponentLoaded.value = true
  console.log('📦 开始加载重组件...')
}

// IntersectionObserver
const vObserve = useIntersectionObserver()
const visibleItems = ref([])

const onElementVisible = (entry, observer) => {
  const index = parseInt(entry.target.dataset.index)
  if (entry.isIntersecting && !visibleItems.value.includes(index)) {
    visibleItems.value.push(index)
    console.log(`👀 元素 ${index} 进入视口`)
  }
}

// 内容预加载
const tabs = [
  { id: 1, name: '标签 1' },
  { id: 2, name: '标签 2' },
  { id: 3, name: '标签 3' },
  { id: 4, name: '标签 4' }
]

const activeTab = ref(1)
const prefetchedTabs = ref([1])
const tabContents = ref({
  1: '这是标签 1 的内容，已经初始加载。'
})

const prefetchTab = async (tabId) => {
  if (prefetchedTabs.value.includes(tabId)) return
  
  console.log(`⚡ 预加载标签 ${tabId}`)
  
  // 模拟异步加载内容
  await new Promise(resolve => setTimeout(resolve, 500))
  
  tabContents.value[tabId] = `这是标签 ${tabId} 的内容，通过预加载获取。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
  prefetchedTabs.value.push(tabId)
}

// 路由预加载
const router = useRouter()
const prefetchedRoutes = ref([])

const prefetchRoute = async (routePath) => {
  if (prefetchedRoutes.value.includes(routePath)) return
  
  console.log(`🛣️ 预加载路由: ${routePath}`)
  
  // 获取路由配置
  const route = router.resolve(routePath)
  if (route && route.matched.length > 0) {
    // 触发路由组件的预加载
    const component = route.matched[0].components.default
    if (typeof component === 'function') {
      await component()
      prefetchedRoutes.value.push(routePath)
      console.log(`✅ 路由 ${routePath} 预加载完成`)
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  margin-bottom: 2rem;
  
  h2 {
    margin-bottom: 1rem;
    color: #2c3e50;
  }
}

.component-lazy-demo {
  .loading-placeholder {
    margin-top: 1.5rem;
    padding: 2rem;
    text-align: center;
    background: #f8f9fa;
    border-radius: 8px;
    
    p {
      margin-top: 1rem;
      color: #666;
    }
  }
}

.observer-demo {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  
  .observer-item {
    margin-bottom: 1rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 2px solid transparent;
    transition: all 0.3s;
    
    &.visible {
      background: #e7f3ff;
      border-color: #667eea;
      
      .observer-content {
        h4 {
          color: #667eea;
        }
      }
    }
    
    .observer-content {
      h4 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
      }
      
      p {
        margin: 0;
        color: #666;
      }
    }
  }
}

.prefetch-demo {
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    
    .tab-button {
      padding: 0.75rem 1.5rem;
      border: 2px solid #e0e0e0;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      
      &:hover {
        border-color: #667eea;
        background: #f8f9fa;
      }
      
      &.active {
        background: #667eea;
        color: white;
        border-color: #667eea;
        
        .prefetch-badge {
          background: rgba(255, 255, 255, 0.3);
        }
      }
      
      .prefetch-badge {
        display: inline-block;
        margin-left: 0.5rem;
        padding: 0.25rem 0.5rem;
        background: #e7f3ff;
        border-radius: 4px;
        font-size: 0.75rem;
        color: #667eea;
      }
    }
  }
  
  .tab-content {
    min-height: 150px;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    
    .content-loaded {
      color: #555;
      line-height: 1.8;
    }
    
    .content-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 150px;
      
      p {
        margin-top: 1rem;
        color: #666;
      }
    }
  }
}

.route-prefetch-demo {
  .route-links {
    display: flex;
    gap: 1rem;
    margin: 1.5rem 0;
    flex-wrap: wrap;
    
    .route-link {
      padding: 1rem 2rem;
      background: white;
      border: 2px solid #667eea;
      border-radius: 8px;
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
      
      &:hover {
        background: #667eea;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }
    }
  }
  
  .prefetch-status {
    margin-top: 1rem;
    padding: 1rem;
    background: #e7f3ff;
    border-radius: 4px;
    color: #667eea;
    font-size: 0.9rem;
  }
}

.tip {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #667eea;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
</style>

