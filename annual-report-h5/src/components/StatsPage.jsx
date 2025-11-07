import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function StatsPage({ data, isActive }) {
  const statsRefs = useRef([])
  const hasAnimated = useRef(false)

  useEffect(() => {
    // 设置初始状态
    gsap.set(statsRefs.current, { opacity: 0, scale: 0 })
  }, [])

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true

    const tl = gsap.timeline({ delay: 0.5 })
    
    statsRefs.current.forEach((stat, index) => {
      if (stat) {
        tl.to(stat, {
          opacity: 1,
          scale: 1,
          y: 0,
          rotation: 0,
          duration: 0.8,
          ease: 'back.out(1.7)'
        }, index * 0.2)
      }
    })
  }, [isActive])

  const stats = [
    { label: '聆听时长', value: data.data.totalHours, unit: '小时' },
    { label: '播放歌曲', value: data.data.totalSongs, unit: '首' },
    { label: '活跃天数', value: data.data.totalDays, unit: '天' },
    { label: '喜爱艺人', value: data.data.totalArtists, unit: '位' }
  ]

  return (
    <div className="page stats-page" style={{ background: data.gradient }}>
      <div className="page-content">
        <h2 className="page-title">{data.title}</h2>
        <p className="page-description">{data.description}</p>
        
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="stat-card"
              ref={el => statsRefs.current[index] = el}
            >
              <div className="stat-value">
                {stat.value}
                <span className="stat-unit">{stat.unit}</span>
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatsPage

