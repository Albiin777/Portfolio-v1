import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Define Project interfaces
interface ProjectData {
  title: string
  subtitle?: string
  description: string
  bullets?: string[]
  tech: { name: string; color: string; icon: string }[]
  liveUrl: string
  codeUrl: string
  type: string // 'featured' | 'personal' | 'academic'
}

// Icons as pure CSS/SVG components
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0 mt-0.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
  </svg>
)

const GitHubIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const GraduationCapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
)

// Tech Micro Icons Map helper
const getTechIcon = (name: string) => {
  switch (name) {
    case 'React':
      return (
        <svg width="12" height="12" viewBox="-11.5 -10.23174 23 20.46348" className="text-[#61dafb] fill-none stroke-current" strokeWidth="1.2">
          <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
          <g stroke="currentColor">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
      )
    case 'Tailwind CSS':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" className="text-[#38bdf8] fill-current">
          <path d="M12 6.5c-2.4 0-3.6 1.2-3.6 3.6 0 2.4 1.2 3.6 3.6 3.6 2.4 0 3.6-1.2 3.6-3.6 0-2.4-1.2-3.6-3.6-3.6zm-6 6c-2.4 0-3.6 1.2-3.6 3.6 0 2.4 1.2 3.6 3.6 3.6 2.4 0 3.6-1.2 3.6-3.6 0-2.4-1.2-3.6-3.6-3.6z" />
        </svg>
      )
    case 'Node.js':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" className="text-[#339933] fill-current">
          <path d="M12 2L2.5 7.5v11L12 24l9.5-5.5v-11L12 2zm0 2.5l7.5 4.3v8.4L12 21.5l-7.5-4.3v-8.4L12 4.5z" />
        </svg>
      )
    case 'MongoDB':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" className="text-[#47A248] fill-current">
          <path d="M12 0C7.5 0 6 3 6 6c0 5 6 12 6 18 0-6 6-13 6-18 0-3-1.5-6-6-6zm0 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
        </svg>
      )
    case 'Python':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" className="fill-current text-[#3776AB]">
          <path d="M12 2c-3.3 0-6 2.7-6 6v3h6v2H6v3c0 3.3 2.7 6 6 6s6-2.7 6-6v-3h-6v-2h6V8c0-3.3-2.7-6-6-6z" />
        </svg>
      )
    case 'OpenCV':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" className="fill-current text-[#5C3EE8]">
          <circle cx="12" cy="6" r="4" />
          <circle cx="6" cy="16" r="4" />
          <circle cx="18" cy="16" r="4" />
        </svg>
      )
    case 'Next.js':
      return (
        <div className="w-3.5 h-3.5 bg-white text-black font-mono font-bold text-[8.5px] flex items-center justify-center rounded-[2px] leading-none select-none">N</div>
      )
    case 'Firebase':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#FFCA28]">
          <path d="M3.89 15.75L10.22 2.1c.32-.69 1.25-.69 1.57 0l1.62 3.47-9.52 10.18z" fill="#FFCA28" />
          <path d="M20.15 15.75L12 23.11c-.38.35-.93.35-1.32 0L3.89 15.75l9.52-10.18 6.74 10.18z" fill="#F57C00" />
          <path d="M12.91 5.92l1.62-3.47c.32-.69 1.25-.69 1.57 0l4.05 8.67-7.24-5.2z" fill="#FFA000" />
        </svg>
      )
    default:
      return null
  }
}

// CAROUSEL DATA STRUCTURES
const FEATURED_PROJECTS: ProjectData[] = [
  {
    title: 'Analytics Dashboard',
    description: 'A modern analytics dashboard with real-time insights, interactive charts and role-based access for seamless data visualization.',
    bullets: [
      'Real-time data visualization',
      'Role based authentication',
      'Interactive charts and filters',
      'Export reports in multiple formats'
    ],
    tech: [
      { name: 'React', color: '#61dafb', icon: 'React' },
      { name: 'Tailwind CSS', color: '#38bdf8', icon: 'Tailwind CSS' },
      { name: 'Node.js', color: '#339933', icon: 'Node.js' },
      { name: 'MongoDB', color: '#47a248', icon: 'MongoDB' }
    ],
    liveUrl: '#',
    codeUrl: '#',
    type: 'featured'
  },
  {
    title: 'AI Accident Detection App',
    description: 'Real-time accident detection using computer vision and deep learning to dispatch emergency responders automatically.',
    bullets: [
      'Real-time object detection and tracking',
      'Automated collision severity assessment',
      'Instant emergency alert pipeline',
      'Cloud dashboard for traffic monitoring'
    ],
    tech: [
      { name: 'React', color: '#61dafb', icon: 'React' },
      { name: 'Tailwind CSS', color: '#38bdf8', icon: 'Tailwind CSS' },
      { name: 'Python', color: '#3776ab', icon: 'Python' },
      { name: 'OpenCV', color: '#5c3ee8', icon: 'OpenCV' }
    ],
    liveUrl: '#',
    codeUrl: '#',
    type: 'featured'
  },
  {
    title: 'Web-based Trip Planner',
    description: 'Intelligent travel planner with route optimization, expense tracking, and collaborative real-time coordination tools.',
    bullets: [
      'AI-driven optimized route suggestions',
      'Interactive map integration and markers',
      'Multi-user real-time board collaboration',
      'Comprehensive budget and expense logs'
    ],
    tech: [
      { name: 'React', color: '#61dafb', icon: 'React' },
      { name: 'Tailwind CSS', color: '#38bdf8', icon: 'Tailwind CSS' },
      { name: 'Node.js', color: '#339933', icon: 'Node.js' },
      { name: 'Firebase', color: '#ffca28', icon: 'Firebase' }
    ],
    liveUrl: '#',
    codeUrl: '#',
    type: 'featured'
  }
]

