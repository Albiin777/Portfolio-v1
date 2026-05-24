import React from 'react'
import { motion } from 'framer-motion'
import PythonLogo from '../assets/tech/python.svg'
import Html5Logo from '../assets/tech/html5.svg'
import Css3Logo from '../assets/tech/css3.svg'
import TailwindLogo from '../assets/tech/tailwindcss.svg'
import ExpressLogo from '../assets/tech/express.svg'
import VSCodeLogo from '../assets/tech/vscode.svg'
import CLogo from '../assets/tech/c.svg'
import FirebaseLogo from '../assets/tech/firebase.svg'
import AntigravityLogo from '../assets/tech/antigravity.svg'
import { useCollectionData } from '../lib/content'

// Category type definition
interface Category {
  title: string
  description: string
  icon: React.ReactNode
  skills: { name: string; icon: React.ReactNode }[]
}

interface SkillDoc {
  __id?: string
  title: string
  description: string
  skills: { name: string }[]
  order?: number
}

// Category Icons (Sleek Orange SVGs)
const FrontendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)

const BackendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
)

const ToolsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

// Technology Micro Icons
const ReactIcon = () => (
  <svg width="12" height="12" viewBox="-11.5 -10.23174 23 20.46348" className="text-[#61dafb] fill-none stroke-current" strokeWidth="1.2">
    <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
    <g stroke="currentColor">
      <ellipse rx="11" ry="4.2"/>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
    </g>
  </svg>
)

const TSIcon = () => (
  <div className="w-3.5 h-3.5 bg-[#3178c6] text-white font-mono font-bold text-[8.5px] flex items-center justify-center rounded-[2px] leading-none select-none">TS</div>
)

const JSIcon = () => (
  <div className="w-3.5 h-3.5 bg-[#f7df1e] text-black font-mono font-bold text-[8.5px] flex items-center justify-center rounded-[2px] leading-none select-none">JS</div>
)

const HTMLIcon = () => (
  <img src={Html5Logo} alt="" aria-hidden="true" className="w-3.5 h-3.5" />
)

const CSSIcon = () => (
  <img src={Css3Logo} alt="" aria-hidden="true" className="w-3.5 h-3.5" />
)

const TailwindIcon = () => (
  <img src={TailwindLogo} alt="" aria-hidden="true" className="w-3.5 h-3.5" />
)

const ViteIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#ffdf00]">
    <path d="M24 4.5L12 22L0 4.5h24z" fill="#bd34fe" />
    <path d="M15 2L8 12h5l-3 8 9-11h-6l5-7z" fill="#ffdf00" />
  </svg>
)

const NodeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" className="text-[#339933] fill-current">
    <path d="M12 2L2.5 7.5v11L12 24l9.5-5.5v-11L12 2zm0 2.5l7.5 4.3v8.4L12 21.5l-7.5-4.3v-8.4L12 4.5z" />
  </svg>
)

const ExpressIcon = () => (
  <img src={ExpressLogo} alt="" aria-hidden="true" className="w-3.5 h-3.5" />
)

const JavaIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ea2d2e]">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
)

const PythonIcon = () => (
  <img src={PythonLogo} alt="" aria-hidden="true" className="w-3.5 h-3.5" />
)

const CIcon = () => (
  <img src={CLogo} alt="" aria-hidden="true" className="w-3.5 h-3.5" />
)

const FirebaseIcon = () => (
  <img src={FirebaseLogo} alt="" aria-hidden="true" className="w-3.5 h-3.5" />
)

const MySQLIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00758f]">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
)

const GitIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" className="text-[#F05032] fill-none stroke-current" strokeWidth="2">
    <circle cx="12" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="6" r="3" />
    <path d="M6 9v3c0 2 6 2 6 4M18 9v3c0 2-6 2-6 4v-4" />
  </svg>
)

const GitHubIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" className="text-white fill-current">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const VSCodeIcon = () => (
  <img src={VSCodeLogo} alt="" aria-hidden="true" className="w-3.5 h-3.5" />
)

const AntigravityIcon = () => (
  <img src={AntigravityLogo} alt="" aria-hidden="true" className="w-3.5 h-3.5" />
)

const CATEGORIES: Category[] = [
  {
    title: 'Frontend',
    description: 'Building responsive and interactive user experiences with modern web technologies.',
    icon: <FrontendIcon />,
    skills: [
      { name: 'React.js', icon: <ReactIcon /> },
      { name: 'JavaScript', icon: <JSIcon /> },
      { name: 'TypeScript', icon: <TSIcon /> },
      { name: 'HTML', icon: <HTMLIcon /> },
      { name: 'CSS', icon: <CSSIcon /> },
      { name: 'Tailwind CSS', icon: <TailwindIcon /> },
      { name: 'Vite', icon: <ViteIcon /> }
    ]
  },
  {
    title: 'Backend',
    description: 'Developing scalable backend systems and APIs for modern applications.',
    icon: <BackendIcon />,
    skills: [
      { name: 'Node.js', icon: <NodeIcon /> },
      { name: 'Express.js', icon: <ExpressIcon /> },
      { name: 'Java', icon: <JavaIcon /> },
      { name: 'Python', icon: <PythonIcon /> },
      { name: 'C', icon: <CIcon /> },
      { name: 'Firebase', icon: <FirebaseIcon /> },
      { name: 'MySQL', icon: <MySQLIcon /> }
    ]
  },
  {
    title: 'Tools / Platforms',
    description: 'Tools and platforms I use to streamline development and productivity.',
    icon: <ToolsIcon />,
    skills: [
      { name: 'VS Code', icon: <VSCodeIcon /> },
      { name: 'Git', icon: <GitIcon /> },
      { name: 'GitHub', icon: <GitHubIcon /> },
      { name: 'Antigravity', icon: <AntigravityIcon /> }
    ]
  }
]

