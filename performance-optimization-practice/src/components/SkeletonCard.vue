<template>
  <div class="skeleton-card" :class="{ 'loaded': loaded }">
    <!-- 骨架屏状态 -->
    <div v-if="!loaded" class="skeleton-wrapper">
      <div class="skeleton-header">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-text-group">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-line skeleton-subtitle"></div>
        </div>
      </div>
      <div class="skeleton-content">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line skeleton-short"></div>
      </div>
      <div class="skeleton-footer">
        <div class="skeleton-button"></div>
        <div class="skeleton-button"></div>
      </div>
      <div class="skeleton-shimmer"></div>
    </div>
    
    <!-- 实际内容 -->
    <div v-if="loaded" class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  delay: {
    type: Number,
    default: 0
  },
  autoLoad: {
    type: Boolean,
    default: true
  }
})

const loaded = ref(false)

const loadContent = () => {
  if (props.delay > 0) {
    setTimeout(() => {
      loaded.value = true
    }, props.delay)
  } else {
    loaded.value = true
  }
}

onMounted(() => {
  if (props.autoLoad) {
    loadContent()
  }
})

// 暴露方法供外部调用
defineExpose({
  load: loadContent,
  setLoaded: (value) => {
    loaded.value = value
  }
})
</script>

<style lang="scss" scoped>
.skeleton-card {
  position: relative;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 200px;
}

.skeleton-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.skeleton-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e0e0e0;
  flex-shrink: 0;
}

.skeleton-text-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-content {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-line {
  height: 16px;
  background: #e0e0e0;
  border-radius: 4px;
  width: 100%;
  
  &.skeleton-title {
    width: 60%;
    height: 20px;
  }
  
  &.skeleton-subtitle {
    width: 40%;
    height: 14px;
  }
  
  &.skeleton-short {
    width: 70%;
  }
}

.skeleton-footer {
  display: flex;
  gap: 1rem;
}

.skeleton-button {
  width: 80px;
  height: 36px;
  background: #e0e0e0;
  border-radius: 4px;
}

.skeleton-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.card-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>





