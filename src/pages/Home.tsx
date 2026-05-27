import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { NAV_PAGES } from '../context/NavigationContext'
import { motion, type Variants } from 'framer-motion'
import { useDocData } from '../lib/content'
import { smoothScrollToElement } from '../lib/smoothScroll'

type ProfileData = {
  resumeUrl: string
}

const downloadResume = (resumeUrl: string) => {
  const link = document.createElement('a')
  link.href = resumeUrl
  link.download = 'Albin_Thomas-resume.pdf'
  link.rel = 'noopener noreferrer'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    let intervalId: number | undefined;
    const t = setTimeout(() => {
      intervalId = window.setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(intervalId);
      }, 70);
    }, delay);
    return () => {
      clearTimeout(t);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, delay]);
  return <>{displayed}<span className="animate-pulse">_</span></>;
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }
} as const;

const STAGGER_ITEM: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.985, filter: 'blur(8px)' },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { delay, duration: 0.95, ease: [0.22, 1, 0.36, 1] },
  })
};

const DOT_ANGLES_DEG = [0, 72, 144, 216, 288]

const PARTICLES = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: (i * 137.5) % 100,
  y: (i * 93.1) % 100,
  size: (i * 1.3) % 2 + 0.5,
  dur: `${2 + ((i * 3.7) % 8)}s`,
  delay: `${(i * 2.9) % 5}s`,
  opacity: ((i * 0.17) % 0.5) + 0.1,
}))

const norm = (a: number) => ((a % 360) + 360) % 360

function topDotIndex(ringRotation: number): number {
  let closest = 0, minDist = 360
  for (let i = 0; i < NAV_PAGES.length; i++) {
    const screenAngle = norm(DOT_ANGLES_DEG[i] + ringRotation)
    const dist = Math.min(screenAngle, 360 - screenAngle)
    if (dist < minDist) { minDist = dist; closest = i }
  }
  return closest
}

const getEllipsePoint = (cx: number, cy: number, rx: number, ry: number, angleDeg: number, tRad: number) => {
  const x0 = rx * Math.cos(tRad)
  const y0 = ry * Math.sin(tRad)
  const theta = (angleDeg * Math.PI) / 180
  const x = cx + x0 * Math.cos(theta) - y0 * Math.sin(theta)
  const y = cy + x0 * Math.sin(theta) + y0 * Math.cos(theta)
  return { x, y }
}

