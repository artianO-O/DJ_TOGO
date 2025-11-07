// 图片懒加载指令
export function useLazyLoad() {
  // 创建 IntersectionObserver 实例
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          const src = img.dataset.src
          
          if (src) {
            // 创建临时图片对象用于预加载
            const tempImg = new Image()
            tempImg.onload = () => {
              img.src = src
              img.setAttribute('data-loaded', 'true')
              console.log('🖼️ 图片懒加载:', src)
            }
            tempImg.onerror = () => {
              console.error('❌ 图片加载失败:', src)
              img.src = 'https://via.placeholder.com/400?text=Load+Failed'
            }
            tempImg.src = src
            
            // 停止观察已加载的图片
            observer.unobserve(img)
          }
        }
      })
    },
    {
      rootMargin: '50px', // 提前50px开始加载
      threshold: 0.01
    }
  )

  return {
    mounted(el, binding) {
      // 设置占位图
      el.src = 'https://via.placeholder.com/400?text=Loading...'
      // 将真实图片地址存储在 data-src 属性中
      el.dataset.src = binding.value
      // 开始观察
      observer.observe(el)
    },
    unmounted(el) {
      // 停止观察
      observer.unobserve(el)
    }
  }
}

