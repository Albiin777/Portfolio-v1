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

const PortfolioPage = () => (
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
    <FloatingNavbar />
    <CircularMobileNav />
    <AnonymousChat />
  </>
)

export default function App() {
  const location = useLocation()
  const showCustomCursor = location.pathname !== '/admin'

  return (
    <NavigationProvider>
      {showCustomCursor && <SpaceCursor />}
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </NavigationProvider>
  )
}
