import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { useCollectionData } from '../lib/content'
import FirebaseLogo from '../assets/tech/firebase.svg'

// Define Project interfaces
interface ProjectData {
  title: string
  subtitle?: string
  description: string
  bullets?: string[]
  tech: { name: string; color?: string; icon?: string }[]
  liveUrl: string
  codeUrl: string
  type?: string // 'featured' | 'personal' | 'academic'
  types?: string[] | string
  category?: string
  status?: string
  published?: boolean
  draft?: boolean
  image?: string
  imageUrl?: string
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

const ExternalLinkIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
  </svg>
)

const GitHubIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
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

type ProjectImageProps = {
  src?: string
  alt: string
  compact?: boolean
  overlay?: React.ReactNode
  onClick?: () => void
}



const ProjectImage = ({ src, alt, compact, overlay, onClick }: ProjectImageProps) => (
  <div
    className={`group/image relative w-full ${compact ? 'aspect-video' : 'aspect-video'} rounded-[5px] border border-white/10 bg-black shadow-none p-2 overflow-hidden hover:border-accent/20 transition-all duration-500`}
    onClick={onClick}
  >
    {src ? (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-contain rounded-[4px] transition-all duration-700 filter grayscale brightness-110 contrast-110 group-hover/image:filter-none"
      />
    ) : (
      <div
        className="w-full h-full rounded-[4px] border border-white/5 bg-[#050507]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(120deg, rgba(255,255,255,0.03), transparent 40%, rgba(255,75,31,0.06))',
          backgroundSize: '10px 10px, 100% 100%'
        }}
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-br from-black/35 via-transparent to-accent/15 opacity-80 group-hover/image:opacity-0 transition-opacity duration-700" />
    {overlay && (
      <div className="absolute inset-x-0 bottom-0 z-10 p-1.5 sm:p-3 bg-black/75 backdrop-blur-[2px] border-t border-white/10 opacity-100 transition-none pointer-events-none">
        {overlay}
      </div>
    )}
  </div>
)

// Tech Micro Icons Map helper
const getTechIcon = (name: string) => {
  const normalized = name.trim().toLowerCase()

  switch (normalized) {
    case 'react':
    case 'react.js':
    case 'reactjs':
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
    case 'typescript':
    case 'type script':
    case 'ts':
      return (
        <div className="w-3.5 h-3.5 bg-[#3178c6] text-white font-mono font-bold text-[8px] flex items-center justify-center rounded-[2px] leading-none select-none">TS</div>
      )
    case 'javascript':
    case 'java script':
    case 'js':
      return (
        <div className="w-3.5 h-3.5 bg-[#f7df1e] text-black font-mono font-bold text-[8px] flex items-center justify-center rounded-[2px] leading-none select-none">JS</div>
      )
    case 'tailwind css':
    case 'tailwind':
    case 'tailwindcss':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" className="text-[#38bdf8] fill-current">
          <path d="M12 6.5c-2.4 0-3.6 1.2-3.6 3.6 0 2.4 1.2 3.6 3.6 3.6 2.4 0 3.6-1.2 3.6-3.6 0-2.4-1.2-3.6-3.6-3.6zm-6 6c-2.4 0-3.6 1.2-3.6 3.6 0 2.4 1.2 3.6 3.6 3.6 2.4 0 3.6-1.2 3.6-3.6 0-2.4-1.2-3.6-3.6-3.6z" />
        </svg>
      )
    case 'node.js':
    case 'node':
    case 'nodejs':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" className="text-[#339933] fill-current">
          <path d="M12 2L2.5 7.5v11L12 24l9.5-5.5v-11L12 2zm0 2.5l7.5 4.3v8.4L12 21.5l-7.5-4.3v-8.4L12 4.5z" />
        </svg>
      )
    case 'express':
    case 'express.js':
    case 'expressjs':
      return (
        <div className="w-3.5 h-3.5 border border-white/25 text-white font-mono font-bold text-[7px] flex items-center justify-center rounded-[2px] leading-none select-none">EX</div>
      )
    case 'mongodb':
    case 'mongo db':
    case 'mongo':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" className="text-[#47A248] fill-current">
          <path d="M12 0C7.5 0 6 3 6 6c0 5 6 12 6 18 0-6 6-13 6-18 0-3-1.5-6-6-6zm0 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
        </svg>
      )
    case 'python':
    case 'py':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" className="fill-current text-[#3776AB]">
          <path d="M12 2c-3.3 0-6 2.7-6 6v3h6v2H6v3c0 3.3 2.7 6 6 6s6-2.7 6-6v-3h-6v-2h6V8c0-3.3-2.7-6-6-6z" />
        </svg>
      )
    case 'opencv':
    case 'open cv':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" className="fill-current text-[#5C3EE8]">
          <circle cx="12" cy="6" r="4" />
          <circle cx="6" cy="16" r="4" />
          <circle cx="18" cy="16" r="4" />
        </svg>
      )
    case 'next.js':
    case 'next':
    case 'nextjs':
      return (
        <div className="w-3.5 h-3.5 bg-white text-black font-mono font-bold text-[8.5px] flex items-center justify-center rounded-[2px] leading-none select-none">N</div>
      )
    case 'firebase':
      return (
        <img src={FirebaseLogo} alt="" aria-hidden="true" className="w-3.5 h-3.5" />
      )
    default:
      return null
  }
}