const PERSONAL_PROJECTS: ProjectData[] = [
  {
    title: 'Portfolio Website',
    description: 'A personal portfolio built with Next.js and Tailwind CSS to showcase my work and skills.',
    tech: [
      { name: 'Next.js', color: '#ffffff', icon: 'Next.js' },
      { name: 'Tailwind CSS', color: '#38bdf8', icon: 'Tailwind CSS' }
    ],
    liveUrl: '#',
    codeUrl: '#',
    type: 'personal'
  },
  {
    title: 'Personal Chat App',
    description: 'Real-time messaging application with private channels, typing indicators, and file sharing.',
    tech: [
      { name: 'React', color: '#61dafb', icon: 'React' },
      { name: 'Firebase', color: '#ffca28', icon: 'Firebase' },
      { name: 'Tailwind CSS', color: '#38bdf8', icon: 'Tailwind CSS' }
    ],
    liveUrl: '#',
    codeUrl: '#',
    type: 'personal'
  },
  {
    title: 'Markdown Editor',
    description: 'A web-based Markdown editor with live preview side-by-side, autosave, and text formatting shortcuts.',
    tech: [
      { name: 'React', color: '#61dafb', icon: 'React' },
      { name: 'Tailwind CSS', color: '#38bdf8', icon: 'Tailwind CSS' }
    ],
    liveUrl: '#',
    codeUrl: '#',
    type: 'personal'
  },
  {
    title: 'Habit Tracker',
    description: 'A minimalist habit tracking dashboard logging daily completions with visual streaks and reminders.',
    tech: [
      { name: 'React', color: '#61dafb', icon: 'React' },
      { name: 'Tailwind CSS', color: '#38bdf8', icon: 'Tailwind CSS' },
      { name: 'Firebase', color: '#ffca28', icon: 'Firebase' }
    ],
    liveUrl: '#',
    codeUrl: '#',
    type: 'personal'
  }
]

const ACADEMIC_PROJECTS: ProjectData[] = [
  {
    title: 'Smart Attendance System',
    description: 'Face recognition based attendance system developed using Python and OpenCV.',
    tech: [
      { name: 'Python', color: '#3776ab', icon: 'Python' },
      { name: 'OpenCV', color: '#5c3ee8', icon: 'OpenCV' }
    ],
    liveUrl: '#',
    codeUrl: '#',
    type: 'academic'
  },
  {
    title: 'Accident Detection Model',
    description: 'Vehicular collision detection model trained using YOLO and PyTorch on municipal camera feeds.',
    tech: [
      { name: 'Python', color: '#3776ab', icon: 'Python' },
      { name: 'OpenCV', color: '#5c3ee8', icon: 'OpenCV' }
    ],
    liveUrl: '#',
    codeUrl: '#',
    type: 'academic'
  },
  {
    title: 'DBMS Library Portal',
    description: 'Secure university database system managing inventory, fine calculations, and active reservations.',
    tech: [
      { name: 'Next.js', color: '#ffffff', icon: 'Next.js' },
      { name: 'Firebase', color: '#ffca28', icon: 'Firebase' }
    ],
    liveUrl: '#',
    codeUrl: '#',
    type: 'academic'
  },
  {
    title: 'Network Packet Sniffer',
    description: 'Raw sockets analyzer built in C to inspect packet headers, protocol distributions, and log traffic.',
    tech: [
      { name: 'Python', color: '#3776ab', icon: 'Python' }
    ],
    liveUrl: '#',
    codeUrl: '#',
    type: 'academic'
  }
]

