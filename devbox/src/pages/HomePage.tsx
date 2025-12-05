import { Link } from 'react-router-dom'
import { 
  Braces, 
  Clock, 
  Binary, 
  Palette, 
  FileText,
  Regex,
  ArrowRight,
  Zap,
  Shield,
  Sparkles
} from 'lucide-react'

// 工具列表
const tools = [
  { 
    name: 'JSON 格式化', 
    description: '格式化、压缩、验证 JSON 数据',
    path: '/json', 
    icon: Braces,
    color: 'from-amber-500 to-orange-500'
  },
  { 
    name: '正则测试器', 
    description: '实时测试正则表达式',
    path: '/regex', 
    icon: Regex,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    name: '时间戳转换', 
    description: '时间戳与日期互转',
    path: '/timestamp', 
    icon: Clock,
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    name: 'Base64 转换', 
    description: 'Base64 编码解码',
    path: '/base64', 
    icon: Binary,
    color: 'from-green-500 to-emerald-500'
  },
  { 
    name: '颜色转换', 
    description: 'HEX、RGB、HSL 互转',
    path: '/color', 
    icon: Palette,
    color: 'from-rose-500 to-red-500'
  },
  { 
    name: 'Markdown 预览', 
    description: '实时预览 Markdown',
    path: '/markdown', 
    icon: FileText,
    color: 'from-indigo-500 to-violet-500'
  },
]

// 特性列表
const features = [
  {
    icon: Zap,
    title: '快速高效',
    description: '所有工具即开即用，无需安装'
  },
  {
    icon: Shield,
    title: '隐私安全',
    description: '数据本地处理，不上传服务器'
  },
  {
    icon: Sparkles,
    title: 'AI 加持',
    description: 'AI 智能助手，提升效率'
  },
]

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero 区域 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          开发者效率工具箱
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          一站式开发工具集合，JSON 格式化、正则测试、编码转换... 
          <br />
          所有你需要的工具，都在这里
        </p>
      </div>

      {/* 特性 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {features.map(feature => {
          const Icon = feature.icon
          return (
            <div 
              key={feature.title}
              className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <div className="p-3 rounded-lg bg-brand-50 dark:bg-brand-900/20">
                <Icon className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* 工具列表 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          全部工具
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(tool => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="group tool-card flex items-center gap-4"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {tool.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

