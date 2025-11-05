import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'
import DroneModel from './DroneModel'

function ProductViewer({ product }) {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
      
      {/* 灯光设置 */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* 环境光 */}
      <Environment preset="sunset" />
      
      {/* 3D 模型 */}
      <Suspense fallback={null}>
        <DroneModel product={product} />
        
        {/* 地面阴影 */}
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
      </Suspense>
      
      {/* 控制器 */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={15}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}

export default ProductViewer

