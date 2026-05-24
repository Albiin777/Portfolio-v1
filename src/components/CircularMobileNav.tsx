import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_PAGES } from '../context/NavigationContext'
import { useDocData } from '../lib/content'
import { smoothScrollToElement } from '../lib/smoothScroll'

type ProfileData = {
  resumeUrl: string
}

// Icons for the sections
const HomeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
const JourneyIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
const SkillsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
const CodingIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
const ProjectsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
const ContactIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
const getIconForPage = (id: string) => {
  switch (id) {
    case 'home': return <HomeIcon />
    case 'journey': return <JourneyIcon />
    case 'skills': return <SkillsIcon />
    case 'coding': return <CodingIcon />
    case 'projects': return <ProjectsIcon />
    case 'contact': return <ContactIcon />
    default: return <HomeIcon />
  }
}

const getLabel = (id: string) => {
  const map: Record<string, string> = {
    home: 'Home', journey: 'Journey', skills: 'Skills',
    coding: 'Coding', projects: 'Projects', contact: 'Contact',
  }
  return map[id] ?? id
}

export default function CircularMobileNav() {
  const profile = useDocData<ProfileData>('profile', 'main', { resumeUrl: '/Albin_Thomas-resume.pdf' })
  const resumeUrl = profile.resumeUrl || '/Albin_Thomas-resume.pdf'
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [scrollOffset, setScrollOffset] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const isProgrammaticScroll = useRef(false)
  const isNavigating = useRef(false)
  const scrollTimeout = useRef<number | null>(null)
  const menuScrollRef = useRef<HTMLDivElement>(null)
  
  const ITEM_HEIGHT = 80 // Fixed height for calculation

  useEffect(() => {
    const handlePageScroll = () => {
      // Calculate scroll progress percentage (runs always for buttery-smooth updates)
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      setScrollProgress(progress)

      if (isProgrammaticScroll.current) return
      let active = 'home'
      for (const page of NAV_PAGES) {
        const el = document.getElementById(page.id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight / 2.5) {
          active = page.id
        }
      }
      setActiveSection(active)
    }

    window.addEventListener('scroll', handlePageScroll, { passive: true })
    handlePageScroll()
    return () => {
      window.removeEventListener('scroll', handlePageScroll)
      if (scrollTimeout.current !== null) window.clearTimeout(scrollTimeout.current)
    }
  }, [])

  // Handle back button to close the menu
  useEffect(() => {
    if (!isOpen) return

    // Push a state so that back button can be intercepted
    window.history.pushState({ menuOpen: true }, '')

    const handlePopState = () => {
      setIsOpen(false)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      if (isNavigating.current) {
        isNavigating.current = false
      } else {
        if (window.history.state?.menuOpen) {
          window.history.back()
        }
      }
    }
  }, [isOpen])

  // Calculate the active index based on the page's active section
  const activeIndex = NAV_PAGES.findIndex(p => p.id === activeSection)

  // Sync menu scroll wheel to active page section when opened
  useEffect(() => {
    if (isOpen && menuScrollRef.current) {
      const targetScroll = activeIndex * ITEM_HEIGHT
      menuScrollRef.current.scrollTop = targetScroll
      setScrollOffset(targetScroll)
    }
  }, [activeIndex, isOpen])

  const handleMenuScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollOffset(e.currentTarget.scrollTop)
  }

  const handleNavClick = (id: string, index: number) => {
    const section = document.getElementById(id)
    if (!section) return
    isProgrammaticScroll.current = true
    setActiveSection(id)
    
    // Smoothly scroll the menu wheel to the tapped item
    if (menuScrollRef.current) {
      menuScrollRef.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: 'smooth'
      })
    }

    isNavigating.current = true

    setIsOpen(false)
    const duration = smoothScrollToElement(section)
    window.history.replaceState(null, '', `#${id}`)
    if (scrollTimeout.current !== null) window.clearTimeout(scrollTimeout.current)
    scrollTimeout.current = window.setTimeout(() => { isProgrammaticScroll.current = false }, duration + 120)
  }

  const continuousIndex = scrollOffset / ITEM_HEIGHT

  return (
    <div className="md:hidden">
      {/* Scroll Progress Bar (Phone Displays Only) */}
      <div className="fixed top-0 left-0 right-0 h-[4px] bg-white/15 z-[99999] pointer-events-none">
        <div 
          className="h-full transition-all duration-75 ease-out"
          style={{ 
            width: `${scrollProgress}%`,
            background: 'linear-gradient(to right, #ff3b0f, #ff8500, #ffaa1f)',
            boxShadow: '0 1px 8px rgba(255, 133, 0, 0.6)'
          }}
        />
      </div>

      {/* Floating Top Header (Always Visible on Mobile) */}
      <div className="fixed top-5 left-5 right-5 z-[100] flex flex-row items-center justify-between pointer-events-none transition-all duration-300">
        
        {/* Left Capsule - Brand */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            const section = document.getElementById('home');
            if (section) smoothScrollToElement(section);
            window.history.replaceState(null, '', '#home');
            setIsOpen(false);
          }}
          className="h-11 pl-2 pr-4 rounded-full bg-[#111111]/80 backdrop-blur-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-1 pointer-events-auto active:scale-95 transition-all"
          aria-label="Home"
        >
          <img
            src="/logo-new.png"
            alt=""
            aria-hidden="true"
            className="h-9 w-9 rounded-full object-contain"
          />
          <span className="font-orbitron font-bold text-[13px] tracking-widest text-accent whitespace-nowrap">
            ALBIN
          </span>
        </a>
        
        {/* Right Capsule - Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-11 px-4 rounded-full backdrop-blur-xl border shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-2.5 pointer-events-auto transition-all active:scale-95 shrink-0 ${
            isOpen 
              ? 'bg-[#111111]/90 border-accent/40 text-accent font-bold' 
              : 'bg-[#111111]/80 border-white/10 text-accent hover:bg-white/5'
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? 'close' : activeSection}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              {isOpen ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-accent uppercase font-bold">CLOSE</span>
                </>
              ) : (
                <>
                  <span className="text-accent flex items-center justify-center shrink-0">
                    {getIconForPage(activeSection)}
                  </span>
                  <span className="font-mono text-[9.5px] tracking-[0.2em] text-white uppercase font-bold">
                    {getLabel(activeSection)}
                  </span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* Overlay & Circular Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[90] pointer-events-none">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 pointer-events-none"
            >

              {/* Scrollable Watch Dial Container */}
              <div 
                ref={menuScrollRef}
                onScroll={handleMenuScroll}
                onClick={(e) => {
                  const target = e.target as HTMLElement
                  if (target.closest('button') || target.closest('a')) {
                    return
                  }
                  setIsOpen(false)
                }}
                className="absolute inset-0 overflow-y-auto overflow-x-hidden no-scrollbar snap-y snap-mandatory pointer-events-auto"
                style={{ scrollBehavior: 'smooth' }}
              >
                {/* Top Padding: exactly half screen minus half item height, adjusted by 4px up */}
                <div style={{ height: `calc(50vh - ${ITEM_HEIGHT / 2 + 4}px)` }} className="w-full shrink-0" />

                <div className="relative w-full flex flex-col items-start">
                  {NAV_PAGES.map((page, index) => {
                    const dist = Math.abs(index - continuousIndex)
                    const isVisuallyActive = dist < 0.5
                    
                    // Arc curve centered dynamically on whatever is in the middle of the scroll view
                    const xOffset = 50 - Math.pow(dist, 1.5) * 12
                    
                    // Gentler exponential blur and scale based on physical scroll distance
                    // Minimal blur for neighbors so they stay very readable
                    const blurAmount = dist < 1.1 ? 0 : Math.pow(dist - 1, 1.2) * 1.5
                    const scale = isVisuallyActive ? 1.15 : Math.max(0.85, 1 - dist * 0.05)
                    const opacity = isVisuallyActive ? 1 : Math.max(0.4, 1 - dist * 0.15)

                    return (
                      <div key={page.id} className="w-full snap-center shrink-0 flex items-center justify-end pr-6" style={{ height: `${ITEM_HEIGHT}px` }}>
                        <button
                          onClick={() => handleNavClick(page.id, index)}
                          className={`relative flex items-center gap-4 transition-all duration-75 group
                            ${isVisuallyActive ? 'px-4 py-2 bg-white/5 border border-white/20 rounded-2xl shadow-[0_0_15px_rgba(255, 176, 0,0.2)]' : ''}`}
                          style={{
                            transform: `translateX(${-xOffset}px) scale(${scale})`,
                            opacity: opacity,
                            filter: `blur(${blurAmount}px)`
                          }}
                        >
                          <span className={`font-sans tracking-wide ${isVisuallyActive ? 'text-white font-bold text-base' : 'text-white/80 font-medium text-sm'}`}>
                            {getLabel(page.id)}
                          </span>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors
                            ${isVisuallyActive ? 'bg-accent/20 border-accent/50 text-accent' : 'bg-white/5 border-white/10 text-white/70'}`}>
                            {getIconForPage(page.id)}
                          </div>
                        </button>
                      </div>
                    )
                  })}

                </div>

                {/* Bottom Padding */}
                <div style={{ height: `calc(50vh - ${ITEM_HEIGHT / 2}px)` }} className="w-full shrink-0" />
              </div>

            </motion.div>

            {/* View Resume - Fixed at bottom left to balance layout */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-6 left-4 pointer-events-auto"
            >
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-14 px-6 rounded-full bg-[#111111]/90 backdrop-blur-xl border border-accent/40 text-accent font-mono text-[12px] sm:text-[13px] tracking-widest uppercase active:scale-95 transition-all shadow-[0_0_20px_rgba(255, 176, 0,0.15)]"
              >
                <span>View Resume</span>
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
