import { useState } from 'react'
import { Copy, Check, Download, Eye, Code } from 'lucide-react'

// 简单的 Markdown 解析（实际项目建议用 marked 或 react-markdown）
const parseMarkdown = (text: string): string => {
  let html = text
    // 转义 HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // 代码块
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 标题
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // 粗体和斜体
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // 图片
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // 无序列表
    .replace(/^\s*[-*+]\s+(.*)$/gm, '<li>$1</li>')
    // 有序列表
    .replace(/^\s*\d+\.\s+(.*)$/gm, '<li>$1</li>')
    // 引用
    .replace(/^>\s*(.*$)/gm, '<blockquote>$1</blockquote>')
    // 水平线
    .replace(/^---$/gm, '<hr />')
    // 段落
    .replace(/\n\n/g, '</p><p>')

  // 包装段落
  html = '<p>' + html + '</p>'
  // 清理空段落
  html = html.replace(/<p><\/p>/g, '')
  // 包装列表
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
  // 合并连续的 blockquote
  html = html.replace(/<\/blockquote>\s*<blockquote>/g, '<br />')

  return html
}

const defaultMarkdown = `# DevBox Markdown 预览

这是一个 **Markdown** 预览工具，支持实时预览。

## 功能特性

- 实时预览
- 语法高亮
- 代码块支持
- 一键复制

## 代码示例

\`\`\`javascript
const greeting = "Hello, DevBox!";
console.log(greeting);
\`\`\`

## 引用

> 工欲善其事，必先利其器。

## 链接

[访问 GitHub](https://github.com)

---

*开始编写你的 Markdown 吧！*
`

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(defaultMarkdown)
  const [view, setView] = useState<'split' | 'preview' | 'source'>('split')
  const [copied, setCopied] = useState(false)

  const html = parseMarkdown(markdown)

  // 复制
  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 下载
  const download = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Markdown 预览
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            实时预览 Markdown 渲染效果
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* 视图切换 */}
          <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setView('source')}
              className={`p-2 rounded-md transition-colors ${
                view === 'source'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm'
                  : 'text-slate-500'
              }`}
              title="仅源码"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('split')}
              className={`p-2 rounded-md transition-colors ${
                view === 'split'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm'
                  : 'text-slate-500'
              }`}
              title="分栏视图"
            >
              <div className="flex gap-0.5">
                <div className="w-2 h-4 bg-current rounded-sm" />
                <div className="w-2 h-4 bg-current rounded-sm opacity-50" />
              </div>
            </button>
            <button
              onClick={() => setView('preview')}
              className={`p-2 rounded-md transition-colors ${
                view === 'preview'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm'
                  : 'text-slate-500'
              }`}
              title="仅预览"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          <button onClick={copyMarkdown} className="btn-secondary">
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            复制
          </button>

          <button onClick={download} className="btn-primary">
            <Download className="w-4 h-4" />
            下载
          </button>
        </div>
      </div>

      {/* 编辑器区域 */}
      <div className="flex-1 min-h-0 grid gap-4" style={{
        gridTemplateColumns: view === 'split' ? '1fr 1fr' : '1fr'
      }}>
        {/* 源码编辑器 */}
        {view !== 'preview' && (
          <div className="flex flex-col min-h-0">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Markdown 源码
            </div>
            <textarea
              value={markdown}
              onChange={e => setMarkdown(e.target.value)}
              placeholder="输入 Markdown..."
              className="flex-1 input-base font-mono text-sm resize-none"
              spellCheck={false}
            />
          </div>
        )}

        {/* 预览 */}
        {view !== 'source' && (
          <div className="flex flex-col min-h-0">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              预览
            </div>
            <div 
              className="flex-1 overflow-auto p-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>

      {/* 统计 */}
      <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
        <span>字符数：{markdown.length}</span>
        <span>单词数：{markdown.split(/\s+/).filter(Boolean).length}</span>
        <span>行数：{markdown.split('\n').length}</span>
      </div>

      {/* Prose 样式 */}
      <style>{`
        .prose h1 { font-size: 2em; font-weight: bold; margin: 0.5em 0; }
        .prose h2 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0; }
        .prose h3 { font-size: 1.25em; font-weight: bold; margin: 0.5em 0; }
        .prose p { margin: 1em 0; line-height: 1.7; }
        .prose ul, .prose ol { padding-left: 1.5em; margin: 1em 0; }
        .prose li { margin: 0.5em 0; }
        .prose code { 
          background: #f1f5f9; 
          padding: 0.2em 0.4em; 
          border-radius: 4px; 
          font-size: 0.9em;
        }
        .prose pre { 
          background: #1e293b; 
          color: #e2e8f0; 
          padding: 1em; 
          border-radius: 8px; 
          overflow-x: auto;
          margin: 1em 0;
        }
        .prose pre code { 
          background: none; 
          padding: 0; 
          color: inherit;
        }
        .prose blockquote { 
          border-left: 4px solid #0ea5e9; 
          padding-left: 1em; 
          margin: 1em 0;
          color: #64748b;
          font-style: italic;
        }
        .prose a { color: #0ea5e9; text-decoration: underline; }
        .prose hr { border: none; border-top: 1px solid #e2e8f0; margin: 2em 0; }
        .prose img { max-width: 100%; border-radius: 8px; }
        .dark .prose code { background: #334155; }
        .dark .prose blockquote { color: #94a3b8; }
        .dark .prose hr { border-color: #334155; }
      `}</style>
    </div>
  )
}

