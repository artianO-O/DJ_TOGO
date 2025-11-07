import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function TopArtistsPage({ data, isActive }) {
  const titleRef = useRef(null)
  const artistRefs = useRef([])
  const hasAnimated = useRef(false)

  useEffect(() => {
    gsap.set(titleRef.current, { opacity: 0 })
    gsap.set(artistRefs.current, { opacity: 0 })
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
    
    // 艺人卡片依次进入
    artistRefs.current.forEach((artist, index) => {
      if (artist) {
        tl.to(artist, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out'
        }, index * 0.15)
      }
    })
  }, [isActive])

  return (
    <div className="page top-artists-page" style={{ background: data.gradient }}>
      <div className="page-content">
        <h2 className="page-title" ref={titleRef}>
          {data.title}
        </h2>
        
        <div className="artists-list">
          {data.data.artists.map((artist, index) => (
            <div 
              key={index}
              className="artist-card"
              ref={el => artistRefs.current[index] = el}
            >
              <div className="artist-rank">#{artist.rank}</div>
              <div className="artist-info">
                <div className="artist-name">{artist.name}</div>
                <div className="artist-stats">
                  <span className="play-count">{artist.plays}</span> 次播放
                  <span className="separator">·</span>
                  <span>{artist.hours}h</span>
                </div>
              </div>
              <div className="artist-medal">
                {artist.rank === 1 ? '🥇' : artist.rank === 2 ? '🥈' : artist.rank === 3 ? '🥉' : '⭐'}
              </div>
            </div>
          ))}
        </div>

        <p className="page-description">{data.description}</p>
      </div>
    </div>
  )
}

export default TopArtistsPage

