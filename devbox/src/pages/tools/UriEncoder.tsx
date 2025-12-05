import { useState, useCallback } from "react";
import { Copy, Check, ArrowDownUp, Trash2, Info } from "lucide-react";

type EncodeMode = "encodeURI" | "encodeURIComponent";

export default function UriEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeMode, setEncodeMode] = useState<EncodeMode>("encodeURIComponent");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // 编码
  const encode = useCallback(
    (text: string) => {
      try {
        const encoded =
          encodeMode === "encodeURI"
            ? encodeURI(text)
            : encodeURIComponent(text);
        setOutput(encoded);
        setError("");
      } catch (e) {
        setError("编码失败：" + (e as Error).message);
        setOutput("");
      }
    },
    [encodeMode]
  );

  // 解码
  const decode = useCallback(
    (text: string) => {
      try {
        const decoded =
          encodeMode === "encodeURI"
            ? decodeURI(text)
            : decodeURIComponent(text);
        setOutput(decoded);
        setError("");
      } catch (e) {
        setError("解码失败：无效的 URI 编码字符串");
        setOutput("");
      }
    },
    [encodeMode]
  );

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setInput(value);
    if (!value.trim()) {
      setOutput("");
      setError("");
      return;
    }
    if (mode === "encode") {
      encode(value);
    } else {
      decode(value);
    }
  };

  // 切换编码模式时重新处理
  const handleEncodeModeChange = (newMode: EncodeMode) => {
    setEncodeMode(newMode);
    if (input.trim()) {
      if (mode === "encode") {
        const encoded =
          newMode === "encodeURI"
            ? encodeURI(input)
            : encodeURIComponent(input);
        setOutput(encoded);
      } else {
        try {
          const decoded =
            newMode === "encodeURI"
              ? decodeURI(input)
              : decodeURIComponent(input);
          setOutput(decoded);
          setError("");
        } catch {
          setError("解码失败：无效的 URI 编码字符串");
        }
      }
    }
  };

  // 切换编码/解码模式
  const toggleMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    // 交换输入输出
    const temp = input;
    setInput(output);
    setOutput(temp);
    setError("");
  };

  // 复制
  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 清空
  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            URI 编码/解码
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            URL 编码与解码转换工具
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={clear} className="btn-ghost">
            <Trash2 className="w-4 h-4" />
            清空
          </button>
        </div>
      </div>

      {/* 编码模式选择 */}
      <div className="mb-6 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-1">
              编码方式
            </h3>
            <p className="text-sm text-slate-500">
              {encodeMode === "encodeURIComponent"
                ? "编码所有特殊字符（推荐用于查询参数）"
                : "保留 URI 结构字符（如 :/?#[]@）"}
            </p>
          </div>
          <div className="flex items-center gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-700">
            <button
              onClick={() => handleEncodeModeChange("encodeURIComponent")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                encodeMode === "encodeURIComponent"
                  ? "bg-white dark:bg-slate-600 text-brand-600 shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              encodeURIComponent
            </button>
            <button
              onClick={() => handleEncodeModeChange("encodeURI")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                encodeMode === "encodeURI"
                  ? "bg-white dark:bg-slate-600 text-brand-600 shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              encodeURI
            </button>
          </div>
        </div>
      </div>

      {/* 编码/解码切换 */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => {
              setMode("encode");
              if (input) encode(input);
            }}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              mode === "encode"
                ? "bg-white dark:bg-slate-700 text-brand-600 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            编码
          </button>
          <button
            onClick={() => {
              setMode("decode");
              if (input) decode(input);
            }}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              mode === "decode"
                ? "bg-white dark:bg-slate-700 text-brand-600 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
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
            {mode === "encode" ? "原始文本" : "已编码的 URI"}
          </label>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={
              mode === "encode"
                ? "输入要编码的文本，如：你好 世界"
                : "输入已编码的 URI，如：%E4%BD%A0%E5%A5%BD"
            }
            className="input-base font-mono text-sm h-32 resize-none"
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
              {mode === "encode" ? "编码结果" : "解码结果"}
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
              <p className="text-red-600 dark:text-red-400 text-sm">
                ❌ {error}
              </p>
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="结果将显示在这里..."
              className="input-base font-mono text-sm h-32 resize-none bg-slate-50 dark:bg-slate-900"
              spellCheck={false}
            />
          )}
        </div>

        {/* 统计 */}
        {output && !error && (
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <span>输入长度：{input.length} 字符</span>
            <span>输出长度：{output.length} 字符</span>
          </div>
        )}

        {/* 说明 */}
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-2">两种编码方式的区别：</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                    encodeURIComponent
                  </code>
                  ：编码所有特殊字符，适合编码查询参数值
                </li>
                <li>
                  <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                    encodeURI
                  </code>
                  ：保留 URI 结构字符（:/?#[]@!$&'()*+,;=），适合编码完整 URL
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

