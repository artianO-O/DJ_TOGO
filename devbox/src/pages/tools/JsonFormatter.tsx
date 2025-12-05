import { useState, useCallback } from 'react'
import { Copy, Check, Trash2, Download, Minimize2, Maximize2 } from 'lucide-react'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [indentSize, setIndentSize] = useState(2)

  // 格式化 JSON
  const formatJson = useCallback(() => {
    try {
      if (!input.trim()) {
        setOutput('')
        setError('')
        return
      }
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, indentSize)
      setOutput(formatted)
      setError('')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }, [input, indentSize])

  // 压缩 JSON
  const minifyJson = useCallback(() => {
    try {
      if (!input.trim()) return
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError('')
    } catch (e) {
      setError((e as Error).message)
    }
  }, [input])

  // 复制结果
  const copyToClipboard = useCallback(async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  // 清空
  const clear = useCallback(() => {
    setInput('')
    setOutput('')
    setError('')
  }, [])

  // 下载
  const download = useCallback(() => {
    if (!output) return
    const blob = new Blob([output], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [output])

  return (
    <div className="h-full flex flex-col">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            JSON 格式化
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            格式化、压缩、验证 JSON 数据
          </p>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          <select
            value={indentSize}
            onChange={e => setIndentSize(Number(e.target.value))}
            className="input-base w-auto"
          >
            <option value={2}>2 空格</option>
            <option value={4}>4 空格</option>
            <option value={0}>Tab</option>
          </select>
          
          <button onClick={formatJson} className="btn-primary">
            <Maximize2 className="w-4 h-4" />
            格式化
          </button>
          
          <button onClick={minifyJson} className="btn-secondary">
            <Minimize2 className="w-4 h-4" />
            压缩
          </button>
          
          <button onClick={clear} className="btn-ghost">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 编辑区域 */}
      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        {/* 输入 */}
        <div className="flex flex-col">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            输入 JSON
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onBlur={formatJson}
            placeholder='粘贴 JSON 数据，例如：{"name": "DevBox"}'
            className="flex-1 input-base font-mono text-sm resize-none"
            spellCheck={false}
          />
        </div>

        {/* 输出 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              结果
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={copyToClipboard}
                disabled={!output}
                className="btn-ghost p-1.5 text-xs"
                title="复制"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={download}
                disabled={!output}
                className="btn-ghost p-1.5 text-xs"
                title="下载"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {error ? (
            <div className="flex-1 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm font-mono">
                ❌ {error}
              </p>
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="格式化结果将显示在这里"
              className="flex-1 input-base font-mono text-sm resize-none bg-slate-50 dark:bg-slate-900"
              spellCheck={false}
            />
          )}
        </div>
      </div>

      {/* 统计信息 */}
      {output && (
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
          <span>原始大小：{new Blob([input]).size} bytes</span>
          <span>结果大小：{new Blob([output]).size} bytes</span>
          {input && output && (
            <span>
              {new Blob([output]).size > new Blob([input]).size ? '增加' : '减少'}：
              {Math.abs(new Blob([output]).size - new Blob([input]).size)} bytes
            </span>
          )}
        </div>
      )}
    </div>
  )
}

