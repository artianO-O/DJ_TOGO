import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function DiscoveryPage({ data, isActive }) {
  const titleRef = useRef(null)
  const statsRefs = useRef([])
  const discoveryRefs = useRef([])
  const hasAnimated = useRef(false)

  useEffect(() => {
    gsap.set(titleRef.current, { opacity: 0 })
    gsap.set(statsRefs.current, { opacity: 0 })
    gsap.set(discoveryRefs.current, { opacity: 0 })
  }, [])

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true

    const tl = gsap.timeline({ delay: 0.5 })
    
    // 标题出现
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    })
    
    // 统计数字依次出现
    statsRefs.current.forEach((stat, index) => {
      if (stat) {
        tl.to(stat, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)'
        }, index * 0.15)
      }
    })
    
    // 探索类别卡片依次进入
    discoveryRefs.current.forEach((discovery, index) => {
      if (discovery) {
        tl.to(discovery, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        }, index * 0.15 + 0.5)
      }
    })
  }, [isActive])

  const stats = [
    { label: '新艺人', value: data.data.newArtists, icon: '👨‍🎤' },
    { label: '新风格', value: data.data.newGenres, icon: '🎼' },
    { label: '国家', value: data.data.countries, icon: '🌍' },
    { label: '语言', value: data.data.languages, icon: '🗣️' }
  ]

  return (
    <div className="page discovery-page" style={{ background: data.gradient }}>
      <div className="page-content">
        <h2 className="page-title" ref={titleRef}>
          {data.title}
        </h2>
        
        <div className="discovery-stats">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="discovery-stat"
              ref={el => statsRefs.current[index] = el}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="discovery-categories">
          {data.data.discoveries.map((discovery, index) => (
            <div 
              key={index}
              className="discovery-category"
              ref={el => discoveryRefs.current[index] = el}
            >
              <div className="category-icon">{discovery.icon}</div>
              <div className="category-name">{discovery.category}</div>
              <div className="category-count">{discovery.count} 首</div>
            </div>
          ))}
        </div>

        <p className="page-description">{data.description}</p>
      </div>
    </div>
  )
}

export default DiscoveryPage

