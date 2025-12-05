import { NavLink } from 'react-router-dom'
import { 
  Braces, 
  Clock, 
  Binary, 
  Palette, 
  FileText,
  Regex,
  Home,
  Sparkles,
  ChevronDown
} from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

// 工具分类
const toolCategories = [
  {
    name: '代码工具',
    icon: Braces,
    tools: [
      { name: 'JSON 格式化', path: '/json', icon: Braces },
      { name: '正则测试器', path: '/regex', icon: Regex },
    ]
  },
  {
    name: '转换工具',
    icon: Binary,
    tools: [
      { name: '时间戳转换', path: '/timestamp', icon: Clock },
      { name: 'Base64 转换', path: '/base64', icon: Binary },
      { name: '颜色转换', path: '/color', icon: Palette },
    ]
  },
  {
    name: '文本工具',
    icon: FileText,
    tools: [
      { name: 'Markdown 预览', path: '/markdown', icon: FileText },
    ]
  },
]

export default function Sidebar() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    toolCategories.map(c => c.name)
  )

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    )
  }

  return (
    <aside className="w-64 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-700">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">DevBox</h1>
          <p className="text-xs text-slate-500">开发者工具箱</p>
        </div>
      </div>

      {/* 导航 */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* 首页 */}
        <NavLink
          to="/"
          className={({ isActive }) => clsx(
            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
            isActive 
              ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
          )}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">首页</span>
        </NavLink>

        {/* 分类 */}
        {toolCategories.map(category => {
          const isExpanded = expandedCategories.includes(category.name)
          const Icon = category.icon
          
          return (
            <div key={category.name}>
              {/* 分类标题 */}
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </div>
                <ChevronDown 
                  className={clsx(
                    'w-4 h-4 transition-transform',
                    isExpanded && 'rotate-180'
                  )} 
                />
              </button>

              {/* 工具列表 */}
              {isExpanded && (
                <div className="ml-4 space-y-1">
                  {category.tools.map(tool => {
                    const ToolIcon = tool.icon
                    return (
                      <NavLink
                        key={tool.path}
                        to={tool.path}
                        className={({ isActive }) => clsx(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                          isActive 
                            ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        )}
                      >
                        <ToolIcon className="w-4 h-4" />
                        <span>{tool.name}</span>
                      </NavLink>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* 底部 */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs text-slate-400 text-center">
          Built with React + TypeScript
        </div>
      </div>
    </aside>
  )
}

