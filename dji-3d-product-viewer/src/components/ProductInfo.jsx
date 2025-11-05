import { useState } from 'react'

function ProductInfo({ product }) {
  const [selectedSpec, setSelectedSpec] = useState(0)

  return (
    <div className="product-info">
      {/* 产品标题 */}
      <div className="product-header">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-subtitle">{product.subtitle}</p>
      </div>

      {/* 产品描述 */}
      <div className="product-description">
        <p>{product.description}</p>
      </div>

      {/* 核心参数 */}
      <div className="product-specs">
        <h3>核心参数</h3>
        <div className="specs-grid">
          {product.specs.map((spec, index) => (
            <div 
              key={index} 
              className={`spec-item ${selectedSpec === index ? 'active' : ''}`}
              onClick={() => setSelectedSpec(index)}
            >
              <div className="spec-icon">{spec.icon}</div>
              <div className="spec-value">{spec.value}</div>
              <div className="spec-label">{spec.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 特性列表 */}
      <div className="product-features">
        <h3>核心特性</h3>
        <ul className="features-list">
          {product.features.map((feature, index) => (
            <li key={index}>
              <span className="feature-check">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* 价格和购买按钮 */}
      <div className="product-actions">
        <div className="price-section">
          <span className="price-label">起售价</span>
          <span className="price-value">¥ {product.price.toLocaleString()}</span>
        </div>
        <div className="action-buttons">
          <button className="btn-primary">立即购买</button>
          <button className="btn-secondary">了解更多</button>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo

