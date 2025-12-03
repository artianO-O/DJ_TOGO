<template>
  <div class="container">
    <h1 class="page-title">图片优化</h1>
    <p class="page-subtitle">学习各种图片加载和优化技术</p>

    <!-- 响应式图片 -->
    <section class="section card">
      <h2>📱 响应式图片</h2>
      <p>根据不同设备加载不同尺寸的图片</p>

      <div class="responsive-image-demo">
        <img
          :src="getPlaceholderImage(1, 800)"
          :srcset="`
            ${getPlaceholderImage(1, 400)} 400w,
            ${getPlaceholderImage(1, 800)} 800w,
            ${getPlaceholderImage(1, 1200)} 1200w
          `"
          sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
          alt="响应式图片示例"
          class="responsive-image"
        />
        <p class="tip">💡 调整浏览器窗口大小，浏览器会自动选择合适的图片尺寸</p>
      </div>
    </section>

    <!-- WebP 格式 -->
    <section class="section card">
      <h2>🎨 WebP 格式支持</h2>
      <p>WebP 格式可减少 25-35% 的图片体积</p>

      <div class="webp-demo">
        <picture>
          <source
            :srcset="getPlaceholderImage(2, 600, 'webp')"
            type="image/webp"
          />
          <img
            :src="getPlaceholderImage(2, 600)"
            alt="WebP 示例"
            class="webp-image"
          />
        </picture>
        <p class="tip">
          💡 支持 WebP 的浏览器会加载 WebP 格式，否则回退到原格式
        </p>
      </div>
    </section>

    <!-- 懒加载图片 -->
    <section class="section card">
      <h2>🚀 图片懒加载 (Lazy Loading)</h2>
      <p>使用 IntersectionObserver API 实现懒加载，只在图片进入视口时才加载</p>

      <div class="image-grid">
        <div v-for="i in 12" :key="i" class="image-item">
          <img
            v-lazy="getPlaceholderImage(i)"
            :alt="`示例图片 ${i}`"
            class="lazy-image"
          />
          <p>图片 {{ i }}</p>
        </div>
      </div>
    </section>

    <!-- 骨架屏懒加载 -->
    <section class="section card">
      <h2>💀 骨架屏懒加载 (Skeleton Screen)</h2>
      <p>使用骨架屏技术优化加载体验，减少布局偏移，提供更好的视觉反馈</p>
      <p class="tip">
        💡 骨架屏的优势：<br />
        • 减少 Cumulative Layout Shift (CLS)<br />
        • 提供更自然的加载体验<br />
        • 让用户感知内容结构
      </p>

      <div class="image-grid">
        <div v-for="i in 12" :key="`skeleton-${i}`" class="image-item">
          <SkeletonImage
            :src="getPlaceholderImage(i + 20)"
            :alt="`骨架屏图片 ${i}`"
            width="100%"
            height="200px"
            :lazy="true"
          />
          <p>骨架屏图片 {{ i }}</p>
        </div>
      </div>
    </section>

    <!-- 图片预加载 -->
    <section class="section card">
      <h2>⚡ 图片预加载</h2>
      <p>提前加载关键图片，提升用户体验</p>

      <div class="preload-demo">
        <button
          @click="preloadImages"
          class="btn btn-primary"
          :disabled="preloading"
        >
          {{ preloading ? "预加载中..." : "开始预加载" }}
        </button>
        <div v-if="preloadedImages.length > 0" class="preloaded-grid">
          <img
            v-for="(img, index) in preloadedImages"
            :key="index"
            :src="img"
            :alt="`预加载图片 ${index + 1}`"
            class="preloaded-image"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useLazyLoad } from "@/composables/useLazyLoad";
import SkeletonImage from "@/components/SkeletonImage.vue";

// 懒加载指令
const vLazy = useLazyLoad();

// 获取占位图片
const getPlaceholderImage = (id, size = 400, format = "jpg") => {
  return `https://picsum.photos/${size}/${size}?random=${id}`;
};

// 图片预加载
const preloading = ref(false);
const preloadedImages = ref([]);

const preloadImages = async () => {
  preloading.value = true;
  const imageUrls = Array.from({ length: 6 }, (_, i) =>
    getPlaceholderImage(10 + i, 300)
  );

  const promises = imageUrls.map((url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = reject;
      img.src = url;
    });
  });

  try {
    const loadedImages = await Promise.all(promises);
    preloadedImages.value = loadedImages;
    console.log("✅ 图片预加载完成！");
  } catch (error) {
    console.error("❌ 图片预加载失败:", error);
  } finally {
    preloading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.section {
  margin-bottom: 2rem;

  h2 {
    margin-bottom: 1rem;
    color: #2c3e50;
  }

  p {
    color: #666;
    margin-bottom: 1.5rem;
  }
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;

  .image-item {
    text-align: center;

    .lazy-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      background: #f0f0f0;
      transition: opacity 0.3s;

      &[data-loaded="true"] {
        animation: fadeIn 0.5s;
      }
    }

    p {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #666;
    }
  }
}

.responsive-image-demo {
  text-align: center;

  .responsive-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.webp-demo {
  text-align: center;

  .webp-image {
    max-width: 600px;
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.preload-demo {
  text-align: center;

  .preloaded-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;

    .preloaded-image {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 8px;
      animation: fadeIn 0.5s;
    }
  }
}

.tip {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #667eea;
  color: #555;
  font-size: 0.9rem;
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
