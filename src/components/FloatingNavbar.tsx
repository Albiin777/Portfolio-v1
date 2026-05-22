import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const ICONS = [
  {
    path: '#home',
    id: 'home',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    )
  },
  {
    path: '#journey',
    id: 'user',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    )
  },
  {
    path: '#skills',
    id: 'code',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    )
  },
  {
    path: '#work',
    id: 'briefcase',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    )
  },
  {
    path: '#contact',
    id: 'mail',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
    )
  }
]

export default function FloatingNavbar() {
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Only show the navbar if we are scrolled down a bit
      if (window.scrollY > 80) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: -100, opacity: 0, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-6 left-1/2 z-50 flex items-center justify-center"
        >
          <div className="flex items-center gap-6 px-8 py-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            {ICONS.map((icon) => {
              const isActive = location.hash === icon.path || (location.hash === '' && icon.path === '#home')
              return (
                <a
                  key={icon.id}
                  href={icon.path}
                  className={`relative flex flex-col items-center justify-center transition-colors duration-300 ${
                    isActive ? 'text-accent' : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {icon.svg}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute -bottom-3 w-1 h-1 rounded-full bg-accent shadow-[0_0_8px_rgba(255,75,31,0.8)]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
