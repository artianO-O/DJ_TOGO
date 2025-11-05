# React + Three.js 3个月学习路线
> 面向Vue3工程师的React和Three.js学习计划

## 📅 学习时间规划：3个月

---

## 第一个月：React 基础强化

### Week 1-2: React 核心概念
**学习目标：掌握React基础，建立与Vue3的对比认知**

#### 学习内容
1. **React 基础**
   - JSX 语法（对比Vue template）
   - 组件化思想（Class组件 vs 函数组件）
   - Props 和 State
   - 事件处理
   - 条件渲染和列表渲染

2. **React Hooks（重点）**
   - useState（对比Vue的ref/reactive）
   - useEffect（对比Vue的watch/watchEffect）
   - useContext（对比Vue的provide/inject）
   - useRef（对比Vue的ref）
   - useMemo 和 useCallback（对比Vue的computed）
   - 自定义Hooks（对比Vue的composables）

#### 实践项目
- **Todo List**：完整的CRUD操作
- **计数器应用**：理解状态管理
- **简单的表单**：表单处理和验证

#### 学习资源
- 官方文档：https://react.dev/
- React Hooks 完全指南（推荐阅读）
- 视频：React 18 完全指南

### Week 3-4: React 进阶与工程化

#### 学习内容
1. **状态管理**
   - Context API
   - Redux Toolkit（现代Redux）
   - Zustand（轻量级状态管理）
   - 对比Vue的Pinia

2. **路由管理**
   - React Router v6
   - 动态路由
   - 路由守卫（对比Vue Router）
   - 嵌套路由

3. **工程化工具**
   - Vite + React
   - Create React App
   - TypeScript + React
   - ESLint 和 Prettier 配置

#### 实践项目
- **个人博客系统**：包含路由、状态管理
- **购物车应用**：复杂状态管理实践
- **用户管理系统**：CRUD + 路由 + 状态管理

---

## 第二个月：React 深入 + Three.js 入门

### Week 5-6: React 性能优化与高级特性

#### 学习内容
1. **性能优化**
   - React.memo
   - useMemo 和 useCallback 深度使用
   - 懒加载（React.lazy, Suspense）
   - 虚拟列表
   - Code Splitting

2. **高级 Hooks**
   - useReducer（复杂状态管理）
   - useLayoutEffect
   - useImperativeHandle
   - useTransition 和 useDeferredValue（React 18新特性）

3. **常用UI库**
   - Ant Design（对比Element Plus）
   - Material-UI
   - Tailwind CSS + React

#### 实践项目
- **React Admin Dashboard**：复杂的企业级应用
- **实时聊天应用**：WebSocket + React
- **数据可视化面板**：ECharts/D3.js + React

### Week 7-8: Three.js 基础

#### 学习内容
1. **Three.js 核心概念**
   - 场景（Scene）
   - 相机（Camera）
   - 渲染器（Renderer）
   - 几何体（Geometry）
   - 材质（Material）
   - 光源（Light）
   - 动画循环

2. **基础实践**
   - 创建第一个3D场景
   - 基本几何体绘制
   - 材质和纹理
   - 光照系统
   - 相机控制（OrbitControls）

3. **坐标系统与变换**
   - 位置、旋转、缩放
   - 世界坐标与局部坐标
   - 向量和矩阵基础

#### 实践项目
- **3D几何体展示**：展示不同的几何体和材质
- **太阳系模拟**：理解坐标系统和动画
- **3D产品展示**：模型加载和交互

#### 学习资源
- Three.js 官方文档：https://threejs.org/
- Three.js Journey（强烈推荐）
- 《Three.js开发指南》

---

## 第三个月：Three.js 进阶 + React Three Fiber

### Week 9-10: Three.js 进阶技术

#### 学习内容
1. **模型加载与处理**
   - GLTF/GLB 模型加载
   - FBX、OBJ 格式
   - Draco 压缩
   - 模型优化技巧

2. **高级渲染技术**
   - 阴影和反射
   - 后期处理（Post-processing）
   - 粒子系统
   - 着色器基础（Shader）
   - GLSL 入门

3. **性能优化**
   - LOD（细节层次）
   - 实例化（Instancing）
   - 纹理优化
   - 几何体合并
   - 帧率监控

