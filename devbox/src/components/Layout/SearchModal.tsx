import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Braces, Clock, Binary, Palette, FileText, Regex } from 'lucide-react'
import clsx from 'clsx'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

// 所有工具列表
const allTools = [
  { name: 'JSON 格式化', path: '/json', icon: Braces, keywords: ['json', '格式化', '压缩'] },
  { name: '正则测试器', path: '/regex', icon: Regex, keywords: ['正则', 'regex', '匹配'] },
  { name: '时间戳转换', path: '/timestamp', icon: Clock, keywords: ['时间', '时间戳', 'timestamp'] },
  { name: 'Base64 转换', path: '/base64', icon: Binary, keywords: ['base64', '编码', '解码'] },
  { name: '颜色转换', path: '/color', icon: Palette, keywords: ['颜色', 'color', 'hex', 'rgb'] },
  { name: 'Markdown 预览', path: '/markdown', icon: FileText, keywords: ['markdown', 'md', '预览'] },
]

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  // 过滤工具
  const filteredTools = useMemo(() => {
    if (!query) return allTools
    const lowerQuery = query.toLowerCase()
    return allTools.filter(tool => 
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.keywords.some(k => k.includes(lowerQuery))
    )
  }, [query])

  // 键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K 打开搜索
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        // 这里需要在父组件处理
      }

      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, filteredTools.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
        navigate(filteredTools[selectedIndex].path)
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredTools, selectedIndex, navigate, onClose])

  // 重置状态
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={onClose}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* 搜索框 */}
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 输入框 */}
        <div className="flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-700">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="搜索工具..."
            className="flex-1 py-4 bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
            autoFocus
          />
          <kbd className="px-2 py-1 text-xs rounded bg-slate-100 dark:bg-slate-700 text-slate-500">
            ESC
          </kbd>
        </div>

        {/* 搜索结果 */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredTools.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              没有找到相关工具
            </div>
          ) : (
            filteredTools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <button
                  key={tool.path}
                  onClick={() => {
                    navigate(tool.path)
                    onClose()
                  }}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    index === selectedIndex
                      ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tool.name}</span>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

