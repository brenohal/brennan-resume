import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import SocialRail from './components/layout/SocialRail'
import Hero from './components/sections/Hero'
import Stats from './components/sections/Stats'
import About from './components/sections/About'
import Experience from './components/sections/Experience'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'
import ScrollToTop from './components/ui/ScrollToTop'
import ScrollProgress from './components/ui/ScrollProgress'
import CommandPalette from './components/ui/CommandPalette'
import ChatAssistant from './components/ui/ChatAssistant'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollProgress />
      <Navbar />
      <SocialRail />
      <main id="main">
        <Hero />
        <Stats />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <CommandPalette />
      <ChatAssistant />
    </>
  )
}
