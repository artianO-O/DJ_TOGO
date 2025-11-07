import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function TimeDistributionPage({ data, isActive }) {
  const titleRef = useRef(null)
  const periodRefs = useRef([])
  const peakInfoRef = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    gsap.set(titleRef.current, { opacity: 0 })
    gsap.set(periodRefs.current, { opacity: 0 })
    gsap.set(peakInfoRef.current, { opacity: 0 })
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
    
    // 时段卡片依次出现
    periodRefs.current.forEach((period, index) => {
      if (period) {
        tl.to(period, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        }, index * 0.15)
        
        // 进度条动画
        const progressBar = period.querySelector('.time-progress-bar')
        if (progressBar) {
          const targetWidth = progressBar.style.width
          gsap.set(progressBar, { width: 0 })
          tl.to(progressBar, {
            width: targetWidth,
            duration: 1,
            ease: 'power2.out'
          }, `-=${0.5}`)
        }
      }
    })
    
    // 高峰时间信息弹出
    tl.to(peakInfoRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'back.out(1.5)'
    }, '-=0.3')
  }, [isActive])

  return (
    <div className="page time-distribution-page" style={{ background: data.gradient }}>
      <div className="page-content">
        <h2 className="page-title" ref={titleRef}>
          {data.title}
        </h2>
        
        <div className="time-periods">
          {data.data.periods.map((period, index) => (
            <div 
              key={index}
              className="time-period-card"
              ref={el => periodRefs.current[index] = el}
            >
              <div className="time-icon">{period.icon}</div>
              <div className="time-label">{period.time}</div>
              <div className="time-progress">
                <div 
                  className="time-progress-bar"
                  style={{ width: `${period.percentage}%` }}
                />
              </div>
              <div className="time-percentage">{period.percentage}%</div>
              <div className="time-description">{period.description}</div>
            </div>
          ))}
        </div>

        <div className="peak-info" ref={peakInfoRef}>
          <div className="peak-item">
            <span className="peak-icon">⏰</span>
            <span className="peak-label">高峰时段</span>
            <span className="peak-value">{data.data.peakTime}</span>
          </div>
          <div className="peak-item">
            <span className="peak-icon">📅</span>
            <span className="peak-label">最爱听歌日</span>
            <span className="peak-value">{data.data.favoriteDay}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeDistributionPage

