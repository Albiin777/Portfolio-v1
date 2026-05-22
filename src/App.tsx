import { Routes, Route } from 'react-router-dom'
import { NavigationProvider } from './context/NavigationContext'
import Home from './pages/Home'
import About from './pages/About'
import Journey from './pages/Journey'
import Skills from './pages/Skills'
import Contact from './pages/Contact'
import AnonymousChat from './components/AnonymousChat'
import FloatingNavbar from './components/FloatingNavbar'
import GlobalIndicator from './components/GlobalIndicator'

export default function App() {
  return (
    <NavigationProvider>
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
        <section id="contact">
          <Contact />
        </section>
      </main>
      <GlobalIndicator />
      <FloatingNavbar />
      <AnonymousChat />
    </NavigationProvider>
  )
}
