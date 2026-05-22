import { useEffect, useRef } from 'react'

export default function DotPattern() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isDark = !window.matchMedia('(prefers-color-scheme: light)').matches
    const dotColor  = isDark ? 'rgba(255,255,255,' : 'rgba(80,80,80,'
    const connColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(80,80,80,0.08)'

    const draw = () => {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const W = canvas.width
      const H = canvas.height

      // Scattered background dots
      const total = Math.floor((W * H) / 5000)
      for (let i = 0; i < total; i++) {
        const x  = ((i * 137.5) % W)
        const y  = ((i * 93.1) % H)
        const sz = (i % 3 === 0) ? 1.4 : 0.8
        const op = (i % 5 === 0) ? 0.35 : 0.18
        ctx.beginPath()
        ctx.arc(x, y, sz, 0, Math.PI * 2)
        ctx.fillStyle = `${dotColor}${op})`
        ctx.fill()
      }

      // DNA double helix strands
      const helixCount = 2
      const helixGap   = W / (helixCount + 1)
      for (let h = 0; h < helixCount; h++) {
        const cx        = helixGap * (h + 1)
        const amplitude = 80
        const frequency = 0.018
        const dotSpacing = 8
        const strandPoints1: {x: number; y: number}[] = []
        const strandPoints2: {x: number; y: number}[] = []

        for (let y = -20; y < H + 20; y += dotSpacing) {
          strandPoints1.push({ x: cx + Math.sin(y * frequency) * amplitude, y })
          strandPoints2.push({ x: cx + Math.sin(y * frequency + Math.PI) * amplitude, y })
        }

        strandPoints1.forEach((p, i) => {
          const depth = (Math.sin(i * frequency * dotSpacing) + 1) / 2
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.5 + depth * 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `${dotColor}${(0.2 + depth * 0.4).toFixed(2)})`
          ctx.fill()
        })

        strandPoints2.forEach((p, i) => {
          const depth = (Math.sin(i * frequency * dotSpacing + Math.PI) + 1) / 2
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.5 + depth * 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `${dotColor}${(0.2 + depth * 0.4).toFixed(2)})`
          ctx.fill()
        })

        // Rungs connecting strands
        const rungEvery = Math.round(40 / dotSpacing)
        for (let i = 0; i < strandPoints1.length; i += rungEvery) {
          const p1 = strandPoints1[i]
          const p2 = strandPoints2[i]
          if (!p1 || !p2) continue
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = connColor
          ctx.lineWidth = 0.6
          ctx.stroke()
          ;[p1, p2].forEach(p => {
            ctx.beginPath()
            ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2)
            ctx.fillStyle = `${dotColor}0.55)`
            ctx.fill()
          })
        }
      }
    }

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      draw()
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
