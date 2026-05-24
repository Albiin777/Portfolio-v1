import { useEffect, useRef } from 'react'

export default function FireParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Array<{
      x: number
      y: number
      size: number
      speedY: number
      speedX: number
      color: string
      opacity: number
      fadeSpeed: number
      life: number
      maxLife: number
    }> = []

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      canvas.width = rect?.width || canvas.clientWidth || 400
      canvas.height = rect?.height || canvas.clientHeight || 600
    }

    resize()

    const resizeObserver = new ResizeObserver(() => {
      resize()
    })
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement)
    }

    const colors = [
      'rgba(255, 176, 0, ',   // Accent orange (#FFB000)
      'rgba(255, 110, 30, ',  // Fiery orange
      'rgba(255, 180, 20, ',  // Golden yellow-orange
      'rgba(230, 40, 40, ',   // Soft red-orange
    ]

    const createParticle = (x: number, y: number, isInitial = false) => {
      const size = Math.random() * 2 + 0.6
      const maxLife = Math.random() * 140 + 100
      return {
        x,
        y,
        size,
        speedY: -(Math.random() * 0.2 + 0.05), // slow drifting upwards
        speedX: (Math.random() - 0.5) * 0.1,   // gentle sway
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: isInitial ? Math.random() * 0.4 : 0,
        fadeSpeed: Math.random() * 0.005 + 0.002,
        life: isInitial ? Math.random() * maxLife : 0,
        maxLife,
      }
    }

    const init = () => {
      const W = canvas.width
      const H = canvas.height
      const particleCount = 20 // Subtle and low density
      particles = []
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(Math.random() * W, Math.random() * H, true))
      }
    }

    init()

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const W = canvas.width
      const H = canvas.height

      // Maintain a steady slow flow of 20 particles
      const targetCount = 20
      if (particles.length < targetCount && Math.random() < 0.1) {
        particles.push(createParticle(Math.random() * W, H + 5))
      }

      particles.forEach((p, index) => {
        p.life++
        p.y += p.speedY
        p.x += p.speedX

        // Fading behavior
        if (p.life < p.maxLife * 0.25) {
          p.opacity = Math.min(0.4, p.opacity + p.fadeSpeed * 1.5)
        } else if (p.life > p.maxLife * 0.65) {
          p.opacity = Math.max(0, p.opacity - p.fadeSpeed)
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${p.opacity.toFixed(3)})`
        ctx.fill()

        // Subtle glow effect
        if (p.size > 1.6 && p.opacity > 0.2) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2)
          ctx.fillStyle = `${p.color}${(p.opacity * 0.2).toFixed(3)})`
          ctx.fill()
        }

        // Reset if dead or went out of bounds
        if (p.y < -10 || p.x < -10 || p.x > W + 10 || p.life >= p.maxLife || p.opacity <= 0) {
          particles[index] = createParticle(Math.random() * W, H + 5)
        }
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
