import { useState, useMemo } from 'react'
import { Copy, Check, Info } from 'lucide-react'

// 常用正则预设
const presets = [
  { name: '邮箱', pattern: '^[\\w.-]+@[\\w.-]+\\.\\w+$', flags: 'i' },
  { name: '手机号', pattern: '^1[3-9]\\d{9}$', flags: '' },
  { name: 'URL', pattern: '^https?://[\\w.-]+(?:/[\\w.-]*)*/?$', flags: 'i' },
  { name: 'IP 地址', pattern: '^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$', flags: '' },
  { name: '身份证', pattern: '^\\d{17}[\\dXx]$', flags: '' },
  { name: '日期 YYYY-MM-DD', pattern: '^\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])$', flags: '' },
]

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testText, setTestText] = useState('')
  const [copied, setCopied] = useState(false)

  // 正则匹配结果
  const result = useMemo(() => {
    if (!pattern || !testText) {
      return { matches: [], error: null, isValid: false }
    }

    try {
      const regex = new RegExp(pattern, flags)
      const matches: { text: string; index: number; groups?: Record<string, string> }[] = []
      
      if (flags.includes('g')) {
        let match
        while ((match = regex.exec(testText)) !== null) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.groups
          })
          // 防止无限循环
          if (match.index === regex.lastIndex) {
            regex.lastIndex++
          }
        }
      } else {
        const match = regex.exec(testText)
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.groups
          })
        }
      }

      return { matches, error: null, isValid: true }
    } catch (e) {
      return { matches: [], error: (e as Error).message, isValid: false }
    }
  }, [pattern, flags, testText])

  // 高亮匹配文本
  const highlightedText = useMemo(() => {
    if (!result.isValid || result.matches.length === 0) {
      return testText
    }

    let lastIndex = 0
    const parts: JSX.Element[] = []

    result.matches.forEach((match, i) => {
      // 添加未匹配部分
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${i}`}>
            {testText.slice(lastIndex, match.index)}
          </span>
        )
      }
      // 添加匹配部分（高亮）
      parts.push(
        <mark 
          key={`match-${i}`}
          className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded px-0.5"
        >
          {match.text}
        </mark>
      )
      lastIndex = match.index + match.text.length
    })

    // 添加剩余部分
    if (lastIndex < testText.length) {
      parts.push(
        <span key="rest">{testText.slice(lastIndex)}</span>
      )
    }

    return parts
  }, [testText, result])

  // 复制正则
  const copyRegex = async () => {
    await navigator.clipboard.writeText(`/${pattern}/${flags}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 应用预设
  const applyPreset = (preset: typeof presets[0]) => {
    setPattern(preset.pattern)
    setFlags(preset.flags || 'g')
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* 标题 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          正则测试器
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          实时测试正则表达式，查看匹配结果
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 左侧：输入区 */}
        <div className="col-span-2 space-y-4">
          {/* 正则输入 */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                正则表达式
              </label>
              <button
                onClick={copyRegex}
                disabled={!pattern}
                className="btn-ghost text-sm"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                复制
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-lg">/</span>
              <input
                type="text"
                value={pattern}
                onChange={e => setPattern(e.target.value)}
                placeholder="输入正则表达式..."
                className="input-base flex-1 font-mono"
                spellCheck={false}
              />
              <span className="text-slate-400 text-lg">/</span>
              <input
                type="text"
                value={flags}
                onChange={e => setFlags(e.target.value)}
                placeholder="g"
                className="input-base w-16 font-mono text-center"
              />
            </div>
            {result.error && (
              <p className="mt-2 text-sm text-red-500">❌ {result.error}</p>
            )}
          </div>

          {/* 测试文本 */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              测试文本
            </label>
            <textarea
              value={testText}
              onChange={e => setTestText(e.target.value)}
              placeholder="输入要测试的文本..."
              className="input-base font-mono text-sm h-40 resize-none"
              spellCheck={false}
            />
          </div>

          {/* 匹配结果预览 */}
          {testText && (
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  匹配结果预览
                </label>
                <span className="text-sm text-slate-500">
                  {result.matches.length} 个匹配
                </span>
              </div>
              <div className="p-4 rounded-lg bg-white dark:bg-slate-800 font-mono text-sm whitespace-pre-wrap break-all">
                {highlightedText}
              </div>
            </div>
          )}
        </div>

        {/* 右侧：预设和匹配详情 */}
        <div className="space-y-4">
          {/* 常用预设 */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              常用正则
            </h3>
            <div className="space-y-2">
              {presets.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* 匹配详情 */}
          {result.matches.length > 0 && (
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                匹配详情
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {result.matches.map((match, i) => (
                  <div 
                    key={i}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-500">#{i + 1}</span>
                      <span className="text-xs text-slate-400">位置: {match.index}</span>
                    </div>
                    <code className="block font-mono text-brand-600 dark:text-brand-400 break-all">
                      {match.text}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 标志说明 */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">常用标志</p>
                <p><code>g</code> - 全局匹配</p>
                <p><code>i</code> - 忽略大小写</p>
                <p><code>m</code> - 多行模式</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

