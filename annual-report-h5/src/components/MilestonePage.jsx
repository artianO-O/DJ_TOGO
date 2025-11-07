import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function MilestonePage({ data, isActive }) {
  const titleRef = useRef(null)
  const milestoneRefs = useRef([])
  const hasAnimated = useRef(false)

  useEffect(() => {
    gsap.set(titleRef.current, { opacity: 0 })
    gsap.set(milestoneRefs.current, { opacity: 0 })
  }, [])

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true

    const tl = gsap.timeline({ delay: 0.5 })
    
    // 标题弹性进入
    tl.to(titleRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'back.out(1.7)'
    })
    
    // 里程碑卡片依次飞入
    milestoneRefs.current.forEach((milestone, index) => {
      if (milestone) {
        tl.to(milestone, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, index * 0.2)
      }
    })
  }, [isActive])

  return (
    <div className="page milestone-page" style={{ background: data.gradient }}>
      <div className="page-content">
        <h2 className="page-title" ref={titleRef}>{data.title}</h2>
        
        <div className="milestone-list">
          {data.data.milestones.map((milestone, index) => (
            <div 
              key={index}
              className="milestone-card"
              ref={el => milestoneRefs.current[index] = el}
            >
              <div className="milestone-icon">{milestone.icon}</div>
              <div className="milestone-content">
                <div className="milestone-date">{milestone.date}</div>
                <div className="milestone-event">{milestone.event}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="page-description">{data.description}</p>
      </div>
    </div>
  )
}

export default MilestonePage

