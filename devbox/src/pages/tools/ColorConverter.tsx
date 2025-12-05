import { useState, useEffect } from 'react'
import { Copy, Check } from 'lucide-react'

// 颜色转换工具函数
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360
  s /= 100
  l /= 100
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

export default function ColorConverter() {
  const [hex, setHex] = useState('#3B82F6')
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  const [copied, setCopied] = useState<string | null>(null)

  // HEX 变化时更新其他格式
  const handleHexChange = (value: string) => {
    setHex(value)
    const rgbValue = hexToRgb(value)
    if (rgbValue) {
      setRgb(rgbValue)
      setHsl(rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b))
    }
  }

  // RGB 变化时更新其他格式
  const handleRgbChange = (key: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [key]: Math.min(255, Math.max(0, value)) }
    setRgb(newRgb)
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
  }

  // HSL 变化时更新其他格式
  const handleHslChange = (key: 'h' | 's' | 'l', value: number) => {
    const maxValues = { h: 360, s: 100, l: 100 }
    const newHsl = { ...hsl, [key]: Math.min(maxValues[key], Math.max(0, value)) }
    setHsl(newHsl)
    const rgbValue = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    setRgb(rgbValue)
    setHex(rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b))
  }

  // 复制
  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  // 颜色选择器变化
  const handleColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleHexChange(e.target.value)
  }

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`

  return (
    <div className="max-w-3xl mx-auto">
      {/* 标题 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          颜色转换
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          HEX、RGB、HSL 颜色格式互相转换
        </p>
      </div>

      {/* 颜色预览 */}
      <div className="mb-8 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-6">
          {/* 颜色选择器 */}
          <div className="relative">
            <div
              className="w-32 h-32 rounded-xl shadow-lg cursor-pointer overflow-hidden"
              style={{ backgroundColor: hex }}
            >
              <input
                type="color"
                value={hex}
                onChange={handleColorPicker}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* 颜色值 */}
          <div className="flex-1 space-y-3">
            <div className="text-sm text-slate-500">点击左侧色块选择颜色</div>
            <div className="text-3xl font-mono font-bold text-slate-900 dark:text-white">
              {hex.toUpperCase()}
            </div>
            <div className="flex gap-2">
              <span 
                className="px-3 py-1 rounded-full text-sm font-mono"
                style={{ backgroundColor: hex, color: hsl.l > 50 ? '#000' : '#fff' }}
              >
                {rgbString}
              </span>
              <span 
                className="px-3 py-1 rounded-full text-sm font-mono bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                {hslString}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 转换工具 */}
      <div className="space-y-4">
        {/* HEX */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              HEX
            </label>
            <button
              onClick={() => copy(hex, 'hex')}
              className="btn-ghost text-sm"
            >
              {copied === 'hex' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <input
            type="text"
            value={hex}
            onChange={e => handleHexChange(e.target.value)}
            placeholder="#000000"
            className="input-base font-mono"
          />
        </div>

        {/* RGB */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              RGB
            </label>
            <button
              onClick={() => copy(rgbString, 'rgb')}
              className="btn-ghost text-sm"
            >
              {copied === 'rgb' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {(['r', 'g', 'b'] as const).map(key => (
              <div key={key}>
                <label className="block text-xs text-slate-500 mb-1 uppercase">{key}</label>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[key]}
                  onChange={e => handleRgbChange(key, parseInt(e.target.value) || 0)}
                  className="input-base font-mono text-center"
                />
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={rgb[key]}
                  onChange={e => handleRgbChange(key, parseInt(e.target.value))}
                  className="w-full mt-2 accent-brand-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* HSL */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              HSL
            </label>
            <button
              onClick={() => copy(hslString, 'hsl')}
              className="btn-ghost text-sm"
            >
              {copied === 'hsl' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {(['h', 's', 'l'] as const).map(key => {
              const labels = { h: 'Hue', s: 'Saturation', l: 'Lightness' }
              const units = { h: '°', s: '%', l: '%' }
              const maxValues = { h: 360, s: 100, l: 100 }
              return (
                <div key={key}>
                  <label className="block text-xs text-slate-500 mb-1">{labels[key]}</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={maxValues[key]}
                      value={hsl[key]}
                      onChange={e => handleHslChange(key, parseInt(e.target.value) || 0)}
                      className="input-base font-mono text-center pr-6"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {units[key]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={maxValues[key]}
                    value={hsl[key]}
                    onChange={e => handleHslChange(key, parseInt(e.target.value))}
                    className="w-full mt-2 accent-brand-500"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

