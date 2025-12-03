<template>
  <div 
    ref="containerRef"
    class="skeleton-image" 
    :class="{ 'loaded': loaded }"
  >
    <!-- 骨架屏状态 -->
    <div v-if="!loaded" class="skeleton-content">
      <div class="skeleton-shimmer"></div>
    </div>
    
    <!-- 实际图片 -->
    <img
      v-if="loaded && imageSrc"
      :src="imageSrc"
      :alt="alt"
      class="skeleton-img"
      @load="onImageLoad"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: '200px'
  },
  lazy: {
    type: Boolean,
    default: true
  },
  rootMargin: {
    type: String,
    default: '50px'
  }
})

const containerRef = ref(null)
const loaded = ref(false)
const imageSrc = ref('')
let observer = null

// 预加载图片
const loadImage = (src) => {
  const targetSrc = src || props.src
  if (!targetSrc) return
  
  // 如果已经加载过相同的图片，不需要重新加载
  if (imageSrc.value === targetSrc && loaded.value) {
    return
  }
  
  // 重置加载状态
  loaded.value = false
  
  const img = new Image()
  img.onload = () => {
    imageSrc.value = targetSrc
    loaded.value = true
  }
  img.onerror = () => {
    console.error('图片加载失败:', targetSrc)
    // 可以设置一个错误占位图
    imageSrc.value = 'https://via.placeholder.com/400?text=Load+Failed'
    loaded.value = true
  }
  img.src = targetSrc
}

const onImageLoad = () => {
  // 图片加载完成后的回调
}

const setLoaded = (value) => {
  loaded.value = value
}

// 监听 src 变化
watch(() => props.src, (newSrc) => {
  if (newSrc && !props.lazy) {
    loadImage(newSrc)
  }
}, { immediate: false })

// 懒加载逻辑
onMounted(() => {
  if (!props.lazy && props.src) {
    // 非懒加载模式，直接加载
    loadImage()
  } else if (props.lazy && props.src && containerRef.value) {
    // 懒加载模式，使用 IntersectionObserver
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage()
            // 加载后停止观察
            if (observer && containerRef.value) {
              observer.unobserve(containerRef.value)
            }
          }
        })
      },
      {
        rootMargin: props.rootMargin,
        threshold: 0.01
      }
    )
    
    observer.observe(containerRef.value)
  }
})

onUnmounted(() => {
  if (observer && containerRef.value) {
    observer.unobserve(containerRef.value)
    observer = null
  }
})

// 暴露方法供外部调用
defineExpose({
  loadImage,
  setLoaded
})
</script>

<style lang="scss" scoped>
.skeleton-image {
  position: relative;
  width: v-bind('typeof width === "number" ? width + "px" : width');
  height: v-bind('typeof height === "number" ? height + "px" : height');
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
}

.skeleton-content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

.skeleton-shimmer {
  width: 100%;
  height: 100%;
  animation: shimmer 1.5s infinite;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.skeleton-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.skeleton-image.loaded .skeleton-img {
  opacity: 1;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