export default function Home() {
  const navigate = useNavigate()
  const profile = useDocData<ProfileData>('profile', 'main', { resumeUrl: '/Albin_Thomas-resume.pdf' })
  const resumeUrl = profile.resumeUrl || '/Albin_Thomas-resume.pdf'

  const [ringRotation, setRingRotation] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const [imageMousePos, setImageMousePos] = useState({ x: 50, y: 50 })
  const [isHoveringImage, setIsHoveringImage] = useState(false)
  const [isMobileImageColor, setIsMobileImageColor] = useState(false)

  const handleImageMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setImageMousePos({ x, y })
  }, [])

  // activeIndex is the dot currently at the top of the wheel (changes while rotating)
  const activeIndex = topDotIndex(ringRotation)
  const activePage = NAV_PAGES[activeIndex]



  const isDragging = useRef(false)
  const hasDragged = useRef(false)
  const lastAngle = useRef(0)
  const wheelRef = useRef<HTMLDivElement>(null)

  const getCenter = useCallback(() => {
    const el = wheelRef.current
    if (!el) return { cx: 0, cy: 0 }
    const r = el.getBoundingClientRect()
    return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 }
  }, [])

  const getAngle = useCallback((clientX: number, clientY: number) => {
    const { cx, cy } = getCenter()
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI)
  }, [getCenter])

  const snapToNearest = useCallback((rot: number) => {
    setRingRotation(Math.round(rot / 72) * 72)
  }, [])

  const wheelTimeout = useRef<number | null>(null)
  
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Only handle vertical/horizontal scroll gestures (like trackpad)
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    setRingRotation(r => {
      const nextR = r + delta * 0.5;
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
      wheelTimeout.current = window.setTimeout(() => {
        setRingRotation(currentR => Math.round(currentR / 72) * 72);
      }, 200);
      return nextR;
    });
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    hasDragged.current = false
    lastAngle.current = getAngle(e.clientX, e.clientY)
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      hasDragged.current = true
      const angle = getAngle(e.clientX, e.clientY)
      setRingRotation(r => r + (angle - lastAngle.current))
      lastAngle.current = angle
    }
    const onMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) return
      isDragging.current = false
      if (hasDragged.current) {
        snapToNearest(ringRotation + (getAngle(e.clientX, e.clientY) - lastAngle.current))
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp) }
  }, [ringRotation, snapToNearest, getAngle])

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return
      hasDragged.current = true
      const t = e.touches[0]
      const angle = getAngle(t.clientX, t.clientY)
      setRingRotation(r => r + (angle - lastAngle.current))
      lastAngle.current = angle
    }
    const onTouchEnd = () => { 
      if (!isDragging.current) return; 
      isDragging.current = false; 
      if (hasDragged.current) snapToNearest(ringRotation);
    }
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    return () => { window.removeEventListener('touchmove', onTouchMove); window.removeEventListener('touchend', onTouchEnd) }
  }, [ringRotation, snapToNearest, getAngle])

  const handleDotClick = (e: React.MouseEvent, dotIndex: number) => {
    e.stopPropagation()
    const screenAngle = norm(DOT_ANGLES_DEG[dotIndex] + ringRotation)
    let delta = -screenAngle
    if (delta < -180) delta += 360
    if (delta > 180) delta -= 360
    setRingRotation(r => r + delta)
    setTimeout(() => {
      if (transitioning) return
      setTransitioning(true)
      setTimeout(() => {
        const sectionId = NAV_PAGES[dotIndex].id
        const section = document.getElementById(sectionId)
        if (section) smoothScrollToElement(section)
        setTransitioning(false)
      }, 600)
    }, 500)
  }

  const scrollToProjects = () => {
    const scroll = () => {
      const projectsSection = document.getElementById('projects')
      if (projectsSection) smoothScrollToElement(projectsSection)
    }

    if (window.location.pathname !== '/') {
      navigate('/')
      window.setTimeout(scroll, 120)
      return
    }

    scroll()
  }

  const SVG_SIZE = 480, CX = 240, CY = 240, R_OUTER = 210, R_INNER = 186
  const R_MID = (R_OUTER + R_INNER) / 2, DOT_R = 4
  const polarToXY = (angleDeg: number, r: number) => {
    const a = (angleDeg - 90) * (Math.PI / 180)
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
  }

  const ticks = Array.from({ length: 72 }, (_, i) => {
    const angle = i * 5
    const isDot = DOT_ANGLES_DEG.some(a => Math.abs(a - angle) < 3)
    const isMajor = i % 18 === 0 // every 90 deg
    const isMedium = i % 6 === 0 // every 30 deg

    let len = 4;
    let opacity = 0.15;

    if (isDot) { len = 0; opacity = 0; }
    else if (isMajor) { len = 12; opacity = 0.5; }
    else if (isMedium) { len = 8; opacity = 0.3; }

    return {
      outer: polarToXY(angle, R_INNER),
      inner: polarToXY(angle, R_INNER - len),
      opacity,
      isMajor
    }
  })

  const textPathRadius = R_OUTER + 16

  return (
    <motion.div
      initial="hidden" animate="show" variants={STAGGER_CONTAINER}
      className="relative min-h-screen w-full bg-bg-dark selection:bg-accent/30 selection:text-white flex flex-col xl:block items-center justify-center pb-8 xl:pb-0"
    >
      {/* Ambient Glows */}
      <div className="absolute right-[2%] lg:right-[6%] xl:right-[10%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Particles */}
      {PARTICLES.map(p => (
        <div key={p.id} className="absolute rounded-full bg-white/60 pointer-events-none animate-twinkle z-1" style={{
          left: `${p.x}%`, top: `${p.y}%`,
          width: `${p.size}px`, height: `${p.size}px`,
          opacity: p.opacity,
          '--dur': p.dur, '--delay': p.delay,
        } as React.CSSProperties} />
      ))}

      {/* Main content - Left Column */}
      <div className="relative xl:absolute xl:left-[8%] 2xl:left-[10%] xl:top-1/2 xl:-translate-y-1/2 z-10 flex flex-col w-full max-w-[600px] xl:max-w-[700px] px-6 md:px-12 xl:px-0 order-2 xl:order-none pb-4 xl:pb-0 pt-0">

        {/* Header Line (Desktop Only) */}
        <motion.div variants={STAGGER_ITEM} custom={0.15} className="hidden xl:flex items-center gap-4 mb-[56px] w-full">
          <div className="flex items-center text-accent shrink-0">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor">
              <path d="M0 0L8 6L0 12V0Z" />
            </svg>
          </div>
          <div className="font-mono text-[11px] tracking-[0.2em] text-white/70 uppercase whitespace-nowrap shrink-0">
            AI Innovator &nbsp;&bull;&nbsp; Full Stack Developer &nbsp;&bull;&nbsp; Problem Solver
          </div>
          <div className="flex-1 h-[1px] bg-white/10 relative min-w-[30px]">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-white/30 rounded-full" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-white/30 rounded-full" />
          </div>
        </motion.div>

        {/* Name Section */}
        <div className="flex flex-col items-start text-left">
          <motion.div variants={STAGGER_ITEM} custom={0.25} className="font-manrope text-[24px] md:text-[32px] xl:text-[40px] font-light text-white/90 leading-tight tracking-wide whitespace-nowrap">
            <TypewriterText text="Hello, I'm" delay={300} />
          </motion.div>
          <motion.h1 variants={STAGGER_ITEM} custom={1.15} className="font-manrope text-[44px] md:text-[56px] xl:text-[72px] font-bold text-accent leading-[1.05] tracking-normal whitespace-nowrap drop-shadow-lg">
            Albin Thomas
          </motion.h1>
        </div>

        {/* Badges Section (Mobile Only) */}
        <motion.div variants={STAGGER_ITEM} custom={1.55} className="xl:hidden flex flex-nowrap items-center gap-1.5 w-full mt-4 overflow-x-auto no-scrollbar pb-1">
          <div className="px-2 py-1 bg-accent/10 border border-accent/20 rounded text-accent font-mono text-[8px] sm:text-[9px] tracking-widest uppercase whitespace-nowrap shadow-[0_0_10px_rgba(255, 176, 0,0.1)]">AI Innovator</div>
          <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white/60 font-mono text-[8px] sm:text-[9px] tracking-widest uppercase whitespace-nowrap">Full Stack Dev</div>
          <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white/60 font-mono text-[8px] sm:text-[9px] tracking-widest uppercase whitespace-nowrap">Problem Solver</div>
        </motion.div>

        {/* Hero Text */}
        <div className="flex flex-col gap-4 xl:gap-6 mt-4 xl:mt-8">
          <motion.div variants={STAGGER_ITEM} custom={1.75} className="flex flex-col gap-3 xl:gap-5 max-w-[540px]">
            <p className="font-montserrat text-[13px] sm:text-[14px] md:text-[15px] xl:text-[16px] font-normal leading-[1.6] md:leading-[1.8] text-white/60 text-justify">
              Computer Science Engineering student and developer passionate about building intelligent, user-focused digital solutions for real-world problems.
            </p>
            <p className="font-montserrat text-[13px] sm:text-[14px] md:text-[15px] xl:text-[16px] font-normal leading-[1.6] md:leading-[1.8] text-white/60 text-justify">
              I enjoy turning ideas into meaningful products through code, creativity, and innovation, with interests in AI, web development, and modern user experiences.
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div variants={STAGGER_ITEM} custom={2.2} className="mt-[15px] xl:mt-[20px] flex gap-4 sm:gap-6 items-center">
            <button
              className="home-cta-btn group relative inline-flex items-center gap-3 px-8 py-[9px] xl:py-[14px] bg-white/[0.04] backdrop-blur-[12px] border border-accent/40 text-white font-mono text-[11px] tracking-[0.25em] uppercase cursor-pointer overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_20px_rgba(255,176,0,0.12),_inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-accent/10 hover:border-accent hover:shadow-[0_0_30px_rgba(255,176,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)] before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-600 before:ease-out after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-accent after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-400 after:ease-out"
              onClick={() => downloadResume(resumeUrl)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 ease-out group-hover:translate-y-0.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              <span>DOWNLOAD RESUME</span>
            </button>
            <button
              className="home-cta-btn group relative inline-flex items-center gap-3 px-8 py-[9px] xl:py-[14px] bg-white/[0.04] backdrop-blur-[12px] border border-white/15 text-white font-mono text-[11px] tracking-[0.25em] uppercase cursor-pointer overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-white/10 hover:border-white/40 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)] before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-600 before:ease-out after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:origin-left hover:after:scale-x-100 hover:after:origin-right after:transition-transform after:duration-400 after:ease-out"
              onClick={scrollToProjects}
            >
              <span>VIEW PROJECTS</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Right Column - Mechanical Wheel */}
      <div className="relative xl:absolute xl:right-[2%] 2xl:right-[8%] xl:top-1/2 xl:-translate-y-1/2 z-10 order-1 xl:order-none flex items-center justify-center -mt-[60px] -mb-[21px] sm:my-0 xl:my-0">
          {/* Desktop Mechanical Wheel (Hidden on Mobile) */}
          <motion.div variants={STAGGER_ITEM} custom={1.15} className="hidden xl:flex relative w-[560px] h-[560px] flex items-center justify-center shrink-0">

            {/* Glowing Orbits Background (Desktop) */}
            <div className="absolute w-[800px] h-[800px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
              <svg className="w-full h-full" viewBox="0 0 800 800" fill="none">
                <defs>
                  <filter id="orbit-glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="dot-glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Ellipse 1 (Tilted down-left) */}
                <ellipse
                  cx="400"
                  cy="400"
                  rx="370"
                  ry="175"
                  stroke="rgba(255, 176, 0, 0.12)"
                  strokeWidth="1"
                  transform="rotate(-22 400 400)"
                />

                {/* Ellipse 2 (Tilted down-right) */}
                <ellipse
                  cx="400"
                  cy="400"
                  rx="370"
                  ry="175"
                  stroke="rgba(255, 176, 0, 0.12)"
                  strokeWidth="1"
                  transform="rotate(22 400 400)"
                />

                {/* Glowing Orbit Dots */}
                {[
                  // Ellipse 1 Dots
                  getEllipsePoint(400, 400, 370, 175, -22, Math.PI * 0.95),
                  getEllipsePoint(400, 400, 370, 175, -22, Math.PI * -0.2),
                  // Ellipse 2 Dots
                  getEllipsePoint(400, 400, 370, 175, 22, Math.PI * 0.05),
                  getEllipsePoint(400, 400, 370, 175, 22, Math.PI * 1.15),
                  getEllipsePoint(400, 400, 370, 175, 22, Math.PI * 0.6),
                ].map((pt, idx) => (
                  <g key={`orbit-dot-${idx}`}>
                    {/* Outer Glow */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="7"
                      fill="#FFB000"
                      opacity="0.6"
                      filter="url(#dot-glow)"
                    />
                    {/* Inner Sharp Point */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="2.5"
                      fill="#FFB000"
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* Outer Casing / Brackets */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {/* Static Outer Ring */}
              <div className="absolute inset-[30px] rounded-full border-[12px] border-[#111111] shadow-mech-outer" />

              {/* 4 Brackets */}
              {[45, 135, 225, 315].map((angle, i) => (
                <div key={i} className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${angle}deg)` }}>
                  <div className="mech-bracket absolute top-0 w-24 h-12 bg-[#0f0f0f] border border-white/5 rounded-t-lg shadow-mech-inner flex items-center justify-center">
                    <div className="w-12 h-1 bg-white/10 rounded-full" />
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-black/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-black/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
                  </div>
                </div>
              ))}

              {/* Glowing Accents on outer ring */}
              <div className="absolute top-[30px] left-1/2 -translate-x-1/2 w-4 h-1 bg-accent shadow-[0_0_10px_var(--accent)]" />
              <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 w-4 h-1 bg-white/30" />
              <div className="absolute left-[30px] top-1/2 -translate-y-1/2 w-1 h-4 bg-accent shadow-[0_0_10px_var(--accent)]" />
              <div className="absolute right-[30px] top-1/2 -translate-y-1/2 w-1 h-4 bg-accent shadow-[0_0_10px_var(--accent)]" />
            </div>

            {/* Rotating Mechanism */}
            <div className="absolute inset-[44px] rounded-full z-10 cursor-grab active:cursor-grabbing touch-none"
              onMouseDown={onMouseDown}
              onTouchStart={e => { isDragging.current = true; hasDragged.current = false; lastAngle.current = getAngle(e.touches[0].clientX, e.touches[0].clientY) }}
              onWheel={handleWheel}
              onClick={() => {
                if (hasDragged.current) return;
                if (transitioning) return;
                setTransitioning(true);
                setTimeout(() => {
                  const sectionId = NAV_PAGES[activeIndex].id
                  const section = document.getElementById(sectionId)
                  if (section) smoothScrollToElement(section)
                  setTransitioning(false)
                }, 600);
              }}
            >
              <div ref={wheelRef} className="absolute inset-[16px] rounded-full shadow-mech-ring bg-[#0f0f0f]">
              {/* Top Label (Static) */}
              <div className="absolute top-[20px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1">
                <span className="font-mono text-[9px] text-white/50 tracking-[0.2em]">{activePage.num}</span>
                <span className="font-sans text-[12px] font-bold tracking-[0.2em] text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{activePage.label}</span>
              </div>

              <div className="absolute top-[54px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-accent shadow-[0_0_12px_var(--accent),_0_0_24px_var(--accent)] z-20" />

              {/* Static Red Arrows on Sides */}
              <div className="absolute top-1/2 left-[30px] -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-r-[6px] border-r-accent z-20" />
              <div className="absolute top-1/2 right-[30px] -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-accent z-20" />

              {/* Static SVG for Bottom Text */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 mech-wheel-svg" viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
                <defs>
                  <path id="static-text-path-bottom" d={`M ${CX - textPathRadius} ${CY} a ${textPathRadius} ${textPathRadius} 0 0 0 ${textPathRadius * 2} 0`} />
                </defs>
                <text fontFamily="Space Mono, monospace" fontSize="9" letterSpacing="5" fill="rgba(255,255,255,0.4)">
                  <textPath href="#static-text-path-bottom" startOffset="50%" textAnchor="middle">ROTATE TO NAVIGATE</textPath>
                </text>
              </svg>

              {/* The Rotating SVG part */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-100 ease-linear mech-wheel-svg" viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                style={{ transform: `rotate(${ringRotation}deg)` }}
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="glow-heavy">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Inner Ring Background */}
                <circle cx={CX} cy={CY} r={R_OUTER} stroke="rgba(255,255,255,0.03)" strokeWidth="40" fill="none" />

                {/* Ticks */}
                {ticks.map((t, i) => (
                  <line key={`tick-${i}`} x1={t.outer.x} y1={t.outer.y} x2={t.inner.x} y2={t.inner.y}
                    stroke={t.isMajor ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)"} strokeWidth={t.isMajor ? "1.5" : "1"} opacity={t.opacity}
                  />
                ))}

                {/* Sub-rings */}
                <circle cx={CX} cy={CY} r={R_INNER} stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />

                {/* Interactive Dots & Arrows */}
                {NAV_PAGES.map((page, i) => {
                  const pos = polarToXY(DOT_ANGLES_DEG[i], R_MID);
                  const isActive = i === activeIndex;

                  return (
                    <g key={page.id} className="cursor-pointer pointer-events-auto" onClick={(e) => handleDotClick(e, i)}>
                      <circle cx={pos.x} cy={pos.y} r={24} fill="transparent" />

                      {isActive ? (
                        <g filter="url(#glow)">
                          {/* Active Indicator (Red Triangle pointing inward) */}
                          <path d={`M ${pos.x - 5} ${pos.y - 5} L ${pos.x + 5} ${pos.y - 5} L ${pos.x} ${pos.y + 6} Z`} fill="var(--accent)" transform={`rotate(${DOT_ANGLES_DEG[i]} ${pos.x} ${pos.y})`} />
                        </g>
                      ) : (
                        <circle cx={pos.x} cy={pos.y} r={DOT_R} fill="rgba(255,255,255,0.8)" />
                      )}

                      <line
                        x1={pos.x} y1={pos.y}
                        x2={polarToXY(DOT_ANGLES_DEG[i], R_INNER).x} y2={polarToXY(DOT_ANGLES_DEG[i], R_INNER).y}
                        stroke={isActive ? 'rgba(255, 176, 0, 0.2)' : 'rgba(255,255,255,0.05)'} strokeWidth="1"
                      />
                    </g>
                  )
                })}
              </svg>

              {/* Center Image Container */}
              <div
                className="home-center-circle-bg absolute inset-[48px] rounded-full overflow-hidden z-10 border border-white/10 shadow-[inset_0_20px_40px_rgba(0,0,0,0.9),_0_0_30px_rgba(0,0,0,0.8)] pointer-events-auto flex items-center justify-center cursor-pointer"
                onMouseMove={handleImageMouseMove}
                onMouseEnter={() => setIsHoveringImage(true)}
                onMouseLeave={() => setIsHoveringImage(false)}
              >
                <div className="home-center-vignette absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(0,0,0,1)] z-20 pointer-events-none" />

                {/* Base Image (Black & White) */}
                <img src="/albin.png" alt="Albin Thomas Base"
                  className="home-base-image absolute w-full h-full object-cover object-[center_20%] scale-105 pointer-events-none grayscale opacity-70"
                />

                {/* Colored Image Spotlight (Original Colors) */}
                <img src="/albin.png" alt="Albin Thomas Color"
                  className="absolute w-full h-full object-cover object-[center_20%] scale-105 pointer-events-none transition-opacity duration-300"
                  style={{
                    opacity: isHoveringImage ? 1 : 0,
                    WebkitMaskImage: `radial-gradient(circle 200px at ${imageMousePos.x}% ${imageMousePos.y}%, black 0%, transparent 100%)`,
                    maskImage: `radial-gradient(circle 200px at ${imageMousePos.x}% ${imageMousePos.y}%, black 0%, transparent 100%)`
                  }}
                />
              </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Profile Frame (Visible on phones/tablets) */}
          <motion.div variants={STAGGER_ITEM} custom={0.1} className="flex xl:hidden relative w-[350px] h-[350px] flex items-center justify-center shrink-0 scale-[0.9] sm:scale-100">
            {/* Crossing Orbits Background (Mobile) */}
            <div className="absolute w-[440px] h-[440px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
              <svg className="w-full h-full" viewBox="0 0 440 440" fill="none">
                <defs>
                  <filter id="mobile-dot-glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Ellipse 1 (Tilted down-left) */}
                <ellipse
                  cx="220"
                  cy="220"
                  rx="200"
                  ry="100"
                  stroke="rgba(255, 176, 0, 0.12)"
                  strokeWidth="1"
                  transform="rotate(-22 220 220)"
                />

                {/* Ellipse 2 (Tilted down-right) */}
                <ellipse
                  cx="220"
                  cy="220"
                  rx="200"
                  ry="100"
                  stroke="rgba(255, 176, 0, 0.12)"
                  strokeWidth="1"
                  transform="rotate(22 220 220)"
                />

                {/* Interactive Orbit Nodes */}
                {[
                  { id: 'journey', label: 'JOURNEY', pt: getEllipsePoint(220, 220, 200, 100, -22, Math.PI * 0.95), tx: -8, ty: 12, anchor: 'end' },
                  { id: 'skills', label: 'SKILLS', pt: getEllipsePoint(220, 220, 200, 100, -22, Math.PI * -0.12), tx: 8, ty: -8, anchor: 'start' },
                  { id: 'projects', label: 'PROJECTS', pt: getEllipsePoint(220, 220, 200, 100, 22, Math.PI * 1.15), tx: -8, ty: -8, anchor: 'end' },
                  { id: 'contact', label: 'CONTACT', pt: getEllipsePoint(220, 220, 200, 100, 22, Math.PI * 0.05), tx: 8, ty: 12, anchor: 'start' },
                ].map((node) => (
                  <g 
                    key={node.id} 
                    className="cursor-pointer pointer-events-auto group"
                    onClick={() => {
                      const section = document.getElementById(node.id)
                      if (section) smoothScrollToElement(section)
                      window.history.replaceState(null, '', `#${node.id}`)
                    }}
                  >
                    <circle
                      cx={node.pt.x}
                      cy={node.pt.y}
                      r="8"
                      fill="#FFB000"
                      opacity="0.5"
                      className="group-hover:opacity-85 transition-opacity"
                      filter="url(#mobile-dot-glow)"
                    />
                    <circle
                      cx={node.pt.x}
                      cy={node.pt.y}
                      r="2.5"
                      fill="#FFB000"
                      className="group-hover:fill-white transition-colors"
                    />
                    <text
                      x={node.pt.x + node.tx}
                      y={node.pt.y + node.ty}
                      fontFamily="Space Mono, monospace"
                      fontSize="7.5"
                      letterSpacing="0.5"
                      fill="rgba(255, 255, 255, 0.45)"
                      textAnchor={node.anchor as 'start' | 'middle' | 'end'}
                      className="group-hover:fill-accent transition-colors font-bold select-none"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Central Square Image Container (Mobile) */}
          <div 
            className="relative w-[246px] h-[246px] z-10 flex items-center justify-center cursor-pointer"
            onClick={() => setIsMobileImageColor(prev => !prev)}
          >
            <div 
              className="home-center-circle-bg w-[222px] h-[222px] overflow-hidden border border-white/5"
              style={{
                clipPath: "polygon(14px 0, 208px 0, 222px 14px, 222px 208px, 208px 222px, 14px 222px, 0 208px, 0 14px)"
              }}
            >
              <img 
                src="/albin.png" 
                alt="Albin Thomas"
                className={`w-full h-full object-cover object-[center_20%] transition-all duration-700 ease-out ${isMobileImageColor ? 'grayscale-0 opacity-100' : 'grayscale opacity-80'}`}
              />
            </div>

              {/* Sci-Fi HUD Overlay Frame */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 220 220">
                {/* Outer corner bracket top-left */}
                <path d="M 10 25 L 10 10 L 25 10" stroke="rgba(255, 176, 0, 0.4)" strokeWidth="1.5" fill="none" />
                <path d="M 5 35 L 5 5 L 35 5" stroke="#FFB000" strokeWidth="1.2" fill="none" />
                
                {/* Outer corner bracket top-right */}
                <path d="M 210 25 L 210 10 L 195 10" stroke="rgba(255, 176, 0, 0.4)" strokeWidth="1.5" fill="none" />
                <path d="M 215 35 L 215 5 L 185 5" stroke="#FFB000" strokeWidth="1.2" fill="none" />

                {/* Outer corner bracket bottom-left */}
                <path d="M 10 195 L 10 210 L 25 210" stroke="rgba(255, 176, 0, 0.4)" strokeWidth="1.5" fill="none" />
                <path d="M 5 185 L 5 215 L 35 215" stroke="#FFB000" strokeWidth="1.2" fill="none" />

                {/* Outer corner bracket bottom-right */}
                <path d="M 210 195 L 210 210 L 195 210" stroke="rgba(255, 176, 0, 0.4)" strokeWidth="1.5" fill="none" />
                <path d="M 215 185 L 215 215 L 185 215" stroke="#FFB000" strokeWidth="1.2" fill="none" />

                {/* Inner Chamfered Box Outline */}
                <path 
                  d="M 32 20 L 188 20 L 200 32 L 200 188 L 188 200 L 32 200 L 20 188 L 20 32 Z" 
                  stroke="#FFB000" 
                  strokeWidth="2" 
                  fill="none" 
                  className="drop-shadow-[0_0_6px_rgba(255,176,0,0.5)]" 
                />

                {/* Decorative dots */}
                <circle cx="45" cy="15" r="1.2" fill="rgba(255, 176, 0, 0.5)" />
                <circle cx="53" cy="15" r="1.2" fill="rgba(255, 176, 0, 0.5)" />
                <circle cx="61" cy="15" r="1.2" fill="rgba(255, 176, 0, 0.5)" />
                
                <circle cx="159" cy="205" r="1.2" fill="rgba(255, 176, 0, 0.5)" />
                <circle cx="167" cy="205" r="1.2" fill="rgba(255, 176, 0, 0.5)" />
                <circle cx="175" cy="205" r="1.2" fill="rgba(255, 176, 0, 0.5)" />
                
                {/* Side accent bars */}
                <line x1="15" y1="100" x2="15" y2="120" stroke="#FFB000" strokeWidth="1.5" />
                <line x1="205" y1="100" x2="205" y2="120" stroke="#FFB000" strokeWidth="1.5" />
              </svg>
            </div>
          </motion.div>
      </div>

      <div className={`fixed inset-0 bg-bg-dark z-[100] pointer-events-none translate-y-full ${transitioning ? 'animate-slideUp' : ''}`} />
    </motion.div>
  )
}
