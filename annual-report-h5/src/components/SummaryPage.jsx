import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function SummaryPage({ data, isActive }) {
  const itemRefs = useRef([])
  const quoteRef = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    gsap.set(itemRefs.current, { opacity: 0 })
    gsap.set(quoteRef.current, { opacity: 0 })
  }, [])

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true

    const tl = gsap.timeline({ delay: 0.5 })
    
    itemRefs.current.forEach((item, index) => {
      if (item) {
        tl.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, index * 0.1)
      }
    })

    tl.to(quoteRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.5)'
    }, '-=0.2')
  }, [isActive])

  return (
    <div className="page summary-page" style={{ background: data.gradient }}>
      <div className="page-content">
        <h2 className="page-title">{data.title}</h2>
        
        <div className="highlights-list">
          {data.data.highlights.map((highlight, index) => (
            <div 
              key={index}
              className="highlight-item"
              ref={el => itemRefs.current[index] = el}
            >
              <span className="highlight-icon">✨</span>
              <span className="highlight-text">{highlight}</span>
            </div>
          ))}
        </div>

        <div className="summary-quote" ref={quoteRef}>
          <div className="quote-mark">"</div>
          <p className="quote-text">{data.data.quote}</p>
          <div className="quote-mark closing">"</div>
        </div>

        <div className="achievement-badge">
          <div className="achievement-icon">🏆</div>
          <div className="achievement-title">{data.data.achievement}</div>
          <div className="achievement-level">{data.data.level}</div>
        </div>

        <p className="page-description">{data.description}</p>

        <button className="share-button">
          分享我的年度报告
        </button>
      </div>
    </div>
  )
}

export default SummaryPage

