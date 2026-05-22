import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigation } from '../context/NavigationContext'

const RING_CONFIGS = [
  { radius: 180, speed: 18, dir: 1,  dash: '8 14',  opacity: 0.35, width: 1   },
  { radius: 158, speed: 26, dir: -1, dash: '3 22',  opacity: 0.22, width: 0.8 },
  { radius: 205, speed: 38, dir: 1,  dash: '1 30',  opacity: 0.18, width: 0.6 },
  { radius: 225, speed: 55, dir: -1, dash: '12 8',  opacity: 0.14, width: 0.5 },
  { radius: 248, speed: 70, dir: 1,  dash: '2 40',  opacity: 0.10, width: 0.5 },
]

export default function RightSide() {
  const { activeIndex, setActiveIndex, sections } = useNavigation()
  const [isDragging, setIsDragging] = useState(false)
  const lastAngle   = useRef(0)
  const accumulated = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const padNum = (n: number) => String(n + 1).padStart(2, '0')

  const getCenterFromRef = () => {
    if (!containerRef.current) return { x: 0, y: 0 }
    const r = containerRef.current.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }

  const angleFromCenter = (cx: number, cy: number, px: number, py: number) =>
    Math.atan2(py - cy, px - cx) * (180 / Math.PI)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const { x, y } = getCenterFromRef()
    lastAngle.current = angleFromCenter(x, y, e.clientX, e.clientY)
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    const { x, y } = getCenterFromRef()
    const angle = angleFromCenter(x, y, e.clientX, e.clientY)
    let delta = angle - lastAngle.current
    if (delta >  180) delta -= 360
    if (delta < -180) delta += 360
    accumulated.current += delta
    lastAngle.current = angle
    const threshold = 360 / sections.length
    if (Math.abs(accumulated.current) >= threshold) {
      const steps = Math.floor(Math.abs(accumulated.current) / threshold)
      const dir   = accumulated.current > 0 ? 1 : -1
      setActiveIndex(((activeIndex + dir * steps) % sections.length + sections.length) % sections.length)
      accumulated.current = accumulated.current % threshold
    }
  }, [isDragging, activeIndex, sections, setActiveIndex])

  const onPointerUp = useCallback(() => {
    setIsDragging(false)
    accumulated.current = 0
  }, [])

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (e.deltaY > 0) setActiveIndex((activeIndex + 1) % sections.length)
      else setActiveIndex(((activeIndex - 1) + sections.length) % sections.length)
    }
    window.addEventListener('wheel', handler, { passive: true })
    return () => window.removeEventListener('wheel', handler)
  }, [activeIndex, sections, setActiveIndex])

  const size = 520
  const cx   = size / 2
  const cy   = size / 2

  return (
    <div className="flex-1 flex items-center justify-center relative py-12 md:py-0">
      <div
        ref={containerRef}
        className="relative select-none cursor-grab active:cursor-grabbing"
        style={{ width: size, height: size, maxWidth: '90vw', maxHeight: '90vw' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* SVG rings */}
        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${size} ${size}`} fill="none">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {RING_CONFIGS.map((ring, i) => (
            <motion.circle
              key={i}
              cx={cx} cy={cy} r={ring.radius}
              stroke={`rgba(180,200,230,${ring.opacity})`}
              strokeWidth={ring.width}
              strokeDasharray={ring.dash}
              animate={{ rotate: ring.dir > 0 ? 360 : -360 }}
              transition={{ duration: ring.speed, repeat: Infinity, ease: 'linear' }}
              style={{ originX: `${cx}px`, originY: `${cy}px` }}
              filter={i === 0 ? 'url(#glow)' : undefined}
            />
          ))}

          {/* Section indicator marks */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * 360 - 90
            const rad   = (angle * Math.PI) / 180
            const r     = 248
            const x1 = cx + (r - 6) * Math.cos(rad)
            const y1 = cy + (r - 6) * Math.sin(rad)
            const x2 = cx + (r + 6) * Math.cos(rad)
            const y2 = cy + (r + 6) * Math.sin(rad)
            const isActive = i === activeIndex
            return (
              <g key={i} onClick={() => setActiveIndex(i)} style={{ cursor: 'pointer' }}>
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={isActive ? '#e05a2b' : 'rgba(150,170,210,0.35)'}
                  strokeWidth={isActive ? 1.5 : 0.8}
                />
                {isActive && (
                  <circle
                    cx={cx + (r + 14) * Math.cos(rad)}
                    cy={cy + (r + 14) * Math.sin(rad)}
                    r={3} fill="#e05a2b" opacity={0.8}
                  />
                )}
              </g>
            )
          })}

          {/* Inner decorative rings */}
          {[140, 130].map((r, i) => (
            <circle key={`inner-${i}`} cx={cx} cy={cy} r={r}
              stroke={`rgba(100,130,200,${0.08 - i * 0.02})`}
              strokeWidth={0.5} strokeDasharray="4 16"
            />
          ))}
        </svg>

        {/* Profile circle */}
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            width: 200, height: 200,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid rgba(180,200,240,0.2)',
            boxShadow: '0 0 40px rgba(255,107,61,0.08), 0 0 80px rgba(100,130,200,0.06), inset 0 0 20px rgba(0,0,0,0.5)',
          }}
        >
          <img
            src="/albin.png"
            alt="Albin Thomas"
            className="w-full h-full object-cover object-top"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <div className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: '1px solid rgba(224,90,43,0.15)', boxShadow: 'inset 0 0 24px rgba(224,90,43,0.05)' }}
          />
        </div>

        {/* Active section label */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.4 }}
          className="absolute"
          style={{ top: '12%', right: '8%', textAlign: 'right' }}
        >
          <div className="text-4xl font-bold font-mono" style={{ color: 'rgba(224,90,43,0.8)', lineHeight: 1 }}>
            {padNum(activeIndex)}
          </div>
          <div className="text-xs font-mono tracking-[0.3em] uppercase mt-1" style={{ color: 'rgba(180,200,230,0.65)' }}>
            {sections[activeIndex]}
          </div>
        </motion.div>

        {/* "ROTATE TO NAVIGATE" curved text */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${size} ${size}`}>
          <path id="curvedText" d={`M ${cx - 130},${cy} a 130,130 0 0,1 260,0`} fill="none" />
          <text style={{ fontSize: '8px', fontFamily: 'monospace', fill: 'rgba(130,150,200,0.4)', letterSpacing: '0.25em' }}>
            <textPath href="#curvedText" startOffset="50%" textAnchor="middle">◈  ROTATE TO NAVIGATE  ◈</textPath>
          </text>
        </svg>

        {/* HUD corner decorations */}
        {[
          { top: '4%', left: '4%' },
          { top: '4%', right: '4%' },
          { bottom: '4%', left: '4%' },
          { bottom: '4%', right: '4%' },
        ].map((style, i) => (
          <div key={i} className="absolute w-4 h-4" style={{
            ...style,
            borderTop:    i < 2     ? '1px solid rgba(180,200,240,0.2)' : 'none',
            borderBottom: i >= 2    ? '1px solid rgba(180,200,240,0.2)' : 'none',
            borderLeft:   i % 2 === 0 ? '1px solid rgba(180,200,240,0.2)' : 'none',
            borderRight:  i % 2 === 1 ? '1px solid rgba(180,200,240,0.2)' : 'none',
          }} />
        ))}

        {/* Section dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {sections.map((_, i) => (
            <button key={i} onClick={() => setActiveIndex(i)} className="transition-all duration-300" style={{
              width: i === activeIndex ? 16 : 4,
              height: 4,
              borderRadius: i === activeIndex ? 2 : '50%',
              background: i === activeIndex ? 'rgba(224,90,43,0.8)' : 'rgba(150,170,220,0.25)',
              border: 'none', cursor: 'pointer',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}