#### 实践项目
- **3D游戏场景**：完整的游戏环境
- **粒子特效系统**：烟雾、火焰、雪花等
- **shader艺术作品**：创意着色器编程

### Week 11-12: React Three Fiber 综合实战

#### 学习内容
1. **React Three Fiber（R3F）**
   - R3F 基础概念
   - 声明式3D编程
   - Hooks（useFrame, useThree等）
   - 与React生态集成

2. **Drei 辅助库**
   - 常用辅助组件
   - 控制器和辅助工具
   - 材质和效果预设

3. **性能与交互**
   - 物理引擎（Cannon.js/Rapier）
   - 碰撞检测
   - 鼠标交互和拾取
   - VR/AR 初探

#### 综合实战项目（选择1-2个完成）
1. **3D产品配置器**
   - 实时预览产品
   - 材质切换
   - 颜色定制
   - 导出截图

2. **3D数据可视化平台**
   - 3D图表
   - 地球数据可视化
   - 实时数据更新

3. **虚拟展厅**
   - 场景漫游
   - 产品展示
   - 交互式介绍

4. **3D游戏Demo**
   - 角色控制
   - 物理交互
   - 简单AI

---

## 🏆 优秀开源项目推荐

### React 项目

#### 1. **Ant Design Pro**
- GitHub: https://github.com/ant-design/ant-design-pro
- 描述：企业级中后台前端解决方案
- 学习点：最佳实践、项目架构、权限管理

#### 2. **Next.js**
- GitHub: https://github.com/vercel/next.js
- 描述：React服务端渲染框架
- 学习点：SSR、SSG、路由、性能优化

#### 3. **React Admin**
- GitHub: https://github.com/marmelab/react-admin
- 描述：B端管理系统框架
- 学习点：复杂表单、数据管理、权限系统

#### 4. **Jira Clone**
- GitHub: https://github.com/oldboyxx/jira_clone
- 描述：使用React构建的Jira克隆
- 学习点：拖拽、状态管理、团队协作功能

#### 5. **Excalidraw**
- GitHub: https://github.com/excalidraw/excalidraw
- 描述：虚拟白板绘图工具
- 学习点：Canvas操作、实时协作、性能优化

### Three.js / React Three Fiber 项目

#### 1. **Three.js Examples**
- 地址: https://threejs.org/examples/
- 描述：Three.js官方示例集合
- 学习点：各种效果和技术的实现

#### 2. **Bruno Simon Portfolio**
- 网站: https://bruno-simon.com/
- GitHub: https://github.com/brunosimon/folio-2019
- 描述：交互式3D个人网站
- 学习点：创意交互、物理引擎、游戏化设计

#### 3. **React Three Fiber Examples**
- 网站: https://docs.pmnd.rs/react-three-fiber/examples
- 描述：R3F官方示例
- 学习点：声明式3D、React集成

#### 4. **Threejs Journey Projects**
- 网站: https://threejs-journey.com/
- 描述：Three.js课程项目集合
- 学习点：系统学习路径、实践案例

#### 5. **Sketchfab**
- 网站: https://sketchfab.com/
- 描述：3D模型分享平台（可下载模型）
- 学习点：模型资源、展示效果

#### 6. **Lusion**
- 网站: https://lusion.co/
- 描述：创意3D网站作品
- 学习点：高端视觉效果、用户体验

#### 7. **Three.js + React Examples by Pmndrs**
- GitHub: https://github.com/pmndrs
- 描述：强大的Three.js生态库合集
- 学习点：Drei、Zustand、React-Spring等

### 大疆相关技术栈参考项目

#### 1. **WebGL Earth**
- GitHub: https://github.com/webglearth/webglearth2
- 描述：3D地球可视化
- 学习点：地理数据可视化、大规模渲染

#### 2. **Cesium.js**
- GitHub: https://github.com/CesiumGS/cesium
- 描述：3D地球和地图引擎
- 学习点：GIS、航拍数据可视化

#### 3. **AFrame**
- GitHub: https://github.com/aframevr/aframe
- 描述：WebVR/WebXR框架
- 学习点：VR/AR技术、沉浸式体验

---

## 📚 推荐学习资源

### 在线课程
1. **React**
   - React官方教程（免费）
   - Scrimba React Course（免费）
   - Epic React by Kent C. Dodds（付费，高质量）