const FALLBACK_SKILL_DOCS: SkillDoc[] = CATEGORIES.map((category, index) => ({
  title: category.title,
  description: category.description,
  skills: category.skills.map((skill) => ({ name: skill.name })),
  order: index
}))

const getCategoryIcon = (title: string) => {
  const normalized = title.toLowerCase()
  if (normalized.includes('backend')) return <BackendIcon />
  if (normalized.includes('tool')) return <ToolsIcon />
  return <FrontendIcon />
}

const toText = (value: unknown, fallback = '') => (
  typeof value === 'string' && value.trim() ? value : fallback
)

const normalizeSkillList = (
  skills: unknown,
  fallbackSkills: Category['skills']
): Category['skills'] => {
  if (!Array.isArray(skills)) return fallbackSkills

  const normalized: Category['skills'] = skills.flatMap((skill) => {
      const name = typeof skill === 'string'
        ? skill
        : skill && typeof skill === 'object' && 'name' in skill
          ? toText(skill.name)
          : ''

      return name ? [{ name, icon: getSkillIcon(name) }] : []
    })

  return normalized.length ? normalized : fallbackSkills
}

const getSkillIcon = (name: string) => {
  switch (name) {
    case 'React':
    case 'React.js':
      return <ReactIcon />
    case 'TypeScript':
      return <TSIcon />
    case 'JavaScript':
      return <JSIcon />
    case 'HTML':
      return <HTMLIcon />
    case 'CSS':
      return <CSSIcon />
    case 'Tailwind CSS':
      return <TailwindIcon />
    case 'Vite':
      return <ViteIcon />
    case 'Node.js':
      return <NodeIcon />
    case 'Express':
    case 'Express.js':
      return <ExpressIcon />
    case 'Java':
      return <JavaIcon />
    case 'Python':
      return <PythonIcon />
    case 'C':
      return <CIcon />
    case 'Firebase':
      return <FirebaseIcon />
    case 'MySQL':
      return <MySQLIcon />
    case 'VS Code':
      return <VSCodeIcon />
    case 'Git':
      return <GitIcon />
    case 'GitHub':
      return <GitHubIcon />
    case 'Antigravity':
      return <AntigravityIcon />
    default:
      return null
  }
}

export default function Skills() {
  const skillDocs = useCollectionData<SkillDoc>('skills', [])
  const categories: Category[] = FALLBACK_SKILL_DOCS.map((fallbackCategory, index) => {
    const categoryId = index === 0 ? 'frontend' : index === 1 ? 'backend' : 'tools'
    const override = skillDocs.find((skillDoc) => skillDoc.__id === categoryId)
    const category = override || fallbackCategory

    const title = toText(category.title, fallbackCategory.title)
    const description = toText(category.description, fallbackCategory.description)
    const fallbackSkills = fallbackCategory.skills.map((skill) => ({
      name: skill.name,
      icon: getSkillIcon(skill.name)
    }))

    return {
      title,
      description,
      icon: getCategoryIcon(title),
      skills: normalizeSkillList(category.skills, fallbackSkills)
    }
  })

  return (
    <div className="relative w-full py-16 md:py-20 bg-bg-dark text-white font-sans overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute left-[-10%] top-[20%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute right-[-10%] bottom-[10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Main Grid Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-14 text-left max-w-3xl">
          <div className="font-mono text-white/40 text-xs mb-4 tracking-[0.2em] uppercase">
            03
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-white">Tech </span>
            <span className="text-accent">Stack</span>
          </h2>
          <p className="text-white/40 text-sm md:text-base font-mono leading-relaxed">
            Tools and technologies I use to bring ideas to life.
          </p>
        </div>

        {/* Grid Layout of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto gap-6 mb-16">
          {categories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="relative bg-[#111111]/40 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-accent/20 transition-all duration-300 group overflow-hidden"
            >
              {/* Subtle inner hover glow card accent */}
              <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Header inside Card */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full border border-accent/20 bg-accent/5 flex items-center justify-center shadow-[0_0_15px_rgba(255, 176, 0,0.1)] group-hover:shadow-[0_0_20px_rgba(255, 176, 0,0.25)] group-hover:border-accent/40 transition-all duration-300">
                  {category.icon}
                </div>
                <h3 className="text-lg font-bold text-white/90 group-hover:text-white transition-colors duration-300">
                  {category.title}
                </h3>
              </div>

              {/* Description text */}
              <p className="text-white/50 text-[13px] leading-relaxed mb-6 font-mono min-h-[60px]">
                {category.description}
              </p>

              {/* Tech Pills */}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="border border-white/5 bg-white/[0.02] hover:border-accent/40 hover:bg-accent/5 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-[11px] font-mono text-white/80 hover:text-white transition-all duration-300"
                  >
                    {skill.icon && <span className="flex shrink-0 items-center justify-center">{skill.icon}</span>}
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Explore My Projects Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              const targetSection = document.getElementById('projects');
              if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative inline-flex items-center gap-3 px-8 py-[14px] bg-white/5 backdrop-blur-[10px] border border-accent/30 text-white font-mono text-[11px] tracking-[0.2em] uppercase cursor-pointer overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_20px_rgba(224,90,43,0.1)] hover:bg-accent/10 hover:border-accent hover:shadow-[0_0_25px_rgba(224,90,43,0.25)] hover:-translate-y-0.5 rounded-xl"
          >
            {/* Box Icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span>Explore My Projects</span>
            {/* Arrow Icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 ease-out group-hover:translate-x-1">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  )
}
