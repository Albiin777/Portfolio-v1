import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_PAGES } from '../context/NavigationContext'
import { useDocData } from '../lib/content'

type ProfileData = {
  resumeUrl: string
}

export default function FloatingNavbar() {
  const profile = useDocData<ProfileData>('profile', 'main', { resumeUrl: '/Albin_Thomas-resume.pdf' })
  const resumeUrl = profile.resumeUrl || '/Albin_Thomas-resume.pdf'
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
      home: 'HOME', journey: 'JOURNEY', skills: 'SKILLS',
      projects: 'PROJECTS', contact: 'CONTACT',
    }
    return map[id] ?? id.toUpperCase()
  }

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
                background: 'linear-gradient(to right, transparent, #FFB00099 30%, #ff8500cc 50%, #FFB00099 70%, transparent)',
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
                <span className="font-grotesk font-bold text-[19px] sm:text-[20px] tracking-wide text-accent hover:text-accent/80 transition-colors duration-200 select-none">
                  Albin Thomas
                </span>
              </a>

              {/* ── Center Nav Links ── */}
              <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-7 h-full" aria-label="Main navigation">
                {NAV_PAGES.map(page => {
                  const isActive = activeSection === page.id
                  const isSkills = page.id === 'skills'

                  return (
                    <div key={page.id} className="relative h-full flex items-center group">
                      <a
                        href={`#${page.id}`}
                        onClick={e => handleNavClick(e, page.id)}
                        className={`relative flex items-center h-full text-[13px] font-mono tracking-[0.22em] font-bold
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
                              <span className="spark absolute w-[3px] h-[3px] rounded-full bg-[#FFB000]"
                                style={{ left: '78%', bottom: '1px', animationDelay: '0s',  animationDuration: '1.1s' }} />
                            </motion.div>
                          </div>
                        )}
                      </a>

                      {/* Dropdown for Coding section under Skills */}
                      {isSkills && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300">
                          <div className="bg-[#060608]/90 backdrop-blur-md border border-white/10 rounded-lg p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col min-w-[140px] items-center">
                            <a
                              href="#coding"
                              onClick={(e) => {
                                handleNavClick(e, 'coding')
                                // Keep Skills active visually when navigating to Coding
                                setActiveSection('skills')
                              }}
                              className="w-full text-center text-[12px] font-mono tracking-[0.2em] font-bold text-white/50 hover:text-accent hover:bg-white/5 px-4 py-3 rounded-md transition-colors whitespace-nowrap"
                            >
                              CODING STATS
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>

              {/* ── Resume Button ── */}
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative shrink-0 group -mr-1 sm:-mr-3"
                aria-label="View Resume"
              >
                <div
                  className="absolute -inset-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,176,0,0.28), rgba(255,85,31,0.22), transparent)',
                    filter: 'blur(9px)',
                  }}
                />
                <div
                  className="relative flex items-center justify-center px-5 py-2
                             border border-accent/45 bg-[#0a0a0a]/75 overflow-hidden
                             group-hover:border-accent group-hover:bg-accent
                             group-hover:text-black group-hover:shadow-[0_0_24px_rgba(255,176,0,0.24),inset_0_1px_0_rgba(255,255,255,0.25)]
                             text-accent font-mono text-[13px] tracking-[0.22em] uppercase
                             transition-all duration-300 cursor-pointer select-none"
                >
                  <span className="absolute inset-x-3 top-[4px] h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent transition-opacity duration-300 group-hover:opacity-0" />
                  <span className="absolute inset-x-3 bottom-[4px] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent transition-opacity duration-300 group-hover:opacity-0" />
                  <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.26),transparent)] transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative leading-none">Resume</span>
                </div>
              </a>



            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  )
}
