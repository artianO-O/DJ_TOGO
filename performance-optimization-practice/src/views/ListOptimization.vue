<template>
  <div class="container">
    <h1 class="page-title">列表优化</h1>
    <p class="page-subtitle">处理大量数据列表的性能优化技术</p>

    <!-- 虚拟滚动 -->
    <section class="section card">
      <h2>🚀 虚拟滚动 (Virtual Scroll)</h2>
      <p>只渲染可视区域的列表项，大幅提升大列表性能</p>
      
      <div class="controls">
        <button @click="toggleVirtualScroll" class="btn btn-primary">
          {{ useVirtual ? '切换到普通列表' : '切换到虚拟滚动' }}
        </button>
        <span class="info">当前渲染: {{ useVirtual ? '虚拟滚动' : '全部渲染' }} ({{ listData.length }} 条数据)</span>
      </div>

      <div class="list-container">
        <VirtualList 
          v-if="useVirtual"
          :items="listData"
          :item-height="60"
          :container-height="400"
        />
        <div v-else class="normal-list">
          <div v-for="item in listData" :key="item.id" class="list-item">
            <div class="item-avatar">{{ item.name.charAt(0) }}</div>
            <div class="item-content">
              <h4>{{ item.name }}</h4>
              <p>{{ item.email }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 无限滚动 -->
    <section class="section card">
      <h2>♾️ 无限滚动 (Infinite Scroll)</h2>
      <p>滚动到底部自动加载更多数据</p>
      
      <div class="infinite-scroll-container" ref="scrollContainer">
        <div 
          v-for="item in infiniteList" 
          :key="item.id" 
          class="scroll-item"
        >
          <img :src="item.image" :alt="item.title" loading="lazy" />
          <div class="scroll-item-content">
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
        </div>
        
        <div v-if="loading" class="loading-more">
          <div class="loading"></div>
          <span>加载中...</span>
        </div>
        
        <div v-if="noMore" class="no-more">
          没有更多数据了
        </div>
      </div>
    </section>

    <!-- 防抖节流 -->
    <section class="section card">
      <h2>⚡ 防抖与节流</h2>
      <p>优化高频事件处理</p>
      
      <div class="debounce-throttle-demo">
        <div class="demo-item">
          <h4>🔍 搜索防抖 (Debounce)</h4>
          <input 
            v-model="searchText"
            @input="handleSearch"
            placeholder="输入搜索内容..."
            class="search-input"
          />
          <p class="result">搜索次数: {{ searchCount }} | 实际执行: {{ actualSearchCount }}</p>
        </div>
        
        <div class="demo-item">
          <h4>📜 滚动节流 (Throttle)</h4>
          <div class="scroll-box" @scroll="handleScroll">
            <div class="scroll-content">
              滚动这个区域查看节流效果
              <div v-for="i in 50" :key="i" class="scroll-line">
                第 {{ i }} 行内容
              </div>
            </div>
          </div>
          <p class="result">滚动次数: {{ scrollCount }} | 实际执行: {{ actualScrollCount }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import VirtualList from '@/components/VirtualList.vue'
import { debounce, throttle } from '@/utils/performance'

// 虚拟滚动
const useVirtual = ref(true)
const listData = ref([])

const toggleVirtualScroll = () => {
  useVirtual.value = !useVirtual.value
}

// 生成列表数据
const generateListData = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    email: `user${i + 1}@example.com`
  }))
}

// 无限滚动
const scrollContainer = ref(null)
const infiniteList = ref([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)

const loadMore = async () => {
  if (loading.value || noMore.value) return
  
  loading.value = true
  
  // 模拟 API 请求
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const newItems = Array.from({ length: 10 }, (_, i) => ({
    id: (page.value - 1) * 10 + i + 1,
    title: `项目 ${(page.value - 1) * 10 + i + 1}`,
    description: `这是第 ${(page.value - 1) * 10 + i + 1} 个项目的描述`,
    image: `https://picsum.photos/100/100?random=${(page.value - 1) * 10 + i + 1}`
  }))
  
  infiniteList.value.push(...newItems)
  loading.value = false
  page.value++
  
  if (page.value > 5) {
    noMore.value = true
  }
}

const handleInfiniteScroll = () => {
  const container = scrollContainer.value
  if (!container) return
  
  const scrollTop = container.scrollTop
  const scrollHeight = container.scrollHeight
  const clientHeight = container.clientHeight
  
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMore()
  }
}

// 防抖节流
const searchText = ref('')
const searchCount = ref(0)
const actualSearchCount = ref(0)

const doSearch = () => {
  actualSearchCount.value++
  console.log('执行搜索:', searchText.value)
}

const handleSearch = debounce(() => {
  searchCount.value++
  doSearch()
}, 500)

const scrollCount = ref(0)
const actualScrollCount = ref(0)

const doScroll = () => {
  actualScrollCount.value++
}

const handleScroll = throttle(() => {
  scrollCount.value++
  doScroll()
}, 200)

onMounted(() => {
  listData.value = generateListData(1000)
  loadMore()
  
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleInfiniteScroll)
  }
})

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleInfiniteScroll)
  }
})
</script>

<style lang="scss" scoped>
.section {
  margin-bottom: 2rem;
  
  h2 {
    margin-bottom: 1rem;
    color: #2c3e50;
  }
}

.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  
  .info {
    color: #666;
    font-size: 0.9rem;
  }
}

.list-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.normal-list {
  max-height: 400px;
  overflow-y: auto;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .item-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 1rem;
  }
  
  .item-content {
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

.infinite-scroll-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  
  .scroll-item {
    display: flex;
    padding: 1rem;
    border-bottom: 1px solid #f0f0f0;
    
    img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
      margin-right: 1rem;
    }
    
    .scroll-item-content {
      flex: 1;
      
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
  
  .loading-more {
    padding: 1.5rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #666;
  }
  
  .no-more {
    padding: 1.5rem;
    text-align: center;
    color: #999;
  }
}

.debounce-throttle-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  .demo-item {
    h4 {
      margin-bottom: 1rem;
      color: #2c3e50;
    }
    
    .search-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 1rem;
      
      &:focus {
        outline: none;
        border-color: #667eea;
      }
    }
    
    .scroll-box {
      height: 200px;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      
      .scroll-content {
        padding: 1rem;
        
        .scroll-line {
          padding: 0.5rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
      }
    }
    
    .result {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 4px;
      font-size: 0.9rem;
      color: #666;
    }
  }
}
</style>

