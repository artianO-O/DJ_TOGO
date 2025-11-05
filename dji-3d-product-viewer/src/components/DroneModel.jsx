import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cylinder, Sphere } from '@react-three/drei'

// 无人机 3D 模型组件（使用基础几何体组合）
function DroneModel({ product }) {
  const groupRef = useRef()
  const propellerRefs = useRef([])

  // 动画：旋转螺旋桨
  useFrame((state) => {
    if (propellerRefs.current) {
      propellerRefs.current.forEach((propeller) => {
        if (propeller) {
          propeller.rotation.y += 0.3
        }
      })
    }
    
    // 轻微浮动效果
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* 机身 */}
      <Box args={[1.5, 0.3, 1.5]} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color={product.color} roughness={0.3} metalness={0.8} />
      </Box>

      {/* 中心球体 */}
      <Sphere args={[0.4, 32, 32]} position={[0, -0.3, 0]} castShadow>
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
      </Sphere>

      {/* 摄像头 */}
      <Sphere args={[0.25, 32, 32]} position={[0, -0.6, 0]} castShadow>
        <meshStandardMaterial color="#333" roughness={0.1} metalness={0.5} />
      </Sphere>

      {/* 四个机臂和螺旋桨 */}
      {[
        { pos: [1.2, 0, 1.2], rot: [0, 0, 0] },
        { pos: [-1.2, 0, 1.2], rot: [0, 0, 0] },
        { pos: [1.2, 0, -1.2], rot: [0, 0, 0] },
        { pos: [-1.2, 0, -1.2], rot: [0, 0, 0] }
      ].map((arm, index) => (
        <group key={index} position={arm.pos}>
          {/* 机臂 */}
          <Cylinder args={[0.05, 0.05, 1.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <meshStandardMaterial color="#2a2a2a" />
          </Cylinder>

          {/* 电机 */}
          <Cylinder args={[0.15, 0.15, 0.2]} position={[0, 0.2, 0]} castShadow>
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
          </Cylinder>

          {/* 螺旋桨 */}
          <group ref={(el) => (propellerRefs.current[index] = el)} position={[0, 0.35, 0]}>
            <Box args={[1.2, 0.02, 0.15]} castShadow>
              <meshStandardMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.6} 
                roughness={0.1}
              />
            </Box>
            <Box args={[0.15, 0.02, 1.2]} castShadow>
              <meshStandardMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.6}
                roughness={0.1}
              />
            </Box>
          </group>
        </group>
      ))}

      {/* LED 指示灯 */}
      <Sphere args={[0.05, 16, 16]} position={[0.6, 0.2, 0.6]}>
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} />
      </Sphere>
      <Sphere args={[0.05, 16, 16]} position={[-0.6, 0.2, 0.6]}>
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
      </Sphere>
    </group>
  )
}

export default DroneModel

