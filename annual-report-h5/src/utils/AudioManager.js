class AudioManager {
  constructor() {
    this.bgMusic = null
    this.isPlaying = false
    this.isMuted = false
  }

  init(audioSrc) {
    // 创建音频对象 - 使用免费的音效
    // 这里使用一个简单的提示音，实际项目中可以替换为真实的背景音乐
    this.bgMusic = new Audio()
    this.bgMusic.loop = true
    this.bgMusic.volume = 0.3
    
    // 由于没有真实音频文件，我们创建一个静音音频
    // 实际使用时替换为真实的音频URL
    // this.bgMusic.src = audioSrc
  }

  play() {
    if (this.bgMusic && !this.isPlaying) {
      this.bgMusic.play().catch(err => {
        console.log('音频播放被阻止，需要用户交互后才能播放', err)
      })
      this.isPlaying = true
    }
  }

  pause() {
    if (this.bgMusic && this.isPlaying) {
      this.bgMusic.pause()
      this.isPlaying = false
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
    return this.isPlaying
  }

  setVolume(volume) {
    if (this.bgMusic) {
      this.bgMusic.volume = Math.max(0, Math.min(1, volume))
    }
  }

  mute() {
    if (this.bgMusic) {
      this.bgMusic.muted = true
      this.isMuted = true
    }
  }

  unmute() {
    if (this.bgMusic) {
      this.bgMusic.muted = false
      this.isMuted = false
    }
  }

  toggleMute() {
    if (this.isMuted) {
      this.unmute()
    } else {
      this.mute()
    }
    return !this.isMuted
  }
}

export default new AudioManager()

