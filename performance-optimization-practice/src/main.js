import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/index.scss'

// 性能监控
if (typeof window !== 'undefined' && window.PerformanceObserver) {
  // 监听 LCP (最大内容绘制)
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries()
    const lastEntry = entries[entries.length - 1]
    console.log('📊 LCP:', lastEntry.renderTime || lastEntry.loadTime, 'ms')
  })
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

  // 监听 FID (首次输入延迟)
  const fidObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries()
    entries.forEach((entry) => {
      console.log('📊 FID:', entry.processingStart - entry.startTime, 'ms')
    })
  })
  fidObserver.observe({ entryTypes: ['first-input'] })

  // 监听 CLS (累积布局偏移)
  let clsScore = 0
  const clsObserver = new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach((entry) => {
      if (!entry.hadRecentInput) {
        clsScore += entry.value
        console.log('📊 CLS:', clsScore.toFixed(4))
      }
    })
  })
  clsObserver.observe({ entryTypes: ['layout-shift'] })
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

