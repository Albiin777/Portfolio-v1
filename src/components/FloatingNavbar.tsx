import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_PAGES } from '../context/NavigationContext'

// Download icon for Resume button
const DownloadIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

export default function FloatingNavbar() {
  const [isVisible, setIsVisible]       = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const isProgrammaticScroll            = useRef(false)
  const scrollTimeout                   = useRef<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 80)
      if (isProgrammaticScroll.current) return

      let active = 'home'
      for (const page of NAV_PAGES) {
        const el = document.getElementById(page.id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight / 2) {
          active = page.id
        }
      }
      setActiveSection(active)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout.current !== null) window.clearTimeout(scrollTimeout.current)
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const section = document.getElementById(id)
    if (!section) return
    isProgrammaticScroll.current = true
    setActiveSection(id)
    if (scrollTimeout.current !== null) window.clearTimeout(scrollTimeout.current)
    section.scrollIntoView({ behavior: 'smooth' })
    window.history.pushState(null, '', `#${id}`)
    scrollTimeout.current = window.setTimeout(() => { isProgrammaticScroll.current = false }, 800)
  }

  const getLabel = (id: string) => {
    const map: Record<string, string> = {
      home: 'HOME', journey: 'ABOUT', skills: 'SKILLS',
      projects: 'PROJECTS', contact: 'CONTACT',
    }
    return map[id] ?? id.toUpperCase()
  }

  // Only show the 5 main links (exclude coding profiles)
  const navLinks = NAV_PAGES.filter(p => p.id !== 'coding')

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{    y: -72, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="hidden md:flex fixed top-0 left-0 right-0 z-50 flex-col pointer-events-none"
        >
          {/* ── Top accent line — thin orange glow line spanning full width ── */}
          <div className="relative w-full h-[2px] overflow-visible">
            {/* Base line */}
            <div className="absolute inset-0 bg-accent/25" />
            {/* Center-glow intensification */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px]"
              style={{
                width: '40%',
                background: 'linear-gradient(to right, transparent, #ff4b1f99 30%, #ff8500cc 50%, #ff4b1f99 70%, transparent)',
              }}
            />
          </div>

          {/* ── Main navbar bar ─────────────────────────────────────────── */}
          <div className="w-full bg-[#060608]/35 backdrop-blur-md border-b border-white/[0.07] pointer-events-auto">
            <div className="max-w-7xl mx-auto px-6 h-[58px] flex items-center justify-between relative">

              {/* ── Logo ── */}
              <a
                href="#home"
                onClick={e => handleNavClick(e, 'home')}
                className="flex items-center cursor-pointer shrink-0 -ml-1 sm:-ml-3"
                aria-label="Home"
              >
                <span className="font-orbitron font-bold text-[15px] sm:text-[16px] tracking-wider text-accent hover:text-accent/80 transition-colors duration-200 select-none">
                  Albin Thomas
                </span>
              </a>

              {/* ── Center Nav Links ── */}
              <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-7 h-full" aria-label="Main navigation">
                {navLinks.map(page => {
                  const isActive = activeSection === page.id
                  return (
                    <a
                      key={page.id}
                      href={`#${page.id}`}
                      onClick={e => handleNavClick(e, page.id)}
                      className={`relative flex items-center h-full text-[10.5px] font-mono tracking-[0.22em] font-bold
                                  transition-colors duration-300 select-none
                                  ${isActive ? 'text-accent' : 'text-white/50 hover:text-white/85'}`}
                    >
                      <span>{getLabel(page.id)}</span>

                      {/* Fire active indicator */}
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                          {/* Soft glow bloom behind bar */}
                          <div className="absolute bottom-0 w-14 h-[8px] rounded-full"
                            style={{ background: 'radial-gradient(ellipse, #ff6a0088 0%, transparent 70%)', filter: 'blur(3px)' }} />
                          {/* Sharp fire bar */}
                          <motion.div
                            layoutId="nav-fire"
                            className="w-8 h-[2.5px] rounded-sm relative z-10"
                            style={{ background: 'linear-gradient(to right, #ff3b0f, #ff8500, #ffaa1f)' }}
                            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                          >
                            {/* Ember sparks */}
                            <span className="spark absolute w-[3px] h-[3px] rounded-full bg-[#ffcc55]"
                              style={{ left: '18%', bottom: '1px', animationDelay: '0.1s', animationDuration: '1s' }} />
                            <span className="spark absolute w-[2px] h-[2px] rounded-full bg-[#ff8500]"
                              style={{ left: '52%', bottom: '1px', animationDelay: '0.5s', animationDuration: '1.3s' }} />
                            <span className="spark absolute w-[3px] h-[3px] rounded-full bg-[#ff4b1f]"
                              style={{ left: '78%', bottom: '1px', animationDelay: '0s',  animationDuration: '1.1s' }} />
                          </motion.div>
                        </div>
                      )}
                    </a>
                  )
                })}
              </nav>

              {/* ── Resume Button ── */}
              <a
                href="/resume.pdf"
                download
                className="relative shrink-0 group -mr-1 sm:-mr-3"
                aria-label="Download Resume"
              >
                {/* Subtle outer glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                             bg-accent/15 blur-[6px] pointer-events-none"
                  style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}
                />
                <div
                  className="flex items-center gap-1.5 px-4 py-1.5
                             border border-accent/30 bg-accent/[0.04]
                             group-hover:border-accent/65 group-hover:bg-accent/[0.1]
                             text-accent font-mono text-[10.5px] tracking-[0.22em] uppercase
                             transition-all duration-300 cursor-pointer select-none"
                  style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}
                >
                  <span>RESUME</span>
                  <DownloadIcon />
                </div>
              </a>



            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  )
}
