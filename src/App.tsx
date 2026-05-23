import { Routes, Route } from 'react-router-dom'
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

const PortfolioPage = () => (
  <>
    <main className="w-full flex flex-col">
      <section id="home">
        <Home />
      </section>
      <section id="journey">
        <Journey />
      </section>
      <section id="skills">
        <Skills />
      </section>
      <section id="coding">
        <CodingProfiles />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="contact">
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
  return (
    <NavigationProvider>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </NavigationProvider>
  )
}
