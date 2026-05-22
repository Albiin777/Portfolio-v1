import { useState, useEffect } from 'react'
import { NAV_PAGES } from '../context/NavigationContext'
import { motion } from 'framer-motion'

export default function GlobalIndicator() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      // Find the currently active section based on scroll position
      let currentIdx = 0
      
      for (let i = 0; i < NAV_PAGES.length; i++) {
        const section = document.getElementById(NAV_PAGES[i].id)
        if (section) {
          const rect = section.getBoundingClientRect()
          // If the top of the section is above the middle of the screen
          if (rect.top <= window.innerHeight / 2) {
            currentIdx = i
          }
        }
      }
      
      setActiveIndex(currentIdx)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="fixed left-4 md:left-10 top-12 bottom-12 w-[1px] bg-white/15 z-40 flex flex-col items-center pointer-events-none hidden md:flex"
    >
      <div className="absolute -top-4 w-8 h-8 border border-white/30 rounded-full before:absolute before:inset-y-[-6px] before:left-1/2 before:w-[1px] before:bg-white/40 after:absolute after:inset-x-[-6px] after:top-1/2 after:h-[1px] after:bg-white/40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
      </div>

      {/* Ticks/Dashes */}
      <div className="absolute top-0 bottom-0 w-[6px] -left-[2.5px]" style={{ background: 'repeating-linear-gradient(to bottom, transparent, transparent 19px, rgba(255,255,255,0.3) 19px, rgba(255,255,255,0.3) 20px)' }} />

      {/* Glowing Indicator Wrapper (Confines glow between the two centers) */}
      <div className="absolute inset-0 w-[10px] -left-[4.5px] overflow-hidden flex justify-center z-0">
        {/* Glowing Indicator */}
        <div
          className="absolute w-[2px] h-[100px] shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            top: `calc(${(activeIndex / (NAV_PAGES.length - 1)) * 100}% - 50px)`,
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.9), transparent)'
          }}
        />
      </div>

      <div className="absolute -bottom-4 w-8 h-8 border border-white/30 rounded-full before:absolute before:inset-y-[-6px] before:left-1/2 before:w-[1px] before:bg-white/40 after:absolute after:inset-x-[-6px] after:top-1/2 after:h-[1px] after:bg-white/40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
      </div>
    </motion.div>
  )
}
