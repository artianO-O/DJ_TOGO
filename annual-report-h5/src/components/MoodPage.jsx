import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function MoodPage({ data, isActive }) {
  const moodRefs = useRef([])
  const hasAnimated = useRef(false)

  useEffect(() => {
    // 设置初始状态
    moodRefs.current.forEach(mood => {
      if (mood) {
        gsap.set(mood, { opacity: 0, x: -50 })
        const bar = mood.querySelector('.mood-bar-fill')
        if (bar) {
          gsap.set(bar, { width: '0%' })
        }
      }
    })
  }, [])

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true

    const tl = gsap.timeline({ delay: 0.5 })

    data.data.moods.forEach((mood, index) => {
      const moodElement = moodRefs.current[index]
      if (moodElement) {
        tl.to(moodElement, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, index * 0.15)
        
        // 动画进度条 - 使用百分比值
        const bar = moodElement.querySelector('.mood-bar-fill')
        if (bar) {
          const targetWidth = `${mood.percentage}%`
          tl.to(bar, {
            width: targetWidth,
            duration: 1.2,
            ease: 'power2.out'
          }, `-=${0.3}`)
        }
      }
    })
  }, [isActive, data.data.moods])

  return (
    <div className="page mood-page" style={{ background: data.gradient }}>
      <div className="page-content">
        <h2 className="page-title">{data.title}</h2>
        <p className="page-description">{data.description}</p>
        
        <div className="mood-list">
          {data.data.moods.map((mood, index) => (
            <div 
              key={index}
              className="mood-item"
              ref={el => moodRefs.current[index] = el}
            >
              <div className="mood-header">
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-name">{mood.name}</span>
                <span className="mood-percentage">{mood.percentage}%</span>
              </div>
              <div className="mood-bar">
                <div 
                  className="mood-bar-fill"
                  style={{ 
                    width: `${mood.percentage}%`,
                    background: mood.color 
                  }}
                />
              </div>
              <div className="mood-songs">{mood.songs} 首歌曲</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MoodPage

