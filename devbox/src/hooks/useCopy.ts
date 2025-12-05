import { useState, useCallback } from 'react'

/**
 * 复制到剪贴板 Hook
 */
export function useCopy(timeout = 2000) {
  const [copied, setCopied] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copy = useCallback(async (text: string, key?: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setCopiedKey(key ?? null)
      
      setTimeout(() => {
        setCopied(false)
        setCopiedKey(null)
      }, timeout)
      
      return true
    } catch (error) {
      console.error('复制失败:', error)
      return false
    }
  }, [timeout])

  return { copied, copiedKey, copy }
}

