import { useState, useCallback } from 'react'
import { Copy, Check, ArrowDownUp, Trash2 } from 'lucide-react'

export default function Base64Converter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // 编码
  const encode = useCallback((text: string) => {
    try {
      // 处理 Unicode 字符
      const encoded = btoa(unescape(encodeURIComponent(text)))
      setOutput(encoded)
      setError('')
    } catch (e) {
      setError('编码失败：' + (e as Error).message)
      setOutput('')
    }
  }, [])

  // 解码
  const decode = useCallback((text: string) => {
    try {
      const decoded = decodeURIComponent(escape(atob(text)))
      setOutput(decoded)
      setError('')
    } catch (e) {
      setError('解码失败：无效的 Base64 字符串')
      setOutput('')
    }
  }, [])

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setInput(value)
    if (!value.trim()) {
      setOutput('')
      setError('')
      return
    }
    if (mode === 'encode') {
      encode(value)
    } else {
      decode(value)
    }
  }

  // 切换模式
  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode'
    setMode(newMode)
    // 交换输入输出
    const temp = input
    setInput(output)
    setOutput(temp)
    setError('')
  }

  // 复制
  const copyOutput = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 清空
  const clear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Base64 转换
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Base64 编码与解码（支持中文）
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={clear} className="btn-ghost">
            <Trash2 className="w-4 h-4" />
            清空
          </button>
        </div>
      </div>

      {/* 模式切换 */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => {
              setMode('encode')
              if (input) encode(input)
            }}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              mode === 'encode'
                ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            编码
          </button>
          <button
            onClick={() => {
              setMode('decode')
              if (input) decode(input)
            }}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              mode === 'decode'
                ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            解码
          </button>
        </div>
      </div>

      {/* 转换区域 */}
      <div className="space-y-4">
        {/* 输入 */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {mode === 'encode' ? '原始文本' : 'Base64 字符串'}
          </label>
          <textarea
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入 Base64 字符串...'}
            className="input-base font-mono text-sm h-40 resize-none"
            spellCheck={false}
          />
        </div>

        {/* 交换按钮 */}
        <div className="flex justify-center">
          <button
            onClick={toggleMode}
            className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors shadow-lg"
            title="交换输入输出"
          >
            <ArrowDownUp className="w-5 h-5" />
          </button>
        </div>

        {/* 输出 */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {mode === 'encode' ? 'Base64 结果' : '解码结果'}
            </label>
            <button
              onClick={copyOutput}
              disabled={!output}
              className="btn-ghost text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  复制
                </>
              )}
            </button>
          </div>
          
          {error ? (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm">❌ {error}</p>
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="结果将显示在这里..."
              className="input-base font-mono text-sm h-40 resize-none bg-slate-50 dark:bg-slate-900"
              spellCheck={false}
            />
          )}
        </div>

        {/* 统计 */}
        {output && !error && (
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <span>输入长度：{input.length} 字符</span>
            <span>输出长度：{output.length} 字符</span>
            {mode === 'encode' && (
              <span>膨胀率：{((output.length / input.length - 1) * 100).toFixed(1)}%</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

