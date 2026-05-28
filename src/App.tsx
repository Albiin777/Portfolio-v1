import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { NavigationProvider } from './context/NavigationContext'
import Home from './pages/Home'
import Journey from './pages/Journey'
import Skills from './pages/Skills'
import CodingProfiles from './pages/CodingProfiles'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import AnonymousChat from './components/AnonymousChat'
import FloatingNavbar from './components/FloatingNavbar'
import CircularMobileNav from './components/CircularMobileNav'
import GlobalIndicator from './components/GlobalIndicator'
import SpaceCursor from './components/SpaceCursor'

export type ThemeOrigin = {
  x: number
  y: number
}

type ThemePulse = {
  mode: 'sunrise' | 'sunset'
  origin: ThemeOrigin
}

const PortfolioPage = ({
  isDayMode,
  onToggleDayMode
}: {
  isDayMode: boolean
  onToggleDayMode: (origin?: ThemeOrigin) => void
}) => (
  <>
    <main className="w-full flex flex-col">
      <section id="home" className="scroll-mt-6 md:scroll-mt-0">
        <Home />
      </section>
      <section id="journey" className="scroll-mt-6 md:scroll-mt-0">
        <Journey />
      </section>
      <section id="skills" className="scroll-mt-6 md:scroll-mt-0">
        <Skills />
      </section>
      <section id="coding" className="scroll-mt-6 md:scroll-mt-0">
        <CodingProfiles />
      </section>
      <section id="projects" className="scroll-mt-6 md:scroll-mt-0">
        <Projects />
      </section>
      <section id="contact" className="scroll-mt-6 md:scroll-mt-0">
        <Contact />
      </section>
    </main>
    <GlobalIndicator />
    <FloatingNavbar isDayMode={isDayMode} onToggleDayMode={onToggleDayMode} />
    <CircularMobileNav isDayMode={isDayMode} onToggleDayMode={onToggleDayMode} />
    <AnonymousChat />
  </>
)

export default function App() {
  const location = useLocation()
  const showCustomCursor = location.pathname !== '/admin'
  const [isDayMode, setIsDayMode] = useState(() => {
    if (typeof window === 'undefined') return true
    const stored = window.localStorage.getItem('portfolio-theme')
    if (stored) return stored === 'day'
    return true
  })
  const [themePulse, setThemePulse] = useState<ThemePulse | null>(null)

  useEffect(() => {
    window.localStorage.setItem('portfolio-theme', isDayMode ? 'day' : 'dark')
  }, [isDayMode])

  const toggleDayMode = (origin: ThemeOrigin = { x: window.innerWidth / 2, y: window.innerHeight / 2 }) => {
    if (isDayMode) {
      setThemePulse({ mode: 'sunset', origin })
      window.setTimeout(() => setIsDayMode(false), 760)
      return
    }

    setThemePulse({ mode: 'sunrise', origin })
    window.setTimeout(() => setIsDayMode(true), 760)
  }

  useEffect(() => {
    if (!themePulse) return
    const timeout = window.setTimeout(() => setThemePulse(null), 1180)
    return () => window.clearTimeout(timeout)
  }, [themePulse])

  return (
    <NavigationProvider>
      <div className={`${isDayMode ? 'day-mode' : ''} min-h-screen`}>
        {themePulse && (
          <div className={`theme-shift theme-shift-${themePulse.mode}`} />
        )}
        {showCustomCursor && <SpaceCursor />}
        <Routes>
          <Route path="/" element={<PortfolioPage isDayMode={isDayMode} onToggleDayMode={toggleDayMode} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </NavigationProvider>
  )
}
