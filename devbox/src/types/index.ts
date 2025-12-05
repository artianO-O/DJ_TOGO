// 工具类型定义

export interface Tool {
  name: string
  description: string
  path: string
  icon: string
  keywords: string[]
  category: ToolCategory
}

export type ToolCategory = 'code' | 'convert' | 'text' | 'ai'

export interface ToolCategoryInfo {
  name: string
  icon: string
  tools: Tool[]
}

// 主题
export type Theme = 'light' | 'dark' | 'system'

// 复制状态
export interface CopyState {
  copied: boolean
  key: string | null
}

