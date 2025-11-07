import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function IntroPage({ data, isActive }) {
  const titleRef = useRef(null)
  const avatarRef = useRef(null)
  const userNameRef = useRef(null)
  const messageRef = useRef(null)
  const detailsRef = useRef([])
  const cardRef = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    // 设置初始状态
    gsap.set(titleRef.current, { opacity: 0, scale: 0.5 })
    gsap.set(avatarRef.current, { scale: 0, rotation: -180 })
    gsap.set(userNameRef.current, { opacity: 0, y: 20 })
    gsap.set(messageRef.current, { opacity: 0, y: 20 })
    gsap.set(detailsRef.current, { opacity: 0, rotationY: 90, scale: 0.8 })
    gsap.set(cardRef.current, { opacity: 0, scale: 0.9 })
  }, [])

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true

    const tl = gsap.timeline({ delay: 0.3 })
    
    // 1. 标题爆炸式放大 + 闪烁
    tl.to(titleRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'elastic.out(1, 0.6)',
      onComplete: () => {
        // 闪烁效果
        gsap.to(titleRef.current, {
          textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)',
          duration: 0.3,
          yoyo: true,
          repeat: 1
        })
      }
    })
    
    // 2. 卡片淡入放大
    .to(cardRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.5)'
    }, '-=0.5')
    
    // 3. 头像旋转弹出
    .to(avatarRef.current, {
      scale: 1,
      rotation: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.5)',
      onComplete: () => {
        // 头像持续轻微跳动
        gsap.to(avatarRef.current, {
          y: -5,
          duration: 0.8,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1
        })
      }
    }, '-=0.6')
    
    // 4. 用户名打字机效果（逐字显示）
    .to(userNameRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
    
    // 5. 消息文字波浪进入
    .to(messageRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.2')
    
    // 6. 详情卡片3D翻转进入
    detailsRef.current.forEach((detail, index) => {
      if (detail) {
        tl.to(detail, {
          opacity: 1,
          rotationY: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          onComplete: () => {
            // 悬停时卡片轻微倾斜
            detail.addEventListener('mouseenter', () => {
              gsap.to(detail, { rotationY: 5, scale: 1.05, duration: 0.3 })
            })
            detail.addEventListener('mouseleave', () => {
              gsap.to(detail, { rotationY: 0, scale: 1, duration: 0.3 })
            })
          }
        }, `-=${0.5 - index * 0.15}`)
      }
    })
  }, [isActive])

  return (
    <div className="page intro-page" style={{ background: data.gradient }}>
      <div className="page-content">
        <h2 className="page-title intro-title-glow" ref={titleRef}>
          {data.title}
        </h2>
        
        <div className="intro-card intro-card-3d" ref={cardRef}>
          <div className="user-avatar intro-avatar-bounce" ref={avatarRef}>👤</div>
          <h3 className="user-name" ref={userNameRef}>
            {data.data.userName}
          </h3>
          <p className="user-message" ref={messageRef}>
            {data.data.message}
          </p>
        </div>

        <div className="intro-details">
          <div 
            className="detail-item detail-item-3d"
            ref={el => detailsRef.current[0] = el}
          >
            <div className="detail-icon">📅</div>
            <div className="detail-text">
              <div className="detail-label">加入时间</div>
              <div className="detail-value">{data.data.joinDate}</div>
            </div>
          </div>
          <div 
            className="detail-item detail-item-3d"
            ref={el => detailsRef.current[1] = el}
          >
            <div className="detail-icon">🎂</div>
            <div className="detail-text">
              <div className="detail-label">陪伴年限</div>
              <div className="detail-value">{data.data.totalYears} 年</div>
            </div>
          </div>
        </div>

        <p className="page-description">{data.description}</p>
      </div>
    </div>
  )
}

export default IntroPage

