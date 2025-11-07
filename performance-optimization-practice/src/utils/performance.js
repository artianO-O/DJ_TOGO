/**
 * 防抖函数
 * @param {Function} fn 要执行的函数
 * @param {number} delay 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce(fn, delay = 300) {
  let timer = null
  
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn 要执行的函数
 * @param {number} delay 延迟时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(fn, delay = 300) {
  let lastTime = 0
  
  return function (...args) {
    const now = Date.now()
    
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

/**
 * 图片预加载
 * @param {string[]} urls 图片URL数组
 * @returns {Promise<string[]>} 加载完成的图片URL数组
 */
export function preloadImages(urls) {
  const promises = urls.map(url => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(url)
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
      img.src = url
    })
  })
  
  return Promise.all(promises)
}

/**
 * 延迟执行
 * @param {number} ms 延迟时间（毫秒）
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 测量函数执行时间
 * @param {Function} fn 要测量的函数
 * @param {string} label 标签
 * @returns {Function} 包装后的函数
 */
export function measurePerformance(fn, label = 'Function') {
  return async function (...args) {
    const start = performance.now()
    const result = await fn.apply(this, args)
    const end = performance.now()
    console.log(`⏱️ ${label} 执行时间: ${(end - start).toFixed(2)}ms`)
    return result
  }
}

/**
 * 请求动画帧节流
 * @param {Function} fn 要执行的函数
 * @returns {Function} 节流后的函数
 */
export function rafThrottle(fn) {
  let rafId = null
  
  return function (...args) {
    if (rafId) return
    
    rafId = requestAnimationFrame(() => {
      fn.apply(this, args)
      rafId = null
    })
  }
}

/**
 * 获取页面性能指标
 * @returns {Object} 性能指标对象
 */
export function getPerformanceMetrics() {
  if (!window.performance || !window.performance.timing) {
    return null
  }
  
  const timing = window.performance.timing
  const navigation = window.performance.navigation
  
  return {
    // DNS 查询时间
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    // TCP 连接时间
    tcp: timing.connectEnd - timing.connectStart,
    // 请求时间
    request: timing.responseEnd - timing.requestStart,
    // 响应时间
    response: timing.responseEnd - timing.responseStart,
    // DOM 解析时间
    domParse: timing.domInteractive - timing.domLoading,
    // 资源加载时间
    resourceLoad: timing.loadEventStart - timing.domContentLoadedEventEnd,
    // 首次渲染时间
    firstPaint: timing.responseEnd - timing.fetchStart,
    // DOMContentLoaded 时间
    domReady: timing.domContentLoadedEventEnd - timing.fetchStart,
    // 完全加载时间
    loadComplete: timing.loadEventEnd - timing.fetchStart,
    // 重定向次数
    redirectCount: navigation.redirectCount,
    // 页面类型（0: 正常进入, 1: 刷新, 2: 前进后退）
    navigationType: navigation.type
  }
}

/**
 * 打印性能报告
 */
export function logPerformanceReport() {
  const metrics = getPerformanceMetrics()
  
  if (!metrics) {
    console.log('⚠️ 浏览器不支持 Performance API')
    return
  }
  
  console.group('📊 性能分析报告')
  console.log(`DNS 查询: ${metrics.dns}ms`)
  console.log(`TCP 连接: ${metrics.tcp}ms`)
  console.log(`请求时间: ${metrics.request}ms`)
  console.log(`DOM 解析: ${metrics.domParse}ms`)
  console.log(`资源加载: ${metrics.resourceLoad}ms`)
  console.log(`首次渲染: ${metrics.firstPaint}ms`)
  console.log(`DOM Ready: ${metrics.domReady}ms`)
  console.log(`完全加载: ${metrics.loadComplete}ms`)
  console.groupEnd()
  
  return metrics
}

