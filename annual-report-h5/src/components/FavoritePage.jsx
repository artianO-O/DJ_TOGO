import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function FavoritePage({ data, isActive }) {
  const cardRef = useRef(null)
  const detailsRef = useRef([])
  const hasAnimated = useRef(false)

  useEffect(() => {
    gsap.set(cardRef.current, { opacity: 0, scale: 0.8 })
    gsap.set(detailsRef.current, { opacity: 0 })
  }, [])

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true

    const tl = gsap.timeline({ delay: 0.5 })
    
    tl.to(cardRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'back.out(1.5)'
    })
    
    detailsRef.current.forEach((detail, index) => {
      if (detail) {
        tl.to(detail, {
          opacity: 1,
          y: 0,
          duration: 0.6
        }, `-=${0.4 - index * 0.1}`)
      }
    })
  }, [isActive])

  return (
    <div className="page favorite-page" style={{ background: data.gradient }}>
      <div className="page-content">
        <h2 className="page-title">{data.title}</h2>
        
        <div className="favorite-card" ref={cardRef}>
          <div className="music-icon">🎵</div>
          <div className="song-info">
            <h3 className="song-name">{data.data.song}</h3>
            <p className="artist-name">{data.data.artist}</p>
            <p className="album-name">{data.data.album}</p>
          </div>
        </div>

        <div className="favorite-stats">
          <div 
            className="favorite-stat"
            ref={el => detailsRef.current[0] = el}
          >
            <div className="stat-number">{data.data.playCount}</div>
            <div className="stat-text">播放次数</div>
          </div>
          <div 
            className="favorite-stat"
            ref={el => detailsRef.current[1] = el}
          >
            <div className="stat-number">{data.data.totalMinutes}</div>
            <div className="stat-text">累计分钟</div>
          </div>
        </div>

        <div className="favorite-details">
          <div className="detail-badge">首次播放: {data.data.firstPlay}</div>
          <div className="detail-badge">最爱月份: {data.data.peakMonth}</div>
        </div>

        <p className="page-description">{data.description}</p>
      </div>
    </div>
  )
}

export default FavoritePage

