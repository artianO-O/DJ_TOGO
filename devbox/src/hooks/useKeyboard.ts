import { useEffect, useCallback } from 'react'

type KeyboardHandler = (event: KeyboardEvent) => void

interface UseKeyboardOptions {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  alt?: boolean
  preventDefault?: boolean
}

/**
 * 键盘快捷键 Hook
 */
export function useKeyboard(
  options: UseKeyboardOptions | UseKeyboardOptions[],
  handler: KeyboardHandler,
  deps: React.DependencyList = []
) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const optionsArray = Array.isArray(options) ? options : [options]
    
    for (const opt of optionsArray) {
      const matchKey = event.key.toLowerCase() === opt.key.toLowerCase()
      const matchCtrl = opt.ctrl ? event.ctrlKey : !event.ctrlKey
      const matchMeta = opt.meta ? event.metaKey : !event.metaKey
      const matchShift = opt.shift ? event.shiftKey : !event.shiftKey
      const matchAlt = opt.alt ? event.altKey : !event.altKey

      // 支持 Cmd/Ctrl 通用
      const matchModifier = opt.ctrl || opt.meta 
        ? (event.ctrlKey || event.metaKey)
        : true

      if (matchKey && matchModifier && matchShift && matchAlt) {
        if (opt.preventDefault !== false) {
          event.preventDefault()
        }
        handler(event)
        break
      }
    }
  }, [options, handler, ...deps])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

/**
 * 常用快捷键
 */
export const SHORTCUTS = {
  SEARCH: { key: 'k', meta: true },
  SAVE: { key: 's', meta: true },
  COPY: { key: 'c', meta: true },
  PASTE: { key: 'v', meta: true },
  ESCAPE: { key: 'Escape' },
}

