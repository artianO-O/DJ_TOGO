<template>
  <div class="container">
    <h1 class="page-title">代码分割</h1>
    <p class="page-subtitle">优化打包体积和加载速度</p>

    <!-- 动态导入 -->
    <section class="section card">
      <h2>📦 动态导入 (Dynamic Import)</h2>
      <p>使用 import() 语法实现代码按需加载</p>
      
      <div class="dynamic-import-demo">
        <div class="demo-buttons">
          <button @click="loadLodash" class="btn btn-primary" :disabled="lodashLoaded">
            {{ lodashLoaded ? 'Lodash 已加载' : '动态加载 Lodash' }}
          </button>
          <button @click="loadChartLibrary" class="btn btn-primary" :disabled="chartLoaded">
            {{ chartLoaded ? '图表库已加载' : '动态加载图表库' }}
          </button>
        </div>
        
        <div v-if="lodashResult" class="result-box">
          <h4>Lodash 示例结果：</h4>
          <pre>{{ lodashResult }}</pre>
        </div>
        
        <div v-if="chartLoaded" class="result-box">
          <h4>图表库已加载：</h4>
          <p>✅ 图表组件可以使用了</p>
        </div>
      </div>
    </section>

    <!-- 打包分析 -->
    <section class="section card">
      <h2>📊 打包分析</h2>
      <p>使用 rollup-plugin-visualizer 分析打包结果</p>
      
      <div class="bundle-analysis">
        <div class="command-box">
          <h4>运行打包分析命令：</h4>
          <pre><code>npm run analyze</code></pre>
        </div>
        
        <div class="tips">
          <h4>📌 优化建议：</h4>
          <ul>
            <li>✓ 使用路由懒加载，按页面分割代码</li>
            <li>✓ 使用动态导入，按需加载大型库</li>
            <li>✓ 配置 manualChunks 手动分割 vendor 包</li>
            <li>✓ 使用 Tree Shaking 移除未使用的代码</li>
            <li>✓ 检查重复打包的依赖</li>
            <li>✓ 使用 CDN 加载大型公共库</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Chunk 分割策略 -->
    <section class="section card">
      <h2>✂️ Chunk 分割策略</h2>
      <p>合理的分包策略可以提升缓存利用率</p>
      
      <div class="chunk-strategy">
        <div class="strategy-item">
          <h4>🎯 推荐分包策略</h4>
          <div class="code-block">
            <pre><code>// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        // 框架核心
        'vue-vendor': ['vue', 'vue-router', 'pinia'],
        
        // UI 组件库
        'ui-vendor': ['element-plus'],
        
        // 工具库
        'utils': ['lodash-es', 'dayjs', 'axios'],
        
        // 图表库
        'charts': ['echarts'],
      }
    }
  }
}</code></pre>
          </div>
        </div>
        
        <div class="strategy-item">
          <h4>📈 分包收益</h4>
          <div class="benefits">
            <div class="benefit-card">
              <div class="benefit-icon">🚀</div>
              <h5>首屏加载更快</h5>
              <p>只加载必要的代码</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">💾</div>
              <h5>缓存更高效</h5>
              <p>vendor 包长期缓存</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">📦</div>
              <h5>并行加载</h5>
              <p>多个小包并行下载</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tree Shaking -->
    <section class="section card">
      <h2>🌳 Tree Shaking</h2>
      <p>自动移除未使用的代码</p>
      
      <div class="tree-shaking-demo">
        <div class="comparison">
          <div class="comparison-item bad">
            <h4>❌ 不好的做法</h4>
            <pre><code>// 导入整个库
import _ from 'lodash'
const result = _.debounce(fn, 100)

// 会打包整个 lodash（~70KB）</code></pre>
          </div>
          
          <div class="comparison-item good">
            <h4>✅ 好的做法</h4>
            <pre><code>// 按需导入
import { debounce } from 'lodash-es'
const result = debounce(fn, 100)

