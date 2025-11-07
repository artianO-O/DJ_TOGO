// IntersectionObserver 自定义指令
export function useIntersectionObserver() {
  const observers = new Map()

  return {
    mounted(el, binding) {
      const options = binding.value || {}
      const callback = options.callback || (() => {})
      const observerOptions = {
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
        threshold: options.threshold || 0
      }

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          callback(entry, obs)
        })
      }, observerOptions)

      observer.observe(el)
      observers.set(el, observer)
    },
    unmounted(el) {
      const observer = observers.get(el)
      if (observer) {
        observer.unobserve(el)
        observer.disconnect()
        observers.delete(el)
      }
    }
  }
}