2. **Three.js**
   - Three.js Journey（强烈推荐，付费）
   - Three.js官方文档和示例（免费）
   - Udemy Three.js课程（付费）

### 书籍
1. **React**
   - 《React进阶之路》
   - 《深入浅出React和Redux》
   - 《React设计模式与最佳实践》

2. **Three.js**
   - 《Three.js开发指南》
   - 《WebGL编程指南》
   - 《交互式计算机图形学》

### 社区和博客
1. **React**
   - React官方博客
   - Overreacted（Dan Abramov的博客）
   - Kent C. Dodds博客

2. **Three.js**
   - Three.js Discourse
   - Codrops WebGL教程
   - WebGL Fundamentals

---

## 🎯 大疆面试准备建议

### 技术重点
1. **React核心**
   - Hooks深度理解
   - 性能优化实践
   - 组件设计模式
   - TypeScript集成

2. **Three.js核心**
   - 3D场景构建
   - 性能优化（大疆产品需要流畅体验）
   - 模型加载和处理
   - 交互设计

3. **工程能力**
   - 项目架构设计
   - 代码质量和规范
   - 性能监控和优化
   - 团队协作经验

### 项目准备
**建议准备1-2个完整的项目**：
1. **3D产品展示平台**（类似大疆官网的产品展示）
   - React + Three.js
   - 产品360度查看
   - 特性动画展示
   - 响应式设计

2. **无人机飞行模拟器**
   - 3D场景
   - 物理模拟
   - 实时控制
   - 数据可视化

### 面试常见问题
1. React相关
   - React Fiber架构
   - Hooks实现原理
   - 虚拟DOM diff算法
   - React vs Vue的区别

2. Three.js相关
   - 3D渲染管线
   - 性能优化方案
   - WebGL基础原理
   - 大规模场景渲染

---

## ⏰ 每周学习时间建议

- **工作日**：每天 2-3 小时
  - 晚上：理论学习 + 代码练习
  
- **周末**：每天 4-6 小时
  - 上午：深度学习新知识
  - 下午：项目实战
  
- **总计**：每周约 20-25 小时

---

## ✅ 学习检查清单

### React部分
- [ ] 能熟练使用Hooks编写组件
- [ ] 理解React渲染原理和优化策略
- [ ] 掌握状态管理（Redux/Zustand）
- [ ] 熟悉React Router
- [ ] 能使用TypeScript + React
- [ ] 完成至少3个React项目

### Three.js部分
- [ ] 理解Three.js核心概念
- [ ] 能独立构建3D场景
- [ ] 掌握模型加载和处理
- [ ] 了解着色器基础
- [ ] 掌握性能优化技巧
- [ ] 完成至少2个Three.js项目

### 综合能力
- [ ] React + Three.js集成
- [ ] 完成1个综合项目
- [ ] 代码托管在GitHub
- [ ] 有线上可访问的Demo
- [ ] 准备好技术分享PPT

---

## 🚀 加分项

1. **TypeScript**：大疆团队广泛使用TS
2. **性能优化经验**：尤其是3D性能优化
3. **开源贡献**：参与React/Three.js相关开源项目
4. **技术博客**：记录学习过程和技术总结
5. **英文能力**：阅读英文文档和技术文章

---

## 💡 学习建议

1. **从Vue到React的思维转换**
   - Vue是模板驱动，React是数据驱动
   - Vue的Options API vs React的Hooks
   - 响应式原理的差异

2. **动手实践**
   - 不要只看教程，一定要动手写
   - 每个知识点都配合小项目练习
   - 代码提交到GitHub

3. **对比学习**
   - 利用Vue3经验快速理解React概念
   - 记录两者的异同点
   - 思考不同设计理念的优劣

4. **项目驱动**
   - 以项目为导向学习
   - 遇到问题再深入研究
   - 关注实际应用场景

5. **保持节奏**
   - 3个月时间紧凑但可行
   - 坚持每天学习
   - 定期回顾和总结

---

## 📌 学习进度追踪

建议创建一个学习日志，记录：
- 每日学习内容
- 遇到的问题和解决方案
- 项目进度
- 代码仓库链接
- 学习心得

---

**祝你学习顺利，面试成功！加油！🎉**

如果有任何问题，随时交流讨论！

