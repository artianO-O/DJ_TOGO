import { Search, Moon, Sun, Github, Command } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { useState } from 'react'
import SearchModal from './SearchModal'

export default function Header() {
  const { isDark, toggleTheme } = useThemeStore()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6">
        {/* 搜索 */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors w-80"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm">搜索工具...</span>
          <div className="ml-auto flex items-center gap-1 text-xs">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-600">
              <Command className="w-3 h-3 inline" />
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-600">K</kbd>
          </div>
        </button>

        {/* 右侧操作 */}
        <div className="flex items-center gap-2">
          {/* GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost p-2 rounded-lg"
          >
            <Github className="w-5 h-5" />
          </a>

          {/* 主题切换 */}
          <button
            onClick={toggleTheme}
            className="btn-ghost p-2 rounded-lg"
            title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* 搜索弹窗 */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  )
}

