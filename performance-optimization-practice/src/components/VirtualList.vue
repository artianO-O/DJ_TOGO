<template>
  <div 
    class="virtual-list-container" 
    :style="{ height: containerHeight + 'px' }"
    @scroll="handleScroll"
    ref="containerRef"
  >
    <div 
      class="virtual-list-phantom" 
      :style="{ height: totalHeight + 'px' }"
    ></div>
    
    <div 
      class="virtual-list-content"
      :style="{ transform: `translateY(${offsetY}px)` }"
    >
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="virtual-list-item"
        :style="{ height: itemHeight + 'px' }"
      >
        <div class="item-avatar">{{ item.name.charAt(0) }}</div>
        <div class="item-content">
          <h4>{{ item.name }}</h4>
          <p>{{ item.email }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  itemHeight: {
    type: Number,
    required: true
  },
  containerHeight: {
    type: Number,
    required: true
  }
})

const containerRef = ref(null)
const scrollTop = ref(0)

// 计算总高度
const totalHeight = computed(() => props.items.length * props.itemHeight)

// 计算可见区域可以显示多少项
const visibleCount = computed(() => Math.ceil(props.containerHeight / props.itemHeight))

// 计算开始索引（包含缓冲区）
const startIndex = computed(() => {
  const index = Math.floor(scrollTop.value / props.itemHeight)
  return Math.max(0, index - 2) // 上方缓冲2个
})

// 计算结束索引（包含缓冲区）
const endIndex = computed(() => {
  const index = startIndex.value + visibleCount.value
  return Math.min(props.items.length, index + 2) // 下方缓冲2个
})

// 获取可见的项目
const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value)
})

// 计算偏移量
const offsetY = computed(() => startIndex.value * props.itemHeight)

// 处理滚动
const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}

onMounted(() => {
  console.log('📊 虚拟滚动已初始化')
  console.log(`总项目数: ${props.items.length}`)
  console.log(`可见项目数: ${visibleCount.value}`)
})
</script>

<style lang="scss" scoped>
.virtual-list-container {
  position: relative;
  overflow-y: auto;
  background: white;
}

.virtual-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.virtual-list-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}

.virtual-list-item {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid #f0f0f0;
  
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
    flex-shrink: 0;
  }
  
  .item-content {
    flex: 1;
    min-width: 0;
    
    h4 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
      font-size: 1rem;
    }
    
    p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>

