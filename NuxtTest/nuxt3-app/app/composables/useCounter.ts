/**
 * 计数器 Composable
 * 演示如何创建可复用的组合函数
 * 
 * 特点：
 * 1. 自动导入 - 无需手动 import
 * 2. 响应式 - 返回 ref 值
 * 3. 可复用 - 多处使用互不影响
 */
export const useCounter = (initialValue: number = 0) => {
  const count = ref(initialValue)

  const increment = () => {
    count.value++
  }

  const decrement = () => {
    count.value--
  }

  const reset = () => {
    count.value = initialValue
  }

  const set = (value: number) => {
    count.value = value
  }

  // 计算属性示例
  const doubled = computed(() => count.value * 2)
  const isPositive = computed(() => count.value > 0)

  return {
    count,
    doubled,
    isPositive,
    increment,
    decrement,
    reset,
    set
  }
}


