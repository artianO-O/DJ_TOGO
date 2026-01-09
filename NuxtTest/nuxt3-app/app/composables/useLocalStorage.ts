/**
 * LocalStorage Composable
 * 持久化存储数据，刷新页面后数据依然保留
 * 
 * 使用方式：
 * const theme = useLocalStorage('theme', 'dark')
 * theme.value = 'light' // 自动保存到 localStorage
 */
export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  // 从 localStorage 读取初始值
  const storedValue = ref<T>(defaultValue)

  // 仅在客户端执行
  if (import.meta.client) {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        storedValue.value = JSON.parse(item)
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }

    // 监听变化，自动保存
    watch(
      storedValue,
      (newValue) => {
        try {
          localStorage.setItem(key, JSON.stringify(newValue))
        } catch (error) {
          console.warn(`Error saving to localStorage key "${key}":`, error)
        }
      },
      { deep: true }
    )
  }

  return storedValue
}


