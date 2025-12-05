import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import JsonFormatter from "./pages/tools/JsonFormatter";
import TimestampConverter from "./pages/tools/TimestampConverter";
import Base64Converter from "./pages/tools/Base64Converter";
import RegexTester from "./pages/tools/RegexTester";
import ColorConverter from "./pages/tools/ColorConverter";
import MarkdownPreview from "./pages/tools/MarkdownPreview";
import UriEncoder from "./pages/tools/UriEncoder";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        {/* 代码工具 */}
        <Route path="json" element={<JsonFormatter />} />
        <Route path="regex" element={<RegexTester />} />
        {/* 转换工具 */}
        <Route path="timestamp" element={<TimestampConverter />} />
        <Route path="base64" element={<Base64Converter />} />
        <Route path="uri" element={<UriEncoder />} />
        <Route path="color" element={<ColorConverter />} />
        {/* 文本工具 */}
        <Route path="markdown" element={<MarkdownPreview />} />
      </Route>
    </Routes>
  );
}

export default App;
