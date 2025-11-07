import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function CoverPage({ data, isActive }) {
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const descRef = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    // 先设置初始状态
    gsap.set([titleRef.current, subtitleRef.current, descRef.current], {
      opacity: 0
    })
  }, [])

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true

    const tl = gsap.timeline({ delay: 0.5 })
    
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out'
    })
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out'
    }, '-=0.6')
    .to(descRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.5')
  }, [isActive])

  return (
    <div className="page cover-page" style={{ background: data.gradient }}>
      <div className="page-content">
        <div className="year-badge" ref={titleRef}>
          {data.year}
        </div>
        <h1 className="cover-title" ref={subtitleRef}>
          {data.title}
        </h1>
        <p className="cover-subtitle" ref={descRef}>
          {data.subtitle}
        </p>
        <div className="swipe-hint">
          <span>向上滑动开始</span>
          <div className="arrow-down">↑</div>
        </div>
      </div>
    </div>
  )
}

export default CoverPage