const TechPill = ({ name, compact = false }: { name: string; compact?: boolean }) => {
  const icon = getTechIcon(name)

  return (
    <div
      title={name}
      className={`border border-white/5 bg-white/[0.02] rounded font-mono text-white/60 flex items-center justify-center transition-all duration-300 ${
        compact
          ? 'px-1.5 py-1 gap-1.5 text-[8.5px] sm:px-2 sm:py-0.5 sm:text-[8px] sm:justify-start'
          : 'px-3 py-1.5 gap-2 text-[11px] hover:border-accent/40 hover:bg-accent/5 hover:text-white'
      }`}
    >
      {icon && (
        <span className={`flex shrink-0 items-center justify-center ${compact ? 'scale-90 sm:scale-75' : ''}`}>
          {icon}
        </span>
      )}
      <span>{name}</span>
    </div>
  )
}

const getOriginalIdx = (domIdx: number, length: number) => {
  const adjusted = domIdx - 1
  return (adjusted % length + length) % length
}

const toText = (value: unknown, fallback = '') => (
  typeof value === 'string' ? value : fallback
)

const normalizeTypeValue = (value: unknown) => toText(value).trim().toLowerCase()

const normalizeTypeList = (types?: ProjectData['types']) => {
  if (Array.isArray(types)) return types.map(normalizeTypeValue).filter(Boolean)
  if (typeof types === 'string') {
    return types
      .split(',')
      .map(normalizeTypeValue)
      .filter(Boolean)
  }
  return []
}

const projectHasType = (project: ProjectData, type: string) => {
  const projectTypes = [
    ...normalizeTypeList(project.types),
    normalizeTypeValue(project.type),
    normalizeTypeValue(project.category)
  ].filter(Boolean)

  return projectTypes.length ? projectTypes.includes(type) : type === 'featured'
}

const isPublishableProject = (project: ProjectData) => {
  const title = toText(project.title).trim()
  const description = toText(project.description).trim()
  const status = normalizeTypeValue(project.status)

  return (
    Boolean(title) &&
    title !== 'New Project' &&
    description !== 'Describe the project...' &&
    status !== 'draft' &&
    project.draft !== true &&
    project.published !== false
  )
}

const normalizeTech = (tech: unknown) => (
  Array.isArray(tech)
    ? tech
      .map((item) => typeof item === 'string' ? { name: item } : item)
      .filter((item): item is { name: string; color?: string; icon?: string } => (
        Boolean(item) &&
        typeof item === 'object' &&
        'name' in item &&
        typeof item.name === 'string' &&
        Boolean(item.name.trim())
      ))
    : []
)

const normalizeProject = (project: ProjectData): ProjectData => ({
  ...project,
  title: toText(project.title, 'Untitled Project'),
  description: toText(project.description),
  bullets: Array.isArray(project.bullets) ? project.bullets : [],
  codeUrl: toText(project.codeUrl, '#') || '#',
  image: toText(project.image) || toText(project.imageUrl),
  liveUrl: toText(project.liveUrl, '#') || '#',
  status: normalizeTypeValue(project.status),
  tech: normalizeTech(project.tech)
})