export default function Projects() {
  const [featuredIdx, setFeaturedIdx] = useState(0)
  const [personalIdx, setPersonalIdx] = useState(0)
  const [academicIdx, setAcademicIdx] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  // Handlers for sliders
  const nextFeatured = () => setFeaturedIdx((prev) => (prev + 1) % FEATURED_PROJECTS.length)
  const prevFeatured = () => setFeaturedIdx((prev) => (prev - 1 + FEATURED_PROJECTS.length) % FEATURED_PROJECTS.length)

  const nextPersonal = () => setPersonalIdx((prev) => (prev + 1) % PERSONAL_PROJECTS.length)
  const prevPersonal = () => setPersonalIdx((prev) => (prev - 1 + PERSONAL_PROJECTS.length) % PERSONAL_PROJECTS.length)

  const nextAcademic = () => setAcademicIdx((prev) => (prev + 1) % ACADEMIC_PROJECTS.length)
  const prevAcademic = () => setAcademicIdx((prev) => (prev - 1 + ACADEMIC_PROJECTS.length) % ACADEMIC_PROJECTS.length)


  return (
    <div className="relative w-full py-16 md:py-20 bg-bg-dark text-white font-sans overflow-hidden border-t border-white/[0.02]">
      {/* Glow Effects */}
      <div className="absolute left-[-10%] top-[10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute right-[-10%] bottom-[20%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-14 text-left max-w-3xl">
          <div className="font-mono text-white/40 text-xs mb-4 tracking-[0.2em] uppercase flex items-center gap-3">
            <span>05 // PROJECTS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 flex items-center gap-3">
            <span className="text-white">My</span>
            <span className="text-accent">Projects</span>
          </h2>
          <p className="text-white/45 text-sm md:text-base font-mono leading-relaxed">
            A showcase of selected work that demonstrates my skills, creativity and problem-solving approach.
          </p>
          <div className="w-16 h-[2px] bg-accent relative mt-4">
            <div className="absolute top-1/2 left-full -translate-y-1/2 w-1.5 h-1.5 ml-1">
              <span className="absolute inset-0 rounded-full bg-accent opacity-80" />
              <span className="absolute inset-0 rounded-full bg-accent animate-ping" />
            </div>
          </div>
        </div>

        {/* Featured Project Carousel Row */}
        <div className="relative max-w-6xl mx-auto mb-16 px-4 md:px-8">
          
          {/* Arrow Left */}
          <button 
            onClick={prevFeatured}
            className="absolute left-[-12px] md:left-0 top-[50%] -translate-y-1/2 w-10 h-10 rounded-full border border-accent/20 bg-black/60 hover:bg-accent/15 hover:border-accent flex items-center justify-center transition-all duration-300 text-accent cursor-pointer z-20 group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transform group-hover:-translate-x-0.5 transition-transform duration-300">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Arrow Right */}
          <button 
            onClick={nextFeatured}
            className="absolute right-[-12px] md:right-0 top-[50%] -translate-y-1/2 w-10 h-10 rounded-full border border-accent/20 bg-black/60 hover:bg-accent/15 hover:border-accent flex items-center justify-center transition-all duration-300 text-accent cursor-pointer z-20 group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transform group-hover:translate-x-0.5 transition-transform duration-300">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Card Container */}
          <div 
            className="w-full bg-[#111113]/40 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-accent/15 transition-all duration-300 group overflow-hidden min-h-[500px] md:min-h-[440px] relative"
            onMouseMove={handleMouseMove}
          >
            {/* Mouse-following splash glow & dots */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0 overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(220px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 75, 31, 0.14), transparent 80%)'
                }}
              />
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle, #ff4b1f 1.2px, transparent 1.2px)',
                  backgroundSize: '10px 10px',
                  WebkitMaskImage: 'radial-gradient(160px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), black, transparent 80%)',
                  maskImage: 'radial-gradient(160px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), black, transparent 80%)',
                  opacity: 0.65
                }}
              />
            </div>
            
            <AnimatePresence mode="wait" initial={false}>
              <motion.div 
                key={featuredIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full relative z-10"
              >
                {/* Left side details */}
                <div className="flex flex-col h-full justify-between py-1">
                  <div>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-[10px] font-mono uppercase tracking-wider mb-5">
                      <StarIcon />
                      <span>Featured Project</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">
                      {FEATURED_PROJECTS[featuredIdx].title}
                    </h3>
                    
                    <p className="text-white/50 text-sm md:text-base font-mono mb-6 leading-relaxed">
                      {FEATURED_PROJECTS[featuredIdx].description}
                    </p>

                    {/* Bullet list */}
                    {FEATURED_PROJECTS[featuredIdx].bullets && (
                      <ul className="flex flex-col gap-2.5 mb-8">
                        {FEATURED_PROJECTS[featuredIdx].bullets?.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-white/70 font-mono">
                            <CheckIcon />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    {/* Tech list */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {FEATURED_PROJECTS[featuredIdx].tech.map((lang) => (
                        <div 
                          key={lang.name}
                          className="border border-white/5 bg-white/[0.02] hover:border-accent/40 hover:bg-accent/5 rounded-lg px-3 py-1.5 flex items-center gap-2 text-[11px] font-mono text-white/80 hover:text-white transition-all duration-300"
                        >
                          {getTechIcon(lang.name)}
                          <span>{lang.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-4">
                      <a 
                        href={FEATURED_PROJECTS[featuredIdx].liveUrl}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-accent text-accent hover:bg-accent hover:text-white font-mono text-[11px] uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(224,90,43,0.05)] cursor-pointer"
                      >
                        <span>Live Demo</span>
                        <ExternalLinkIcon />
                      </a>
                      <a 
                        href={FEATURED_PROJECTS[featuredIdx].codeUrl}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white/70 hover:text-white hover:border-white/30 font-mono text-[11px] uppercase tracking-wider transition-all duration-300 cursor-pointer"
                      >
                        <span>Source Code</span>
                        <GitHubIcon />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right side mockup */}
                <div className="relative w-full aspect-[4/3] rounded-xl border border-white/10 bg-[#08080a]/80 shadow-2xl p-4 overflow-hidden flex flex-col justify-between group-hover:border-accent/20 transition-all duration-500">
                  {featuredIdx === 0 && (
                    /* High fidelity Analytics Dashboard CSS Mockup */
                    <div className="w-full h-full flex flex-col justify-between font-mono text-[9px] text-white/60">
                      {/* Top header line */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-accent" />
                          <span className="font-bold text-white text-[10px] tracking-tight">DashBoard</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-white/40 text-[8px] flex items-center gap-1">
                            <span>Q Search...</span>
                          </div>
                          <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-white/60">
                            <span className="text-[7px]">🔔</span>
                          </div>
                          <div className="w-4 h-4 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-[7px] text-accent font-bold">AT</div>
                        </div>
                      </div>

                      {/* Main screen row */}
                      <div className="flex-1 flex gap-3 overflow-hidden">
                        {/* Sidebar pane */}
                        <div className="w-[64px] border-r border-white/5 pr-1.5 flex flex-col gap-1.5">
                          <div className="bg-accent/10 border border-accent/30 text-accent font-bold px-2 py-1 rounded">Overview</div>
                          <div className="px-2 py-0.5 hover:text-white">Analytics</div>
                          <div className="px-2 py-0.5 hover:text-white">Users</div>
                          <div className="px-2 py-0.5 hover:text-white">Reports</div>
                          <div className="px-2 py-0.5 hover:text-white">Settings</div>
                        </div>

                        {/* Content area */}
                        <div className="flex-1 flex flex-col justify-between h-full">
                          {/* Mini Stats row */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white/[0.02] border border-white/5 rounded p-1.5 flex flex-col justify-between min-h-[44px]">
                              <span className="text-white/40 text-[7px] uppercase">Total Users</span>
                              <div className="flex items-baseline justify-between mt-1">
                                <span className="font-bold text-white text-[11px]">12,540</span>
                                <span className="text-emerald-500 text-[6.5px] font-bold">+12.5%</span>
                              </div>
                              <div className="w-full h-2 mt-1">
                                <svg className="w-full h-full text-emerald-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                                  <path d="M0,15 Q25,8 50,13 T100,5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                              </div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 rounded p-1.5 flex flex-col justify-between min-h-[44px]">
                              <span className="text-white/40 text-[7px] uppercase">Active Sessions</span>
                              <div className="flex items-baseline justify-between mt-1">
                                <span className="font-bold text-white text-[11px]">8,102</span>
                                <span className="text-rose-500 text-[6.5px] font-bold">-8.1%</span>
                              </div>
                              <div className="w-full h-2 mt-1">
                                <svg className="w-full h-full text-rose-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                                  <path d="M0,5 Q25,12 50,7 T100,16" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                              </div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 rounded p-1.5 flex flex-col justify-between min-h-[44px]">
                              <span className="text-white/40 text-[7px] uppercase">Conversion</span>
                              <div className="flex items-baseline justify-between mt-1">
                                <span className="font-bold text-white text-[11px]">3.24%</span>
                                <span className="text-emerald-500 text-[6.5px] font-bold">+2.4%</span>
                              </div>
                              <div className="w-full h-2 mt-1">
                                <svg className="w-full h-full text-emerald-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                                  <path d="M0,18 Q25,14 50,12 T100,4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Charts Row */}
                          <div className="flex-1 grid grid-cols-5 gap-2 mt-2 items-stretch min-h-[80px]">
                            {/* Bar Chart box */}
                            <div className="col-span-3 bg-white/[0.015] border border-white/5 rounded p-2 flex flex-col justify-between">
                              <div className="flex justify-between items-center mb-1 text-white/55">
                                <span className="text-[7.5px] font-bold">Revenue Overview</span>
                                <span className="text-[6.5px] border border-white/10 rounded px-1">This Year</span>
                              </div>
                              <div className="flex-1 flex items-end justify-between px-1.5 pt-2.5">
                                <div className="w-2.5 h-[30%] bg-accent/80 rounded-t" />
                                <div className="w-2.5 h-[50%] bg-accent/80 rounded-t" />
                                <div className="w-2.5 h-[40%] bg-accent/80 rounded-t" />
                                <div className="w-2.5 h-[65%] bg-accent/80 rounded-t" />
                                <div className="w-2.5 h-[80%] bg-accent rounded-t" />
                                <div className="w-2.5 h-[55%] bg-accent/80 rounded-t" />
                                <div className="w-2.5 h-[70%] bg-accent/80 rounded-t" />
                                <div className="w-2.5 h-[90%] bg-accent rounded-t" />
                              </div>
                              <div className="flex justify-between text-[6px] text-white/20 px-0.5 mt-1">
                                <span>Jan</span>
                                <span>Mar</span>
                                <span>May</span>
                                <span>Jul</span>
                                <span>Sep</span>
                                <span>Nov</span>
                              </div>
                            </div>

                            {/* Top Channels Donut chart */}
                            <div className="col-span-2 bg-white/[0.015] border border-white/5 rounded p-2 flex flex-col justify-between items-center text-center">
                              <span className="text-[7.5px] font-bold text-white/55 self-start">Top Channels</span>
                              <div className="relative w-11 h-11 flex items-center justify-center my-1">
                                <svg width="44" height="44" viewBox="0 0 44 44" className="transform -rotate-90">
                                  <circle cx="22" cy="22" r="16" stroke="rgba(255,255,255,0.03)" strokeWidth="4" fill="none" />
                                  <circle cx="22" cy="22" r="16" stroke="#ff4b1f" strokeWidth="4" strokeDasharray="100.5" strokeDashoffset="22" fill="none" strokeLinecap="round" />
                                </svg>
                                <span className="absolute text-[8px] font-bold text-white">78%</span>
                              </div>
                              <div className="flex gap-2 text-[5.5px] text-white/40">
                                <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-accent" />Direct</span>
                                <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-white/20" />Social</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {featuredIdx === 1 && (
                    /* AI Accident Detection Video feed UI Mockup */
                    <div className="w-full h-full flex flex-col justify-between font-mono text-[9px]">
                      {/* Top Header details */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-white/60">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                          </span>
                          <span className="font-bold text-white text-[9.5px] tracking-wider uppercase">CCTV FEED // CAM_04</span>
                        </div>
                        <span className="text-[7.5px] border border-rose-500/30 bg-rose-500/5 px-2 py-0.5 rounded text-rose-400 font-bold uppercase tracking-widest animate-pulse">COLLISION ALERT</span>
                      </div>

                      {/* Video canvas container */}
                      <div className="flex-1 relative border border-white/5 rounded-lg overflow-hidden bg-[#050507] flex items-center justify-center">
                        {/* Simulating road camera frame */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, transparent 20%, #000 70%), linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '100% 100%, 15px 15px, 15px 15px' }} />
                        
                        {/* Road lanes mock */}
                        <svg className="absolute inset-0 w-full h-full text-white/5" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <line x1="20" y1="100" x2="45" y2="40" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
                          <line x1="80" y1="100" x2="55" y2="40" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
                          <line x1="50" y1="100" x2="50" y2="40" stroke="currentColor" strokeWidth="1" />
                        </svg>

                        {/* Detection bounding boxes */}
                        {/* Car 1: Detected Safe */}
                        <div className="absolute left-[15%] top-[55%] border-2 border-emerald-500 rounded p-1 flex flex-col gap-0.5 select-none bg-emerald-500/5 animate-pulse" style={{ animationDuration: '4s' }}>
                          <span className="text-[6px] text-emerald-400 font-bold tracking-wider">CAR [98%] - SAFE</span>
                          <div className="w-[45px] h-[30px] border border-emerald-500/20" />
                        </div>

                        {/* Car 2 & 3: Detected Collision */}
                        <div className="absolute left-[40%] top-[40%] border-2 border-rose-500 rounded p-1 flex flex-col gap-0.5 select-none bg-rose-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                          <span className="text-[6px] text-rose-400 font-bold tracking-wider animate-bounce">COLLISION [99%]</span>
                          <div className="w-[60px] h-[40px] border border-rose-500/40 relative">
                            {/* Crosshairs */}
                            <span className="absolute top-1/2 left-0 w-full h-[1px] bg-rose-500/30" />
                            <span className="absolute left-1/2 top-0 w-[1px] h-full bg-rose-500/30" />
                          </div>
                        </div>

                        {/* OSD telemetry info overlay */}
                        <div className="absolute bottom-2 left-2 text-[6.5px] text-emerald-400 bg-black/75 px-1.5 py-0.5 border border-white/5 rounded font-mono flex flex-col">
                          <span>LAT: 40.7128° N</span>
                          <span>LON: 74.0060° W</span>
                          <span>FPS: 30.2</span>
                        </div>
                      </div>

                      {/* Log feed console at the bottom */}
                      <div className="h-[40px] mt-2 bg-black/40 border border-white/5 rounded p-1.5 text-white/40 text-[7px] font-mono flex flex-col gap-0.5 justify-start overflow-hidden">
                        <div className="flex gap-2"><span className="text-emerald-500">[04:21:05]</span><span className="text-white/60 font-semibold">COLLISION EVENT DETECTED ON CAM_04 // SEVERITY: HIGH</span></div>
                        <div className="flex gap-2"><span className="text-emerald-500">[04:21:07]</span><span>Triggering emergency alert service pipeline...</span></div>
                        <div className="flex gap-2"><span className="text-emerald-500">[04:21:10]</span><span className="text-emerald-400">Dispatch message sent successfully to Local EMS [ID: #894]</span></div>
                      </div>
                    </div>
                  )}

                  {featuredIdx === 2 && (
                    /* Web based Trip Planner high fidelity Map/Timeline UI Mockup */
                    <div className="w-full h-full flex flex-col justify-between font-mono text-[9px] text-white/60">
                      {/* Top Header */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px]">🗺️</span>
                          <span className="font-bold text-white text-[9.5px]">TripPlanner AI</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[7.5px] px-2 py-0.5 rounded font-bold">BOARD SYNCED</div>
                      </div>

                      {/* Split view */}
                      <div className="flex-1 flex gap-3 overflow-hidden">
                        
                        {/* Left column: Itinerary Timeline */}
                        <div className="w-[110px] border-r border-white/5 pr-1.5 flex flex-col gap-2 overflow-y-auto no-scrollbar">
                          <span className="text-[7.5px] uppercase font-bold text-accent">Itinerary Timeline</span>
                          
                          <div className="border border-white/10 rounded p-1.5 bg-white/[0.01] flex flex-col gap-1">
                            <span className="text-[8px] font-bold text-white flex justify-between"><span>Day 1: Arrival</span><span className="text-[6.5px] text-accent font-normal">Hotel</span></span>
                            <span className="text-[6.5px] text-white/40 leading-relaxed">Check-in at Sunset Lodge. Evening beachside walk.</span>
                          </div>

                          <div className="border border-white/10 rounded p-1.5 bg-white/[0.01] flex flex-col gap-1">
                            <span className="text-[8px] font-bold text-white flex justify-between"><span>Day 2: Hike</span><span className="text-[6.5px] text-accent font-normal">Peak B</span></span>
                            <span className="text-[6.5px] text-white/40 leading-relaxed">Morning hike on Ridge Trail. Pack lunch.</span>
                          </div>
                        </div>

                        {/* Right column: Interactive Map mockup */}
                        <div className="flex-1 flex flex-col justify-between h-full">
                          
                          {/* Map container */}
                          <div className="flex-1 relative rounded border border-white/5 bg-white/[0.01] overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '10px 10px' }} />
                            
                            {/* Dotted path route */}
                            <svg className="absolute inset-0 w-full h-full text-accent" viewBox="0 0 100 100">
                              <path d="M 20 80 Q 40 30 55 45 T 80 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                            </svg>

                            {/* Location Pins */}
                            {/* Pin A */}
                            <div className="absolute left-[20%] top-[72%] flex flex-col items-center">
                              <div className="w-2 h-2 rounded-full bg-accent border border-white shadow-[0_0_8px_rgba(224,90,43,0.8)] animate-pulse" />
                              <span className="text-[5.5px] bg-black/80 px-1 border border-white/10 rounded mt-0.5">Sunset Lodge</span>
                            </div>

                            {/* Pin B */}
                            <div className="absolute left-[52%] top-[40%] flex flex-col items-center">
                              <div className="w-2 h-2 rounded-full bg-accent border border-white shadow-[0_0_8px_rgba(224,90,43,0.8)]" />
                              <span className="text-[5.5px] bg-black/80 px-1 border border-white/10 rounded mt-0.5">Ridge Trail</span>
                            </div>

                            {/* Pin C */}
                            <div className="absolute left-[78%] top-[15%] flex flex-col items-center">
                              <div className="w-2 h-2 rounded-full bg-accent border border-white shadow-[0_0_8px_rgba(224,90,43,0.8)]" />
                              <span className="text-[5.5px] bg-black/80 px-1 border border-white/10 rounded mt-0.5">Summit Lake</span>
                            </div>
                          </div>

                          {/* Budget card */}
                          <div className="h-[36px] mt-2 bg-[#10b981]/5 border border-[#10b981]/20 rounded p-1.5 flex justify-between items-center text-[7.5px]">
                            <div className="flex flex-col">
                              <span className="text-[6.5px] text-white/45 uppercase leading-none mb-0.5">Total Expense Log</span>
                              <span className="font-bold text-white text-[9.5px]">$480.20 <span className="text-[6.5px] text-[#10b981] font-normal">/ $1,200 max</span></span>
                            </div>
                            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-[#10b981] rounded-full" style={{ width: '40%' }} />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel dots indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {FEATURED_PROJECTS.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setFeaturedIdx(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    featuredIdx === idx ? 'bg-accent w-4' : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

          </div>
        </div>

        {/* 2-Column Grid: Personal Projects & Academic Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Left Column: Personal Projects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-[#111113]/40 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-accent/15 transition-all duration-300 group overflow-hidden flex flex-col justify-between"
            onMouseMove={handleMouseMove}
          >
            {/* Mouse-following splash glow & dots */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0 overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(180px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 75, 31, 0.12), transparent 80%)'
                }}
              />
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle, #ff4b1f 1.2px, transparent 1.2px)',
                  backgroundSize: '10px 10px',
                  WebkitMaskImage: 'radial-gradient(130px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), black, transparent 80%)',
                  maskImage: 'radial-gradient(130px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), black, transparent 80%)',
                  opacity: 0.65
                }}
              />
            </div>
            <div className="absolute left-0 top-[20%] w-[2px] h-[40px] bg-accent shadow-[0_0_12px_rgba(224,90,43,0.8)] rounded-r pointer-events-none z-10" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.02)] group-hover:border-white/20 transition-colors duration-300">
                  <UserIcon />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors duration-300">Personal Projects</h3>
                  <span className="text-[10px] text-white/45 font-mono">My side projects & experiments</span>
                </div>
              </div>
              <p className="text-white/40 text-xs font-mono leading-relaxed mb-6">
                Projects built from my ideas, driven by curiosity and passion.
              </p>

              {/* Slider wrapper */}
              <div className="relative border border-white/5 bg-[#08080a]/60 rounded-xl p-4 overflow-hidden min-h-[310px] flex flex-col justify-between">
                
                {/* Internal arrows */}
                <button 
                  onClick={prevPersonal}
                  className="absolute left-2 top-[35%] w-7 h-7 rounded-full border border-white/10 bg-black/80 hover:bg-accent/10 hover:border-accent/40 flex items-center justify-center transition-all duration-300 text-white/60 hover:text-accent cursor-pointer z-10"
                >
                  <span className="text-xs">←</span>
                </button>
                <button 
                  onClick={nextPersonal}
                  className="absolute right-2 top-[35%] w-7 h-7 rounded-full border border-white/10 bg-black/80 hover:bg-accent/10 hover:border-accent/40 flex items-center justify-center transition-all duration-300 text-white/60 hover:text-accent cursor-pointer z-10"
                >
                  <span className="text-xs">→</span>
                </button>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={personalIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col justify-between h-full flex-1"
                  >
                    {/* CSS Mockup visual representation */}
                    <div className="w-full h-[110px] rounded-lg border border-white/5 bg-[#050507] overflow-hidden relative mb-4">
                      
                      {personalIdx === 0 && (
                        /* Portfolio Website Mockup */
                        <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-b from-[#180d07] to-[#050507] p-3 text-center">
                          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ff4b1f 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
                          <div className="flex flex-col items-center gap-1 font-mono">
                            <span className="text-[6px] text-white/40 tracking-[0.2em] uppercase">01 // HELLO</span>
                            <span className="text-[11px] font-bold text-white tracking-tight">Hi, I'm <span className="text-accent">Albin Thomas</span></span>
                            <span className="text-[6.5px] text-white/60 leading-none">Full Stack Developer & Engineer</span>
                            <div className="mt-1 px-2.5 py-0.5 border border-accent/40 bg-accent/5 rounded text-[5px] text-accent uppercase tracking-widest leading-none">Explore Work</div>
                          </div>
                        </div>
                      )}

                      {personalIdx === 1 && (
                        /* Task Automation Nodes Mockup */
                        <div className="w-full h-full flex items-center justify-center bg-[#07080a] p-3 font-mono text-[6px]">
                          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                          
                          <div className="flex items-center gap-3 relative z-10">
                            {/* Trigger Node */}
                            <div className="border border-emerald-500/30 bg-emerald-500/5 rounded p-1 flex flex-col gap-0.5 items-center">
                              <span className="text-[5.5px] text-emerald-400 font-bold uppercase leading-none">Github Hook</span>
                              <span className="text-[4.5px] text-white/40 leading-none">On: push</span>
                            </div>

                            {/* Arrow connector */}
                            <div className="text-accent flex items-center animate-pulse">──────▶</div>

                            {/* Action Node */}
                            <div className="border border-accent/30 bg-accent/5 rounded p-1 flex flex-col gap-0.5 items-center">
                              <span className="text-[5.5px] text-accent font-bold uppercase leading-none">Slack Alert</span>
                              <span className="text-[4.5px] text-white/40 leading-none">Send message</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {personalIdx === 2 && (
                        /* Markdown Editor Split Screen Mockup */
                        <div className="w-full h-full flex font-mono text-[5.5px]">
                          {/* Left edit pane */}
                          <div className="w-1/2 border-r border-white/5 p-2 bg-black/40 flex flex-col gap-1 text-white/45">
                            <span className="text-accent text-[5px] uppercase font-bold border-b border-white/5 pb-0.5 mb-0.5">editor.md</span>
                            <span># My Project Title</span>
                            <span>- Bullet List item 1</span>
                            <span>- Bullet List item 2</span>
                            <span>**Bold styling text**</span>
                          </div>

                          {/* Right preview pane */}
                          <div className="w-1/2 p-2 bg-white/[0.01] flex flex-col gap-1 text-white/70">
                            <span className="text-white/40 text-[5px] uppercase font-bold border-b border-white/5 pb-0.5 mb-0.5">preview</span>
                            <span className="text-[7px] font-bold text-white">My Project Title</span>
                            <span className="flex items-center gap-1"><span>•</span><span>Bullet List item 1</span></span>
                            <span className="flex items-center gap-1"><span>•</span><span>Bullet List item 2</span></span>
                            <span className="font-bold">Bold styling text</span>
                          </div>
                        </div>
                      )}

                      {personalIdx === 3 && (
                        /* Habit Tracker Calendar Grid Mockup */
                        <div className="w-full h-full flex flex-col justify-between p-2.5 font-mono text-[5.5px] text-white/50">
                          <span className="text-[6.5px] text-white/60 font-bold mb-1">Habits Tracker</span>
                          
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <span className="w-20">Morning Gym Workout</span>
                              <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-sm bg-accent" />
                                <span className="w-2 h-2 rounded-sm bg-accent" />
                                <span className="w-2 h-2 rounded-sm bg-accent" />
                                <span className="w-2 h-2 rounded-sm bg-accent/20" />
                                <span className="w-2 h-2 rounded-sm bg-accent" />
                              </div>
                              <span className="text-accent font-bold text-[6px]">80%</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="w-20">Book Reading (15m)</span>
                              <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-sm bg-accent" />
                                <span className="w-2 h-2 rounded-sm bg-accent" />
                                <span className="w-2 h-2 rounded-sm bg-accent" />
                                <span className="w-2 h-2 rounded-sm bg-accent" />
                                <span className="w-2 h-2 rounded-sm bg-accent" />
                              </div>
                              <span className="text-accent font-bold text-[6px]">100%</span>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Meta information */}
                    <div>
                      <h4 className="text-base font-bold text-white mb-2 leading-none">
                        {PERSONAL_PROJECTS[personalIdx].title}
                      </h4>
                      <p className="text-white/45 text-xs font-mono mb-4 leading-relaxed min-h-[36px]">
                        {PERSONAL_PROJECTS[personalIdx].description}
                      </p>
                    </div>

                    {/* Tech list & links row */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
                      <div className="flex gap-1.5">
                        {PERSONAL_PROJECTS[personalIdx].tech.map((t) => (
                          <div key={t.name} className="px-2 py-0.5 border border-white/5 bg-white/[0.02] rounded text-[8px] font-mono text-white/60">
                            {t.name}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <a href={PERSONAL_PROJECTS[personalIdx].liveUrl} className="p-1.5 border border-accent/20 text-accent hover:bg-accent/5 rounded-lg transition-colors cursor-pointer" title="Live Demo">
                          <ExternalLinkIcon />
                        </a>
                        <a href={PERSONAL_PROJECTS[personalIdx].codeUrl} className="p-1.5 border border-white/10 text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer" title="Source Code">
                          <GitHubIcon />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

              </div>
            </div>

            {/* Slider dots indicators */}
            <div className="flex justify-center gap-1.5 mt-5">
              {PERSONAL_PROJECTS.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setPersonalIdx(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    personalIdx === idx ? 'bg-accent w-3.5' : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

          </motion.div>

          {/* Right Column: Academic Projects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative bg-[#111113]/40 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-accent/15 transition-all duration-300 group overflow-hidden flex flex-col justify-between"
            onMouseMove={handleMouseMove}
          >
            {/* Mouse-following splash glow & dots */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0 overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(180px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 75, 31, 0.12), transparent 80%)'
                }}
              />
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle, #ff4b1f 1.2px, transparent 1.2px)',
                  backgroundSize: '10px 10px',
                  WebkitMaskImage: 'radial-gradient(130px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), black, transparent 80%)',
                  maskImage: 'radial-gradient(130px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), black, transparent 80%)',
                  opacity: 0.65
                }}
              />
            </div>
            <div className="absolute right-0 top-0 w-[45px] h-[2px] bg-accent shadow-[0_0_12px_rgba(224,90,43,0.8)] rounded-l pointer-events-none z-10" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.02)] group-hover:border-white/20 transition-colors duration-300">
                  <GraduationCapIcon />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors duration-300">Academic Projects</h3>
                  <span className="text-[10px] text-white/45 font-mono">Coursework & university projects</span>
                </div>
              </div>
              <p className="text-white/40 text-xs font-mono leading-relaxed mb-6">
                Academic and coursework projects built to learn and solve real-world problems.
              </p>

              {/* Slider wrapper */}
              <div className="relative border border-white/5 bg-[#08080a]/60 rounded-xl p-4 overflow-hidden min-h-[310px] flex flex-col justify-between">
                
                {/* Internal arrows */}
                <button 
                  onClick={prevAcademic}
                  className="absolute left-2 top-[35%] w-7 h-7 rounded-full border border-white/10 bg-black/80 hover:bg-accent/10 hover:border-accent/40 flex items-center justify-center transition-all duration-300 text-white/60 hover:text-accent cursor-pointer z-10"
                >
                  <span className="text-xs">←</span>
                </button>
                <button 
                  onClick={nextAcademic}
                  className="absolute right-2 top-[35%] w-7 h-7 rounded-full border border-white/10 bg-black/80 hover:bg-accent/10 hover:border-accent/40 flex items-center justify-center transition-all duration-300 text-white/60 hover:text-accent cursor-pointer z-10"
                >
                  <span className="text-xs">→</span>
                </button>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={academicIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col justify-between h-full flex-1"
                  >
                    {/* CSS Mockup visual representation */}
                    <div className="w-full h-[110px] rounded-lg border border-white/5 bg-[#050507] overflow-hidden relative mb-4">
                      
                      {academicIdx === 0 && (
                        /* Smart Attendance Records Mockup */
                        <div className="w-full h-full flex flex-col justify-between p-2 font-mono text-[5.5px] text-white/60">
                          <span className="text-[6px] text-white font-bold leading-none mb-1">Smart Attendance Log</span>
                          
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-white/10 text-white/30 text-[5px]">
                                <th>Student</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>John Doe</td>
                                <td className="text-emerald-500 font-bold">Present</td>
                                <td>May 12, 2026</td>
                                <td>09:15 AM</td>
                              </tr>
                              <tr>
                                <td>Jane Smith</td>
                                <td className="text-emerald-500 font-bold">Present</td>
                                <td>May 12, 2026</td>
                                <td>09:17 AM</td>
                              </tr>
                              <tr>
                                <td>Alex Johnson</td>
                                <td className="text-rose-500 font-bold">Absent</td>
                                <td>May 12, 2026</td>
                                <td>09:18 AM</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      {academicIdx === 1 && (
                        /* Accident Detection Camera Feeds Grid Mockup */
                        <div className="w-full h-full grid grid-cols-2 gap-1 p-1 bg-black/80 font-mono text-[4.5px] text-white/40">
                          <div className="border border-white/5 rounded relative flex items-center justify-center bg-black/40">
                            <span className="absolute top-1 left-1 font-bold text-white/70">FEED_01</span>
                            <div className="border border-emerald-500/20 text-emerald-400 p-[1px] text-[4px] scale-90">CAR (94%)</div>
                          </div>
                          <div className="border border-white/5 rounded relative flex items-center justify-center bg-black/40">
                            <span className="absolute top-1 left-1 font-bold text-white/70">FEED_02</span>
                            <span className="text-white/20 text-[4px]">No Events</span>
                          </div>
                          <div className="border border-white/5 rounded relative flex items-center justify-center bg-black/40">
                            <span className="absolute top-1 left-1 font-bold text-white/70">FEED_03</span>
                            <div className="border border-rose-500/30 text-rose-400 p-[1px] text-[3.5px] scale-90 animate-pulse">COLLISION</div>
                          </div>
                          <div className="border border-white/5 rounded relative flex items-center justify-center bg-black/40">
                            <span className="absolute top-1 left-1 font-bold text-white/70">FEED_04</span>
                            <span className="text-white/20 text-[4px]">No Events</span>
                          </div>
                        </div>
                      )}

                      {academicIdx === 2 && (
                        /* Library DBMS Portal Mockup */
                        <div className="w-full h-full flex flex-col justify-between p-2 font-mono text-[5.5px] text-white/60">
                          <div className="flex justify-between items-center mb-1 text-[6.5px] font-bold text-white">
                            <span>Library Database Portal</span>
                            <span className="border border-white/10 rounded px-1 text-[4.5px] text-white/45">Admin</span>
                          </div>

                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-white/10 text-white/30 text-[5px]">
                                <th>Book ID</th>
                                <th>Title</th>
                                <th>Borrower</th>
                                <th>Due Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>#B942</td>
                                <td>Algorithms 4th Ed</td>
                                <td>Sarah Jenkins</td>
                                <td className="text-amber-500">In 3 Days</td>
                              </tr>
                              <tr>
                                <td>#B102</td>
                                <td>Intro to Database</td>
                                <td>David Lee</td>
                                <td className="text-emerald-500">Returned</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      {academicIdx === 3 && (
                        /* Network Packet Sniffer Console logs Mockup */
                        <div className="w-full h-full flex flex-col justify-start p-2 bg-[#020203] font-mono text-[5px] text-white/40 leading-normal">
                          <span className="text-emerald-400 font-bold border-b border-white/10 pb-0.5 mb-1 text-[5.5px]">sniff_log // tcpdump</span>
                          <div className="flex gap-1.5"><span className="text-[#38bdf8]">[TCP]</span><span>192.168.1.15:53218 {"->"} 10.0.0.12:443 [LEN: 1024]</span></div>
                          <div className="flex gap-1.5"><span className="text-[#38bdf8]">[TCP]</span><span>10.0.0.12:443 {"->"} 192.168.1.15:53218 [ACK // SYN]</span></div>
                          <div className="flex gap-1.5"><span className="text-amber-500">[UDP]</span><span>192.168.1.1:53 {"->"} 192.168.1.15:59322 [DNS RES]</span></div>
                        </div>
                      )}

                    </div>

                    {/* Meta information */}
                    <div>
                      <h4 className="text-base font-bold text-white mb-2 leading-none">
                        {ACADEMIC_PROJECTS[academicIdx].title}
                      </h4>
                      <p className="text-white/45 text-xs font-mono mb-4 leading-relaxed min-h-[36px]">
                        {ACADEMIC_PROJECTS[academicIdx].description}
                      </p>
                    </div>

                    {/* Tech list & links row */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
                      <div className="flex gap-1.5">
                        {ACADEMIC_PROJECTS[academicIdx].tech.map((t) => (
                          <div key={t.name} className="px-2 py-0.5 border border-white/5 bg-white/[0.02] rounded text-[8px] font-mono text-white/60">
                            {t.name}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <a href={ACADEMIC_PROJECTS[academicIdx].liveUrl} className="p-1.5 border border-accent/20 text-accent hover:bg-accent/5 rounded-lg transition-colors cursor-pointer" title="Live Demo">
                          <ExternalLinkIcon />
                        </a>
                        <a href={ACADEMIC_PROJECTS[academicIdx].codeUrl} className="p-1.5 border border-white/10 text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer" title="Source Code">
                          <GitHubIcon />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

              </div>
            </div>

            {/* Slider dots indicators */}
            <div className="flex justify-center gap-1.5 mt-5">
              {ACADEMIC_PROJECTS.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setAcademicIdx(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    academicIdx === idx ? 'bg-accent w-3.5' : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

          </motion.div>

        </div>

      </div>
    </div>
  )
}