// 只打包 debounce 函数（~2KB）</code></pre>
          </div>
        </div>
        
        <div class="tree-shaking-tips">
          <h4>💡 Tree Shaking 最佳实践：</h4>
          <ul>
            <li>使用 ES6 模块语法（import/export）</li>
            <li>使用支持 ES Module 的库版本（如 lodash-es）</li>
            <li>避免导入整个库，只导入需要的函数</li>
            <li>确保 package.json 中设置 "sideEffects": false</li>
            <li>使用生产环境构建（自动启用 Tree Shaking）</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 性能指标 -->
    <section class="section card">
      <h2>📈 打包性能指标</h2>
      <div class="performance-metrics">
        <div class="metric-card">
          <div class="metric-value">{{ bundleSize }}</div>
          <div class="metric-label">总包体积</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">{{ chunkCount }}</div>
          <div class="metric-label">代码分块数</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">{{ gzipSize }}</div>
          <div class="metric-label">Gzip 后大小</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 动态导入
const lodashLoaded = ref(false)
const lodashResult = ref('')

const loadLodash = async () => {
  console.log('📦 开始动态加载 Lodash...')
  
  try {
    // 动态导入 lodash-es
    const { debounce, throttle } = await import('lodash-es')
    
    lodashLoaded.value = true
    lodashResult.value = `成功加载 Lodash！
可用函数: debounce, throttle
示例: debounce(fn, 300)`
    
    console.log('✅ Lodash 加载完成')
  } catch (error) {
    console.error('❌ Lodash 加载失败:', error)
    lodashResult.value = '加载失败，请确保已安装 lodash-es'
  }
}

const chartLoaded = ref(false)

const loadChartLibrary = async () => {
  console.log('📦 开始动态加载图表库...')
  
  // 模拟加载图表库
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  chartLoaded.value = true
  console.log('✅ 图表库加载完成')
}

// 性能指标（示例数据）
const bundleSize = ref('245 KB')
const chunkCount = ref('8')
const gzipSize = ref('85 KB')
</script>

<style lang="scss" scoped>
.section {
  margin-bottom: 2rem;
  
  h2 {
    margin-bottom: 1rem;
    color: #2c3e50;
  }
}

.dynamic-import-demo {
  .demo-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }
  
  .result-box {
    margin-top: 1rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    
    h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }
    
    pre {
      margin: 0;
      padding: 1rem;
      background: white;
      border-radius: 4px;
      overflow-x: auto;
      color: #555;
    }
  }
}

.bundle-analysis {
  .command-box {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #2c3e50;
    border-radius: 8px;
    
    h4 {
      margin: 0 0 0.5rem 0;
      color: white;
    }
    
    pre {
      margin: 0;
      
      code {
        color: #4fc08d;
        font-family: 'Courier New', monospace;
      }
    }
  }
  
  .tips {
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    
    h4 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }
    
    ul {
      margin: 0;
      padding-left: 1.5rem;
      
      li {
        margin-bottom: 0.5rem;
        color: #555;
      }
    }
  }
}

.chunk-strategy {
  display: grid;
  gap: 1.5rem;
  
  .strategy-item {
    h4 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }
    
    .code-block {
      background: #2c3e50;
      border-radius: 8px;
      padding: 1rem;
      overflow-x: auto;
      
      pre {
        margin: 0;
        
        code {
          color: #a6e22e;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          line-height: 1.6;
        }
      }
    }
    
    .benefits {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      
      .benefit-card {
        text-align: center;
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 8px;
        
        .benefit-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        h5 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }
        
        p {
          margin: 0;
          font-size: 0.9rem;
          color: #666;
        }
      }
    }
  }
}

.tree-shaking-demo {
  .comparison {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    
    .comparison-item {
      padding: 1rem;
      border-radius: 8px;
      border: 2px solid;
      
      &.bad {
        background: #fff5f5;
        border-color: #fc8181;
        
        h4 {
          color: #c53030;
        }
      }
      
      &.good {
        background: #f0fff4;
        border-color: #68d391;
        
        h4 {
          color: #2f855a;
        }
      }
      
      h4 {
        margin: 0 0 0.5rem 0;
      }
      
      pre {
        margin: 0;
        padding: 1rem;
        background: white;
        border-radius: 4px;
        overflow-x: auto;
        
        code {
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          line-height: 1.6;
          color: #2c3e50;
        }
      }
    }
  }
  
  .tree-shaking-tips {
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    
    h4 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }
    
    ul {
      margin: 0;
      padding-left: 1.5rem;
      
      li {
        margin-bottom: 0.5rem;
        color: #555;
      }
    }
  }
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  
  .metric-card {
    text-align: center;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    color: white;
    
    .metric-value {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    
    .metric-label {
      font-size: 1rem;
      opacity: 0.9;
    }
  }
}
</style>