const makeSlides = (projects: ProjectData[]) => (
  projects.length ? [projects[projects.length - 1], ...projects, projects[0]] : []
)

const getProjectUrl = (url: string) => url === '#' ? 'https://github.com' : url

const openExternalUrl = (url: string) => {
  window.open(getProjectUrl(url), '_blank', 'noopener,noreferrer')
}

const EmptyProjectState = ({ label }: { label: string }) => (
  <div className="relative z-10 flex min-h-[260px] w-full flex-col items-center justify-center rounded-xl border border-white/5 bg-[#08080a]/50 px-6 text-center">
    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent/80">
      No {label} projects
    </div>
    <p className="mt-3 max-w-sm text-[12px] leading-relaxed text-white/40 font-mono">
      Add projects in Firebase from the admin panel and set their type to {label}.
    </p>
  </div>
)

export default function Projects() {
  const projectRecords = useCollectionData<ProjectData>(
    'projects',
    []
  )
  const normalizedProjects = useMemo(
    () => projectRecords.map(normalizeProject).filter(isPublishableProject),
    [projectRecords]
  )
  const featuredProjects = useMemo(
    () => normalizedProjects.filter((project) => projectHasType(project, 'featured')),
    [normalizedProjects]
  )
  const personalProjects = useMemo(
    () => normalizedProjects.filter((project) => projectHasType(project, 'personal')),
    [normalizedProjects]
  )
  const academicProjects = useMemo(
    () => normalizedProjects.filter((project) => projectHasType(project, 'academic')),
    [normalizedProjects]
  )
  const featuredSlides = useMemo(() => makeSlides(featuredProjects), [featuredProjects])
  const personalSlides = useMemo(() => makeSlides(personalProjects), [personalProjects])
  const academicSlides = useMemo(() => makeSlides(academicProjects), [academicProjects])

  const [featuredIdx, setFeaturedIdx] = useState(0)
  const [personalIdx, setPersonalIdx] = useState(0)
  const [academicIdx, setAcademicIdx] = useState(0)
  const [expandedCompactProjectKey, ] = useState<string | null>(null)
  const [compactCarouselPaused, setCompactCarouselPaused] = useState(false)

  const featuredScrollRef = useRef<HTMLDivElement>(null)
  const personalScrollRef = useRef<HTMLDivElement>(null)
  const academicScrollRef = useRef<HTMLDivElement>(null)

  const featuredSettleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const personalSettleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const academicSettleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  // Initial scroll positions to first real slide (DOM index 1)
  useEffect(() => {
    const initScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (ref.current) {
        ref.current.scrollLeft = ref.current.clientWidth
      }
    }
    const timer = setTimeout(() => {
      initScroll(featuredScrollRef)
      initScroll(personalScrollRef)
      initScroll(academicScrollRef)
    }, 150)
    return () => clearTimeout(timer)
  }, [])

  // Window resize handler to realign scroll position based on current active indexes
  useEffect(() => {
    const handleResize = () => {
      if (featuredScrollRef.current) {
        featuredScrollRef.current.scrollLeft = (featuredIdx + 1) * featuredScrollRef.current.clientWidth
      }
      if (personalScrollRef.current) {
        personalScrollRef.current.scrollLeft = (personalIdx + 1) * personalScrollRef.current.clientWidth
      }
      if (academicScrollRef.current) {
        academicScrollRef.current.scrollLeft = (academicIdx + 1) * academicScrollRef.current.clientWidth
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (featuredSettleTimer.current) clearTimeout(featuredSettleTimer.current)
      if (personalSettleTimer.current) clearTimeout(personalSettleTimer.current)
      if (academicSettleTimer.current) clearTimeout(academicSettleTimer.current)
    }
  }, [featuredIdx, personalIdx, academicIdx])

  // Scroll sync handlers with debounced boundary resetting to prevent animation interruption
  const handleFeaturedScroll = () => {
    if (!featuredScrollRef.current) return
    const { scrollLeft, clientWidth } = featuredScrollRef.current
    if (clientWidth === 0) return
    
    const N = featuredProjects.length
    if (N === 0) return
    const domIdx = Math.round(scrollLeft / clientWidth)
    const originalIdx = getOriginalIdx(domIdx, N)
    if (originalIdx !== featuredIdx && originalIdx >= 0 && originalIdx < N) {
      setFeaturedIdx(originalIdx)
    }

    if (featuredSettleTimer.current) {
      clearTimeout(featuredSettleTimer.current)
    }

    featuredSettleTimer.current = setTimeout(() => {
      if (!featuredScrollRef.current) return
      const curScrollLeft = featuredScrollRef.current.scrollLeft
      
      if (curScrollLeft <= 15) {
        featuredScrollRef.current.scrollTo({ left: N * clientWidth, behavior: 'auto' })
        setFeaturedIdx(N - 1)
      } else if (curScrollLeft >= (N + 1) * clientWidth - 15) {
        featuredScrollRef.current.scrollTo({ left: clientWidth, behavior: 'auto' })
        setFeaturedIdx(0)
      }
    }, 150)
  }

  const handlePersonalScroll = () => {
    if (!personalScrollRef.current) return
    const { scrollLeft, clientWidth } = personalScrollRef.current
    if (clientWidth === 0) return
    
    const N = personalProjects.length
    if (N === 0) return
    const domIdx = Math.round(scrollLeft / clientWidth)
    const originalIdx = getOriginalIdx(domIdx, N)
    if (originalIdx !== personalIdx && originalIdx >= 0 && originalIdx < N) {
      setPersonalIdx(originalIdx)
    }

    if (personalSettleTimer.current) {
      clearTimeout(personalSettleTimer.current)
    }

    personalSettleTimer.current = setTimeout(() => {
      if (!personalScrollRef.current) return
      const curScrollLeft = personalScrollRef.current.scrollLeft
      
      if (curScrollLeft <= 15) {
        personalScrollRef.current.scrollTo({ left: N * clientWidth, behavior: 'auto' })
        setPersonalIdx(N - 1)
      } else if (curScrollLeft >= (N + 1) * clientWidth - 15) {
        personalScrollRef.current.scrollTo({ left: clientWidth, behavior: 'auto' })
        setPersonalIdx(0)
      }
    }, 150)
  }

  const handleAcademicScroll = () => {
    if (!academicScrollRef.current) return
    const { scrollLeft, clientWidth } = academicScrollRef.current
    if (clientWidth === 0) return
    
    const N = academicProjects.length
    if (N === 0) return
    const domIdx = Math.round(scrollLeft / clientWidth)
    const originalIdx = getOriginalIdx(domIdx, N)
    if (originalIdx !== academicIdx && originalIdx >= 0 && originalIdx < N) {
      setAcademicIdx(originalIdx)
    }

    if (academicSettleTimer.current) {
      clearTimeout(academicSettleTimer.current)
    }

    academicSettleTimer.current = setTimeout(() => {
      if (!academicScrollRef.current) return
      const curScrollLeft = academicScrollRef.current.scrollLeft
      
      if (curScrollLeft <= 15) {
        academicScrollRef.current.scrollTo({ left: N * clientWidth, behavior: 'auto' })
        setAcademicIdx(N - 1)
      } else if (curScrollLeft >= (N + 1) * clientWidth - 15) {
        academicScrollRef.current.scrollTo({ left: clientWidth, behavior: 'auto' })
        setAcademicIdx(0)
      }
    }, 150)
  }

  // Smooth scroll helper functions
  const scrollFeaturedTo = (idx: number) => {
    if (!featuredScrollRef.current) return
    featuredScrollRef.current.scrollTo({
      left: (idx + 1) * featuredScrollRef.current.clientWidth,
      behavior: 'smooth'
    })
    setFeaturedIdx(idx)
  }

  const scrollPersonalTo = (idx: number) => {
    if (!personalScrollRef.current) return
    personalScrollRef.current.scrollTo({
      left: (idx + 1) * personalScrollRef.current.clientWidth,
      behavior: 'smooth'
    })
    setPersonalIdx(idx)
  }

  const scrollAcademicTo = (idx: number) => {
    if (!academicScrollRef.current) return
    academicScrollRef.current.scrollTo({
      left: (idx + 1) * academicScrollRef.current.clientWidth,
      behavior: 'smooth'
    })
    setAcademicIdx(idx)
  }

  const nextFeatured = () => {
    if (!featuredScrollRef.current) return
    const { clientWidth } = featuredScrollRef.current
    if (clientWidth === 0 || featuredProjects.length === 0) return
    featuredScrollRef.current.scrollTo({
      left: (featuredIdx + 2) * clientWidth,
      behavior: 'smooth'
    })
  }
  const prevFeatured = () => {
    if (!featuredScrollRef.current) return
    const { clientWidth } = featuredScrollRef.current
    if (clientWidth === 0 || featuredProjects.length === 0) return
    featuredScrollRef.current.scrollTo({
      left: featuredIdx * clientWidth,
      behavior: 'smooth'
    })
  }

  const nextPersonal = () => {
    if (!personalScrollRef.current) return
    const { clientWidth } = personalScrollRef.current
    if (clientWidth === 0 || personalProjects.length === 0) return
    personalScrollRef.current.scrollTo({
      left: (personalIdx + 2) * clientWidth,
      behavior: 'smooth'
    })
  }
  const prevPersonal = () => {
    if (!personalScrollRef.current) return
    const { clientWidth } = personalScrollRef.current
    if (clientWidth === 0 || personalProjects.length === 0) return
    personalScrollRef.current.scrollTo({
      left: personalIdx * clientWidth,
      behavior: 'smooth'
    })
  }

  const nextAcademic = () => {
    if (!academicScrollRef.current) return
    const { clientWidth } = academicScrollRef.current
    if (clientWidth === 0 || academicProjects.length === 0) return
    academicScrollRef.current.scrollTo({
      left: (academicIdx + 2) * clientWidth,
      behavior: 'smooth'
    })
  }
  const prevAcademic = () => {
    if (!academicScrollRef.current) return
    const { clientWidth } = academicScrollRef.current
    if (clientWidth === 0 || academicProjects.length === 0) return
    academicScrollRef.current.scrollTo({
      left: academicIdx * clientWidth,
      behavior: 'smooth'
    })
  }

  // Auto-play Featured Projects
  useEffect(() => {
    if (featuredProjects.length === 0) return

    const timer = setInterval(() => {
      if (featuredScrollRef.current) {
        const { clientWidth } = featuredScrollRef.current
        if (clientWidth > 0) {
          featuredScrollRef.current.scrollTo({
            left: (featuredIdx + 2) * clientWidth,
            behavior: 'smooth'
          })
        }
      }
    }, 3000)
    return () => clearInterval(timer)
  }, [featuredIdx, featuredProjects.length])

  // Auto-play Personal Projects
  useEffect(() => {
    if (expandedCompactProjectKey || compactCarouselPaused) return
    if (personalProjects.length === 0) return

    const timer = setInterval(() => {
      if (personalScrollRef.current) {
        const { clientWidth } = personalScrollRef.current
        if (clientWidth > 0) {
          personalScrollRef.current.scrollTo({
            left: (personalIdx + 2) * clientWidth,
            behavior: 'smooth'
          })
        }
      }
    }, 3000)
    return () => clearInterval(timer)
  }, [compactCarouselPaused, expandedCompactProjectKey, personalIdx, personalProjects.length])

  // Auto-play Academic Projects
  useEffect(() => {
    if (expandedCompactProjectKey || compactCarouselPaused) return
    if (academicProjects.length === 0) return

    const timer = setInterval(() => {
      if (academicScrollRef.current) {
        const { clientWidth } = academicScrollRef.current
        if (clientWidth > 0) {
          academicScrollRef.current.scrollTo({
            left: (academicIdx + 2) * clientWidth,
            behavior: 'smooth'
          })
        }
      }
    }, 3000)
    return () => clearInterval(timer)
  }, [academicIdx, academicProjects.length, compactCarouselPaused, expandedCompactProjectKey])


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
        <div className="relative z-20 max-w-6xl mx-auto mb-16 px-4 md:px-8">
          
          {/* Card Container */}
          <div 
            className="w-full bg-[#111113]/40 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-accent/15 transition-all duration-300 group min-h-[500px] md:min-h-[440px] relative flex flex-col justify-between overflow-hidden"
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
            
            <div 
              ref={featuredScrollRef}
              onScroll={handleFeaturedScroll}
              className="w-full overflow-x-auto flex snap-x snap-mandatory no-scrollbar relative z-10 flex-1"
            >
              {!featuredProjects.length && <EmptyProjectState label="featured" />}
              {featuredSlides.map((project, idx) => {
                const TitleHeader = (
                  <div>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-[10px] font-mono uppercase tracking-wider mb-3 lg:mb-4">
                      <StarIcon />
                      <span>Featured Project</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 lg:mb-3 group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>
                  </div>
                );

                const DescriptionBlock = (
                  <div>
                    <p className="text-white/50 text-sm md:text-base font-mono mb-3 lg:mb-5 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Bullet list */}
                    {project.bullets && (
                      <ul className="flex flex-col gap-1.5 lg:gap-2 mb-4 lg:mb-0">
                        {project.bullets?.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-white/70 font-mono">
                            <CheckIcon />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );

                const Buttons = (
                  <div className="flex gap-4 relative z-20">
                    <a
                      href={getProjectUrl(project.liveUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        openExternalUrl(project.liveUrl)
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-accent text-accent hover:bg-accent hover:text-white font-mono text-[11px] uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(224,90,43,0.05)] cursor-pointer"
                    >
                      <span>Live Demo</span>
                      <ExternalLinkIcon />
                    </a>
                    <a
                      href={getProjectUrl(project.codeUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        openExternalUrl(project.codeUrl)
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white/70 hover:text-white hover:border-white/30 font-mono text-[11px] uppercase tracking-wider transition-all duration-300 cursor-pointer"
                    >
                      <span>Source Code</span>
                      <GitHubIcon />
                    </a>
                  </div>
                );

                const TechStack = (
                  <div className="flex flex-wrap items-center justify-start gap-3">
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((lang) => (
                        <TechPill key={lang.name} name={lang.name} />
                      ))}
                    </div>
                  </div>
                );

                const Image = (
                  <ProjectImage
                    src={project.image}
                    alt={`${project.title} screenshot`}
                  />
                );

                return (
                  <div 
                    key={idx}
                    className="w-full shrink-0 snap-center relative z-10 h-full"
                  >
                    {/* MOBILE LAYOUT (Interleaved Sequence) */}
                    <div className="flex flex-col lg:hidden w-full h-full pb-2 gap-3">
                      {TitleHeader}
                      {Image}
                      {DescriptionBlock}
                      {TechStack}
                      <div className="mt-auto pt-2">
                        {Buttons}
                      </div>
                    </div>

                    {/* DESKTOP LAYOUT (2 Columns) */}
                    <div className="hidden lg:grid grid-cols-2 gap-8 items-center h-full">
                      {/* Left side details */}
                      <div className="flex flex-col h-full justify-between py-1">
                        <div>
                          {TitleHeader}
                          {DescriptionBlock}
                        </div>
                        {Buttons}
                      </div>

                      {/* Right side screenshot + stack */}
                      <div className="flex flex-col gap-3">
                        {Image}
                        {TechStack}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Carousel dots indicators */}
            <div className="flex justify-center gap-2 mt-6 relative z-30">
              {featuredProjects.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => scrollFeaturedTo(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    featuredIdx === idx ? 'bg-accent w-4' : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

          </div>

          {/* Arrow Left */}
          {featuredProjects.length > 0 && (
            <button
              onClick={prevFeatured}
              className="absolute left-[-12px] md:left-0 top-[50%] -translate-y-1/2 w-10 h-10 rounded-full border border-accent/20 bg-black/60 hover:bg-accent/15 hover:border-accent flex items-center justify-center transition-all duration-300 text-accent cursor-pointer z-30 group"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transform group-hover:-translate-x-0.5 transition-transform duration-300">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Arrow Right */}
          {featuredProjects.length > 0 && (
            <button
              onClick={nextFeatured}
              className="absolute right-[-12px] md:right-0 top-[50%] -translate-y-1/2 w-10 h-10 rounded-full border border-accent/20 bg-black/60 hover:bg-accent/15 hover:border-accent flex items-center justify-center transition-all duration-300 text-accent cursor-pointer z-30 group"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transform group-hover:translate-x-0.5 transition-transform duration-300">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

        </div>

        {/* 2-Column Grid: Personal Projects & Academic Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Left Column: Personal Projects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-20 bg-[#111113]/40 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-accent/15 transition-all duration-300 group overflow-hidden flex flex-col justify-between"
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
Projects that represent my passion for learning and building new things              </p>

              {/* Slider wrapper */}
              <div
                className="relative z-20 border border-white/5 bg-[#08080a]/60 rounded-xl p-4 overflow-hidden min-h-[310px] flex flex-col justify-between"
                onMouseEnter={() => setCompactCarouselPaused(true)}
                onMouseLeave={() => setCompactCarouselPaused(false)}
                onFocus={() => setCompactCarouselPaused(true)}
                onBlur={() => setCompactCarouselPaused(false)}
              >
                
                <div 
                  ref={personalScrollRef}
                  onScroll={handlePersonalScroll}
                  className="w-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar relative z-10 h-full flex-1"
                >
                  {!personalProjects.length && <EmptyProjectState label="personal" />}
                  {personalSlides.map((project, idx) => {
                    return (
                      <div
                        key={idx}
                        className="w-full shrink-0 snap-center relative z-10 flex flex-col justify-between h-full"
                      >
                        <ProjectImage
                          src={project.image}
                          alt={`${project.title} screenshot`}
                          compact
                          overlay={
                            <div className="flex gap-2 w-full">
                              <a 
                                href={getProjectUrl(project.liveUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onPointerDown={(event) => {
                                  event.stopPropagation()
                                  setCompactCarouselPaused(true)
                                }}
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  openExternalUrl(project.liveUrl)
                                }}
                                className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-3 bg-[#111113]/90 backdrop-blur-md border border-accent/40 text-accent hover:bg-accent hover:text-white rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(224,90,43,0.15)] pointer-events-auto"
                              >
                                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Demo</span>
                                <ExternalLinkIcon className="w-3.5 h-3.5" />
                              </a>
                              <a 
                                href={getProjectUrl(project.codeUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onPointerDown={(event) => {
                                  event.stopPropagation()
                                  setCompactCarouselPaused(true)
                                }}
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  openExternalUrl(project.codeUrl)
                                }}
                                className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-3 bg-[#111113]/90 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:border-white/40 rounded-xl transition-all cursor-pointer pointer-events-auto"
                              >
                                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Code</span>
                                <GitHubIcon className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          }
                        />

                        {/* Title & Description right below the image */}
                        <div className="flex flex-col gap-1.5 mt-4 mb-2">
                          <h4 className="text-sm font-bold text-white truncate">
                            {project.title}
                          </h4>
                          <p className="text-white/70 text-[11px] font-mono leading-relaxed line-clamp-3">
                            {project.description}
                          </p>
                        </div>

                        {/* Tech list row */}
                        <div className="pt-4 border-t border-white/5 mt-auto">
                          <div className="flex flex-wrap gap-1.5 min-w-0">
                            {project.tech.map((t) => (
                              <TechPill key={t.name} name={t.name} compact />
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Internal arrows */}
                <button 
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={prevPersonal}
                  className="absolute left-2 top-[35%] w-7 h-7 rounded-full border border-white/10 bg-black/80 hover:bg-accent/10 hover:border-accent/40 flex items-center justify-center transition-all duration-300 text-white/60 hover:text-accent cursor-pointer z-50"
                >
                  <span className="text-xs">←</span>
                </button>
                <button 
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={nextPersonal}
                  className="absolute right-2 top-[35%] w-7 h-7 rounded-full border border-white/10 bg-black/80 hover:bg-accent/10 hover:border-accent/40 flex items-center justify-center transition-all duration-300 text-white/60 hover:text-accent cursor-pointer z-50"
                >
                  <span className="text-xs">→</span>
                </button>

              </div>
            </div>

            {/* Slider dots indicators */}
            <div className="flex justify-center gap-1.5 mt-5">
              {personalProjects.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => scrollPersonalTo(idx)}
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
            className="relative z-20 bg-[#111113]/40 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-accent/15 transition-all duration-300 group overflow-hidden flex flex-col justify-between"
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
              <div
                className="relative z-20 border border-white/5 bg-[#08080a]/60 rounded-xl p-4 overflow-hidden min-h-[310px] flex flex-col justify-between"
                onMouseEnter={() => setCompactCarouselPaused(true)}
                onMouseLeave={() => setCompactCarouselPaused(false)}
                onFocus={() => setCompactCarouselPaused(true)}
                onBlur={() => setCompactCarouselPaused(false)}
              >
                
                <div 
                  ref={academicScrollRef}
                  onScroll={handleAcademicScroll}
                  className="w-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar relative z-10 h-full flex-1"
                >
                  {!academicProjects.length && <EmptyProjectState label="academic" />}
                  {academicSlides.map((project, idx) => {
                    return (
                      <div
                        key={idx}
                        className="w-full shrink-0 snap-center relative z-10 flex flex-col justify-between h-full"
                      >
                        <ProjectImage
                          src={project.image}
                          alt={`${project.title} screenshot`}
                          compact
                          overlay={
                            <div className="flex gap-2 w-full">
                              <a 
                                href={getProjectUrl(project.liveUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onPointerDown={(event) => {
                                  event.stopPropagation()
                                  setCompactCarouselPaused(true)
                                }}
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  openExternalUrl(project.liveUrl)
                                }}
                                className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-3 bg-[#111113]/90 backdrop-blur-md border border-accent/40 text-accent hover:bg-accent hover:text-white rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(224,90,43,0.15)] pointer-events-auto"
                              >
                                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Demo</span>
                                <ExternalLinkIcon className="w-3.5 h-3.5" />
                              </a>
                              <a 
                                href={getProjectUrl(project.codeUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onPointerDown={(event) => {
                                  event.stopPropagation()
                                  setCompactCarouselPaused(true)
                                }}
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  openExternalUrl(project.codeUrl)
                                }}
                                className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-3 bg-[#111113]/90 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:border-white/40 rounded-xl transition-all cursor-pointer pointer-events-auto"
                              >
                                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Code</span>
                                <GitHubIcon className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          }
                        />

                        {/* Title & Description right below the image */}
                        <div className="flex flex-col gap-1.5 mt-4 mb-2">
                          <h4 className="text-sm font-bold text-white truncate">
                            {project.title}
                          </h4>
                          <p className="text-white/70 text-[11px] font-mono leading-relaxed line-clamp-3">
                            {project.description}
                          </p>
                        </div>

                        {/* Tech list row */}
                        <div className="pt-4 border-t border-white/5 mt-auto">
                          <div className="flex flex-wrap gap-1.5 min-w-0">
                            {project.tech.map((t) => (
                              <TechPill key={t.name} name={t.name} compact />
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Internal arrows */}
                <button 
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={prevAcademic}
                  className="absolute left-2 top-[35%] w-7 h-7 rounded-full border border-white/10 bg-black/80 hover:bg-accent/10 hover:border-accent/40 flex items-center justify-center transition-all duration-300 text-white/60 hover:text-accent cursor-pointer z-50"
                >
                  <span className="text-xs">←</span>
                </button>
                <button 
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={nextAcademic}
                  className="absolute right-2 top-[35%] w-7 h-7 rounded-full border border-white/10 bg-black/80 hover:bg-accent/10 hover:border-accent/40 flex items-center justify-center transition-all duration-300 text-white/60 hover:text-accent cursor-pointer z-50"
                >
                  <span className="text-xs">→</span>
                </button>

              </div>
            </div>

            {/* Slider dots indicators */}
            <div className="flex justify-center gap-1.5 mt-5">
              {academicProjects.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => scrollAcademicTo(idx)}
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
