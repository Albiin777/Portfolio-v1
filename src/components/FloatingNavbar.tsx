import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_PAGES } from '../context/NavigationContext'

export default function FloatingNavbar() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const isProgrammaticScroll = useRef(false)
  const scrollTimeout = useRef<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      // Toggle navbar visibility
      if (window.scrollY > 80) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      // If scrolling programmatically (via navbar click), ignore scroll events for active section detection
      if (isProgrammaticScroll.current) return

      // Find the currently active section based on scroll position (matching GlobalIndicator's 50% threshold)
      let active = 'home'
      for (let i = 0; i < NAV_PAGES.length; i++) {
        const section = document.getElementById(NAV_PAGES[i].id)
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= window.innerHeight / 2) {
            active = NAV_PAGES[i].id
          }
        }
      }
      setActiveSection(active)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Run once on mount

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout.current !== null) {
        window.clearTimeout(scrollTimeout.current)
      }
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const section = document.getElementById(id)
    if (section) {
      isProgrammaticScroll.current = true
      setActiveSection(id)

      if (scrollTimeout.current !== null) {
        window.clearTimeout(scrollTimeout.current)
      }

      section.scrollIntoView({ behavior: 'smooth' })
      window.history.pushState(null, '', `#${id}`)

      // Release scroll block after smooth scroll duration
      scrollTimeout.current = window.setTimeout(() => {
        isProgrammaticScroll.current = false
      }, 800)
    }
  }

  const getLabel = (id: string) => {
    switch (id) {
      case 'home': return 'Home'
      case 'journey': return 'Journey'
      case 'skills': return 'Skills'
      case 'coding': return 'Coding'
      case 'projects': return 'Projects'
      case 'contact': return 'Contact'
      default: return id.charAt(0).toUpperCase() + id.slice(1)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: -100, opacity: 0, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-6 left-1/2 z-50 flex items-center justify-center max-w-[95%] sm:max-w-md md:max-w-[480px]"
        >
          {/* Main capsule bar container - highly transparent, overflow-hidden to contain the glow, clean glass design */}
          <div 
            className="relative flex items-center justify-center gap-1.5 sm:gap-3 md:gap-4 px-2 py-1.5 bg-black/[0.12] backdrop-blur-xl rounded-full border border-white/[0.06] w-full sm:w-auto overflow-hidden"
            style={{
              cursor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cdefs%3E%3CradialGradient id='glow' cx='50%' cy='50%' r='50%'%3E%3Cstop offset='0%25' stop-color='%23ff4b1f' stop-opacity='0.65'/%3E%3Cstop offset='45%25' stop-color='%23ff8500' stop-opacity='0.3'/%3E%3Cstop offset='100%25' stop-color='%23ff4b1f' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='28' cy='28' r='26' fill='url(%23glow)'/%3E%3C/svg%3E") 28 28, auto`
            }}
          >
            
            {/* Navigation links */}
            {NAV_PAGES.map((page) => {
              const isActive = activeSection === page.id
              
              return (
                <a
                  key={page.id}
                  href={`#${page.id}`}
                  onClick={(e) => handleNavClick(e, page.id)}
                  style={{ cursor: 'inherit' }}
                  className={`relative px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs md:text-sm font-medium transition-all duration-300 rounded-full flex items-center justify-center select-none group ${
                    isActive 
                      ? 'text-white' 
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {/* Glowing active item background pill & ambient glow */}
                  {isActive && (
                    <>
                      {/* Ambient fire sparkle glow behind active item - contained inside capsule */}
                      <div className="absolute inset-0.5 rounded-full bg-[#ff4b1f]/20 blur-[5px] opacity-70 animate-pulse pointer-events-none" />
                      
                      {/* Crisp gradient-bordered capsule with smooth motion physics */}
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 rounded-full p-[1.5px] bg-gradient-to-r from-[#ff4b1f] via-[#ff8500] to-[#ffaa1f] shadow-[0_0_10px_rgba(255,75,31,0.4)]"
                        transition={{ type: 'spring', stiffness: 180, damping: 24 }}
                      >
                        <div className="w-full h-full rounded-full bg-[#0a0a0a]/85 backdrop-blur-md" />
                      </motion.div>
                    </>
                  )}

                  <span className="relative z-10 transition-transform duration-300 group-hover:scale-[1.12] block origin-center">
                    {getLabel(page.id)}
                  </span>
                </a>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
