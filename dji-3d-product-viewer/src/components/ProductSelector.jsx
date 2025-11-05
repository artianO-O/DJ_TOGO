function ProductSelector({ products, selectedProduct, onSelectProduct }) {
  return (
    <div className="product-selector">
      <div className="selector-title">选择产品</div>
      <div className="selector-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className={`selector-item ${selectedProduct.id === product.id ? 'active' : ''}`}
            onClick={() => onSelectProduct(product)}
          >
            <div 
              className="selector-color" 
              style={{ backgroundColor: product.color }}
            />
            <div className="selector-name">{product.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductSelector

