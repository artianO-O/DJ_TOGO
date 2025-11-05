import { useState } from 'react'
import ProductViewer from './components/ProductViewer'
import ProductInfo from './components/ProductInfo'
import ProductSelector from './components/ProductSelector'
import { products } from './data/products'
import './styles/App.css'

function App() {
  const [selectedProduct, setSelectedProduct] = useState(products[0])

  return (
    <div className="app">
      {/* 导航栏 */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">DJI</div>
          <div className="nav-links">
            <a href="#products">产品</a>
            <a href="#tech">技术</a>
            <a href="#support">支持</a>
          </div>
        </div>
      </nav>

      {/* 主要内容区 */}
      <main className="main-content">
        {/* 3D 展示区 */}
        <div className="viewer-container">
          <ProductViewer product={selectedProduct} />
          
          {/* 控制提示 */}
          <div className="controls-hint">
            <p>🖱️ 拖动查看 | 滚轮缩放</p>
          </div>
        </div>

        {/* 产品信息区 */}
        <div className="info-container">
          <ProductInfo product={selectedProduct} />
        </div>
      </main>

      {/* 产品选择器 */}
      <ProductSelector 
        products={products}
        selectedProduct={selectedProduct}
        onSelectProduct={setSelectedProduct}
      />
    </div>
  )
}

export default App

