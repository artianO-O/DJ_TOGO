import { useState, useEffect } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('')
  const [dateString, setDateString] = useState('')
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [copied, setCopied] = useState<string | null>(null)

  // 实时更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 时间戳转日期
  const timestampToDate = (ts: string) => {
    const num = Number(ts)
    if (isNaN(num)) return null
    
    // 判断是秒还是毫秒
    const ms = ts.length <= 10 ? num * 1000 : num
    const date = new Date(ms)
    
    if (isNaN(date.getTime())) return null
    return date
  }

  // 日期转时间戳
  const dateToTimestamp = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return null
    return date.getTime()
  }

  // 处理时间戳输入
  const handleTimestampChange = (value: string) => {
    setTimestamp(value)
    const date = timestampToDate(value)
    if (date) {
      setDateString(format(date, "yyyy-MM-dd'T'HH:mm:ss"))
    }
  }

  // 处理日期输入
  const handleDateChange = (value: string) => {
    setDateString(value)
    const ts = dateToTimestamp(value)
    if (ts) {
      setTimestamp(String(ts))
    }
  }

  // 复制
  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  // 使用当前时间
  const useNow = () => {
    const now = Date.now()
    setTimestamp(String(now))
    setDateString(format(now, "yyyy-MM-dd'T'HH:mm:ss"))
  }

  const convertedDate = timestampToDate(timestamp)

  return (
    <div className="max-w-3xl mx-auto">
      {/* 标题 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          时间戳转换
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Unix 时间戳与日期时间互相转换
        </p>
      </div>

      {/* 当前时间 */}
      <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white">
        <div className="text-sm opacity-80 mb-1">当前时间</div>
        <div className="flex items-center justify-between">
          <div className="font-mono text-2xl">{currentTime}</div>
          <div className="text-right">
            <div>{format(currentTime, 'yyyy-MM-dd')}</div>
            <div className="text-2xl font-bold">{format(currentTime, 'HH:mm:ss')}</div>
          </div>
        </div>
      </div>

      {/* 转换工具 */}
      <div className="space-y-6">
        {/* 时间戳输入 */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            时间戳（秒/毫秒）
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={timestamp}
              onChange={e => handleTimestampChange(e.target.value)}
              placeholder="输入时间戳，如 1701388800000"
              className="input-base flex-1 font-mono"
            />
            <button
              onClick={useNow}
              className="btn-secondary"
              title="使用当前时间"
            >
              <RefreshCw className="w-4 h-4" />
              现在
            </button>
            <button
              onClick={() => copy(timestamp, 'ts')}
              disabled={!timestamp}
              className="btn-ghost"
            >
              {copied === 'ts' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* 箭头 */}
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            ⇅
          </div>
        </div>

        {/* 日期输入 */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            日期时间
          </label>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={dateString}
              onChange={e => handleDateChange(e.target.value)}
              className="input-base flex-1"
            />
            <button
              onClick={() => copy(dateString, 'date')}
              disabled={!dateString}
              className="btn-ghost"
            >
              {copied === 'date' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* 转换结果 */}
        {convertedDate && (
          <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
              转换结果
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <ResultItem 
                label="秒级时间戳" 
                value={Math.floor(convertedDate.getTime() / 1000).toString()} 
                onCopy={copy}
                copied={copied}
              />
              <ResultItem 
                label="毫秒级时间戳" 
                value={convertedDate.getTime().toString()} 
                onCopy={copy}
                copied={copied}
              />
              <ResultItem 
                label="ISO 8601" 
                value={convertedDate.toISOString()} 
                onCopy={copy}
                copied={copied}
              />
              <ResultItem 
                label="本地时间" 
                value={format(convertedDate, 'yyyy-MM-dd HH:mm:ss')} 
                onCopy={copy}
                copied={copied}
              />
              <ResultItem 
                label="UTC 时间" 
                value={convertedDate.toUTCString()} 
                onCopy={copy}
                copied={copied}
              />
              <ResultItem 
                label="星期" 
                value={format(convertedDate, 'EEEE')} 
                onCopy={copy}
                copied={copied}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 结果项组件
function ResultItem({ 
  label, 
  value, 
  onCopy,
  copied 
}: { 
  label: string
  value: string
  onCopy: (text: string, key: string) => void
  copied: string | null
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-800">
      <div>
        <div className="text-xs text-slate-500 mb-1">{label}</div>
        <div className="font-mono text-sm text-slate-900 dark:text-white">{value}</div>
      </div>
      <button
        onClick={() => onCopy(value, label)}
        className="btn-ghost p-1"
      >
        {copied === label ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}

