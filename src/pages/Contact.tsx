import { useState, useRef, useEffect } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useDocData } from '../lib/content'
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
import type { Variants } from 'framer-motion'

type ProfileData = {
  resumeUrl: string
}

const downloadResume = (resumeUrl: string) => {
  const link = document.createElement('a')
  link.href = resumeUrl
  link.download = 'Albin_Thomas-resume.pdf'
  link.rel = 'noopener noreferrer'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

// ─── Original Icons ──────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const EnvelopeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const DocumentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/25 shrink-0">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const PencilIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/25 shrink-0">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
)

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const GitHubSocialIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const LinkedInSocialIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
)

const TwitterSocialIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const InstagramSocialIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

// ─── Solar Nodes ──────────────────────────────────────────────────────────────
const EMBER_PARTICLES = Array.from({ length: 50 }, (_, i) => {
  const seed = (i + 1) * 12.9898
  const wave = Math.sin(seed) * 43758.5453
  const rand = (offset: number) => {
    const value = Math.sin(seed + offset) * wave
    return value - Math.floor(value)
  }

  return {
    left: `${rand(1) * 100}%`,
    top: `${rand(2) * 100}%`,
    size: `${rand(3) * 2 + 0.5}px`,
    opacity: rand(4) * 0.4 + 0.1,
    animationDelay: `${rand(5) * 5}s`,
    animationDuration: `${rand(6) * 3 + 2}s`
  }
})

const SolarNode = ({ icon, href, title, textAlignment, opacity, scale, textOpacity, ringOrientation = 'top' }: { icon: React.ReactNode, href: string, title: string, textAlignment: 'left' | 'right' | 'top' | 'bottom' | 'top-left', opacity: MotionValue<number>, scale: MotionValue<number>, textOpacity: MotionValue<number>, ringOrientation?: 'top' | 'bottom' }) => {
  const outerMaskClass = ringOrientation === 'top' ? '[mask-image:linear-gradient(to_bottom,black_10%,transparent_80%)]' : '[mask-image:linear-gradient(to_top,black_10%,transparent_80%)]';

  const getTextPositionClass = () => {
    switch (textAlignment) {
      case 'left': return 'top-1/2 -translate-y-1/2 right-[calc(100%+1.5rem)] text-right items-end';
      case 'right': return 'top-1/2 -translate-y-1/2 left-[calc(100%+1.5rem)] text-left items-start';
      case 'top': return 'bottom-[calc(100%+1.5rem)] left-1/2 -translate-x-1/2 text-center items-center pointer-events-none';
      case 'top-left': return 'top-1/2 -translate-y-1/2 right-[calc(100%+1.5rem)] text-right items-end pointer-events-none md:bottom-[calc(100%+0.5rem)] md:top-auto md:translate-y-0 md:left-auto md:right-[calc(50%+2rem)] md:text-right md:items-end';
      case 'bottom': return 'top-[calc(100%+1.5rem)] left-1/2 -translate-x-1/2 text-center items-center pointer-events-none';
      default: return 'top-1/2 -translate-y-1/2 right-[calc(100%+1.5rem)] text-right items-end';
    }
  };

  return (
    <motion.div style={{ opacity, scale, x: "-50%", y: "-50%" }} className="absolute flex items-center justify-center pointer-events-auto group z-30">
      
      <a href={href} target="_blank" rel="noreferrer" className="relative flex items-center justify-center pointer-events-auto w-14 h-14 md:w-16 md:h-16">
        
        {/* Outermost faint ring - fades away opposite to the center */}
        <div className={`absolute inset-0 rounded-full border-[0.5px] border-[#FFB000]/20 scale-[1.5] pointer-events-none ${outerMaskClass}`} />
        
        {/* Orbiting Tiny Glowing Dots on the tighter 1.25x ring - fades away in the middle */}
        <div className="absolute inset-0 scale-[1.25] rounded-full border-[0.5px] border-[#FFB000]/40 group-hover:rotate-180 transition-transform duration-[3000ms] ease-linear pointer-events-none [mask-image:linear-gradient(45deg,black_20%,transparent_50%,black_80%)]">
           {/* Top arc bright highlight */}
           <div className="absolute top-[-1px] left-1/2 -translate-x-1/2 w-[30%] h-[2px] bg-white rounded-full blur-[1px] shadow-[0_0_10px_3px_#FFB000]" />
           
           {/* 8 orbiting dots */}
           {[...Array(8)].map((_, i) => (
             <div key={i} className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_5px_2px_#FFB000]"
                  style={{
                    top: `${50 - Math.cos(i * Math.PI / 4) * 50}%`,
                    left: `${50 + Math.sin(i * Math.PI / 4) * 50}%`,
                    transform: 'translate(-50%, -50%)'
                  }} />
           ))}
        </div>

        {/* Connection Flare (Horizontal anamorphic) aggressively tapering and fading towards edges */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[2px] bg-white opacity-70 blur-[0.5px] rounded-[50%] pointer-events-none group-hover:opacity-100 transition-all duration-500 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[8px] bg-[#FFB000] opacity-80 blur-[3px] rounded-[50%] pointer-events-none group-hover:opacity-100 transition-all duration-500 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />

        {/* Background radial glow */}
        <div className="absolute inset-0 rounded-full bg-[#FFB000] blur-[20px] scale-[1.2] opacity-40 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none" />

        {/* Core - Solid Black with intense gradient border */}
        <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-b from-white via-[#FFB000] to-[#FFB000]/10 shadow-[0_0_15px_rgba(255,176,0,0.6)] z-10 group-hover:shadow-[0_0_25px_rgba(255,176,0,0.9)] transition-all duration-300">
           <div className="w-full h-full rounded-full bg-[#050505] shadow-[inset_0_0_15px_rgba(255,176,0,0.2)]" />
        </div>
        
        {/* Icon */}
        <div className="relative z-20 text-white scale-[0.95] group-hover:scale-[1.05] transition-transform drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]">
           {icon}
        </div>

        {/* Title */}
        <motion.div 
          style={{ opacity: textOpacity }} 
          className={`absolute hidden md:flex flex-col ${getTextPositionClass()}`}
        >
           <span className="text-white/60 font-mono text-[9px] md:text-[10px] tracking-[0.3em] font-medium uppercase whitespace-nowrap drop-shadow-[0_0_8px_rgba(255,176,0,0.4)] group-hover:text-[#FFB000] transition-colors">{title}</span>
        </motion.div>
      </a>
    </motion.div>
  )
}

const CenterSun = ({ onClick, opacity, scale }: { onClick: () => void, opacity: MotionValue<number>, scale: MotionValue<number> }) => (
  <motion.div style={{ opacity, scale, x: "-50%", y: "-50%" }} onClick={onClick} className="absolute left-[50%] top-[50%] flex flex-col items-center justify-center pointer-events-auto cursor-pointer group z-40">
    
    {/* Eruption / Sun Aura */}
    <div className="absolute inset-0 rounded-full bg-[#FFB000]/10 blur-[60px] scale-[3.5] group-hover:bg-[#FFB000]/20 transition-all duration-700 pointer-events-none" />
    <div className="absolute inset-0 rounded-full bg-[#FFB000]/20 blur-[30px] scale-[2.0] pointer-events-none" />
    
    {/* The Core Container */}
    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full p-[1px] bg-gradient-to-br from-[#FFB000]/80 via-[#FFB000]/40 to-[#FFB000]/10 shadow-[0_0_30px_rgba(255,176,0,0.4)] group-hover:shadow-[0_0_50px_rgba(255,176,0,0.6)] transition-all duration-500 z-10">
       
       <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center p-4 md:p-5 shadow-[inset_0_0_40px_rgba(255,176,0,0.3)] relative">
         {/* Sharp bright inner ring */}
         <div className="absolute inset-0 rounded-full border-[1.5px] border-[#FFB000] opacity-80 pointer-events-none" />
         
         <img src="/logo-new.png" alt="Logo" className="relative z-10 w-full h-full object-contain brightness-150 drop-shadow-[0_0_15px_rgba(255,176,0,0.8)] group-hover:drop-shadow-[0_0_25px_rgba(255,176,0,1)] transition-all duration-500" />
       </div>
    </div>

    {/* Linktree Label */}
    <div className="absolute -bottom-12 md:-bottom-14 left-1/2 -translate-x-1/2 text-white/60 font-mono text-[9px] md:text-[10px] tracking-[0.3em] font-medium uppercase whitespace-nowrap drop-shadow-[0_0_8px_rgba(255,176,0,0.4)] group-hover:text-[#FFB000] transition-colors pointer-events-none">
      LINKTREE
    </div>
  </motion.div>
)

// ─── Reusable card icon wrapper ───────────────────────────────────────────────
const CardIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-10 h-10 border border-accent/30 bg-accent/[0.06] flex items-center justify-center
                  shadow-[0_0_12px_rgba(255, 176, 0,0.07)] group-hover:shadow-[0_0_18px_rgba(255, 176, 0,0.22)]
                  group-hover:border-accent/55 group-hover:bg-accent/[0.12]
                  transition-all duration-300 shrink-0"
    style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}
  >
    {children}
  </div>
)

interface ContactCardProps {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  onClick?: () => void
}

const contactCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: 'blur(6px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.68,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}

const ContactCard = ({ icon, label, value, sub, onClick }: ContactCardProps) => (
  <motion.div
    variants={contactCardVariants}
    className={`group relative p-5 flex flex-col gap-3 transition-all duration-300 overflow-hidden ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
    onClick={onClick}
  >
    <CardIcon>{icon}</CardIcon>
    <div className="flex flex-col gap-0.5">
      <span className="text-[9.5px] text-white/40 font-mono uppercase tracking-[0.22em]">{label}</span>
      <span className="text-[12.5px] font-semibold text-white font-montserrat group-hover:text-accent transition-colors duration-300 leading-snug">
        {value}
      </span>
      {sub && <span className="text-[10px] text-white/30 font-mono mt-0.5 leading-snug">{sub}</span>}
    </div>
  </motion.div>
)

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const profile = useDocData<ProfileData>('profile', 'main', { resumeUrl: '/Albin_Thomas-resume.pdf' })
  const resumeUrl = profile.resumeUrl || '/Albin_Thomas-resume.pdf'

  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setStatus('sending')
    try {
      if (!db) {
        throw new Error('Firebase is not configured.')
      }

      await addDoc(collection(db, 'messages'), {
        type: 'direct',
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        createdAt: serverTimestamp()
      })
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch (error) {
      console.error('Failed to send message:', error)
      setStatus('error')
    }
  }

  // Animation scroll transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'] // Track full container height
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20, restDelta: 0.001 })

  // 1. Outer nodes fade in (0 to 0.15)
  const nodesOpacity = useTransform(smoothProgress, [0, 0.15], [0, 1])
  const nodesScale = useTransform(smoothProgress, [0, 0.15], [0.5, 1])
  
  // 2. SVG Fire Roots draw inward to the center (0.15 to 0.45)
  const lineProgress = useTransform(smoothProgress, [0.15, 0.45], [0, 1])
  
  // 3. Center Sun Erupts (0.45 to 0.65)
  const sunOpacity = useTransform(smoothProgress, [0.45, 0.65], [0, 1])
  const sunScale = useTransform(smoothProgress, [0.45, 0.65], [0.1, 1])
  
  // 4. Node text descriptions fade in (0.65 to 0.85)
  const textOpacity = useTransform(smoothProgress, [0.65, 0.85], [0, 1])

  // Prevent text fading so the top doesn't feel blank
  const heroOpacityValue = 1 
  const heroYValue = 0 

  const orbitScale = isMobile ? 1.02 : 0.68
  const scaleVal = (value: number) => 50 + (value - 50) * orbitScale
  const pathD = (c1x: number, c1y: number, c2x: number, c2y: number, ex: number, ey: number) => (
    `M 50,50 C ${scaleVal(c1x)},${scaleVal(c1y)} ${scaleVal(c2x)},${scaleVal(c2y)} ${scaleVal(ex)},${scaleVal(ey)}`
  )
  const nodePos = {
    topLeft: { x: scaleVal(20), y: scaleVal(25) },
    topRight: { x: scaleVal(80), y: scaleVal(25) },
    bottomLeft: { x: isMobile ? scaleVal(26) : scaleVal(30), y: scaleVal(75) },
    bottomRight: { x: isMobile ? scaleVal(74) : scaleVal(70), y: scaleVal(75) }
  }

  return (
    <div className="relative w-full pt-0 pb-0 bg-[#050505] text-white font-sans flex flex-col items-center">

      {/* Ambient glows safely contained */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute right-[-8%] top-[8%] w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[130px]" />
        <div className="absolute left-[-8%] bottom-[15%] w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[130px]" />
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/*  NEW: Solar Constellation Sequence                    */}
      {/* ══════════════════════════════════════════════════════ */}
      <div ref={containerRef} className={`relative w-full ${isMobile ? 'h-[250vh]' : 'h-[300vh]'}`}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
          <div className="absolute top-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-b from-[#050505]/90 via-[#050505]/50 to-transparent pointer-events-none z-20" />
          <div className="absolute bottom-0 left-0 right-0 h-36 md:h-44 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent pointer-events-none z-20" />
          <div className="hidden md:block absolute top-0 bottom-0 left-0 w-16 md:w-24 bg-gradient-to-r from-bg-dark via-bg-dark/80 to-transparent pointer-events-none z-20" />
          
          {/* Background: Embers & Space */}
          <div className="absolute inset-0 z-0 bg-[#050505]">
            {/* Large center subtle glow */}
            <div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-[#FFB000]/[0.02] rounded-full blur-[120px]" />
            
            {/* Milky Way / Nebula Diagonal Dust Band */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[170vw] md:w-[140vw] h-[78vh] md:h-[56vh] rotate-[-35deg] pointer-events-none opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_0%,black_38%,rgba(0,0,0,0.45)_56%,transparent_78%)]">
               {/* Core bright cosmic dust lane */}
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,176,0,0.12)_0%,transparent_60%)] blur-[80px]" />
               
               {/* Intense Nebula Clusters */}
               <div className="absolute top-[20%] left-[15%] w-[40%] h-[80%] bg-[#FFB000]/10 blur-[90px] rounded-[50%]" />
               <div className="absolute top-[35%] left-[50%] w-[45%] h-[90%] bg-[#ff5500]/10 blur-[120px] rounded-[50%]" />
               <div className="absolute top-[10%] left-[30%] w-[30%] h-[60%] bg-[#FFF2D1]/5 blur-[70px] rounded-[50%]" />
               
               {/* Star cluster overlay within the milky way */}
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjAuNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSIxIiBmaWxsPSIjRkZCMDAwIiBvcGFjaXR5PSIwLjkiLz48Y2lyY2xlIGN4PSIyNTAiIGN5PSI1MCIgcj0iMS41IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iMzIwIiBjeT0iMjAwIiByPSIwLjUiIGZpbGw9IiNGRkIwMDAiIG9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjI4MCIgcj0iMC41IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTAiIGN5PSIzMDAiIHI9IjEiIGZpbGw9IiNGRkIwMDAiIG9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjI4MCIgY3k9IjM1MCIgcj0iMC41IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC44Ii8+PC9zdmc+')] opacity-30 mix-blend-screen" style={{ backgroundSize: '200px 200px' }} />
            </div>
            
            {/* Bokeh Orbs (from reference image) */}

            {EMBER_PARTICLES.map((particle, i) => (
              <div key={i} className="absolute rounded-full bg-[#FFB000] animate-pulse" style={{
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
                opacity: particle.opacity,
                animationDelay: particle.animationDelay,
                animationDuration: particle.animationDuration,
                boxShadow: '0 0 8px 1px rgba(255,176,0,0.5)'
              }} />
            ))}
          </div>
          
          <div className="absolute inset-0">
            {/* Static Hero Text Inside Sticky Block */}
            <motion.div style={{ opacity: heroOpacityValue, y: heroYValue }} className="absolute top-20 md:top-24 left-0 w-full flex justify-center z-30 pointer-events-none text-left">
              <div className="w-full max-w-7xl px-6 flex flex-col items-start">
                <div className="-ml-1 sm:-ml-3">
                  <div className="font-mono text-white/55 text-[11px] md:text-xs mb-2 md:mb-4 tracking-[0.2em] uppercase drop-shadow-md">
                    06
                  </div>
                  <h2 className="text-[2.6rem] md:text-[3.8rem] font-bold tracking-tight mb-2 md:mb-3 leading-[1.1] drop-shadow-lg">
                    <span className="text-white block">Let's </span>
                    <span className="text-accent block">Connect.</span>
                  </h2>
                  <p className="text-white/40 text-[14px] md:text-[15px] font-montserrat leading-relaxed mb-5 max-w-[280px] md:max-w-md drop-shadow-md">
                    Open to collaborations, projects, and meaningful conversations.
                  </p>
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="w-[7px] h-[3px] bg-accent/80 -skew-x-12 inline-block" />
                    ))}
                    <div className="w-20 h-[1px] bg-gradient-to-r from-accent/50 to-transparent ml-1" />
                    <div className="relative w-2 h-2">
                      <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />
                      <span className="absolute inset-0 rounded-full bg-accent shadow-[0_0_6px_2px_rgba(255, 176, 0,0.5)]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Constellation Container - shifted right and sized down to create a 2-column layout feel */}
            <div className="absolute inset-0 top-[20vh] md:top-[8vh] md:translate-x-[5%] lg:translate-x-[8%]">
              {/* SVG Connection Lines */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-none overflow-visible">
                  <defs>
                  <linearGradient id="fireLineGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="25%" stopColor="#ff4500" stopOpacity="0.2" />
                    <stop offset="35%" stopColor="#FFB000" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#FFF2D1" stopOpacity="1" />
                    <stop offset="65%" stopColor="#FFB000" stopOpacity="0.8" />
                    <stop offset="75%" stopColor="#ff4500" stopOpacity="0.2" />
                  </linearGradient>
                  <radialGradient id="rootFade" cx="50%" cy="50%" r="25%">
                    <stop offset="0%" stopColor="#FFF2D1" stopOpacity="0.8" />
                    <stop offset="30%" stopColor="#FFB000" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#FFB000" stopOpacity="0" />
                  </radialGradient>
                  <filter id="glowBlur">
                     <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
                     <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                     </feMerge>
                  </filter>
                </defs>
                
                <g filter="url(#glowBlur)">
                  {/* TOP LEFT (GitHub) */}
                  <motion.path d={pathD(40, 55, 25, 20, 20, 25)} stroke="url(#fireLineGrad)" strokeWidth="0.15" strokeLinecap="round" opacity="0.8" fill="none" style={{ pathLength: lineProgress }} />
                  <motion.path d={pathD(50, 30, 35, 35, 20, 25)} stroke="url(#fireLineGrad)" strokeWidth="0.08" strokeLinecap="round" opacity="0.4" fill="none" style={{ pathLength: lineProgress }} />

                  {/* TOP RIGHT (LinkedIn) */}
                  <motion.path d={pathD(60, 55, 75, 20, 80, 25)} stroke="url(#fireLineGrad)" strokeWidth="0.15" strokeLinecap="round" opacity="0.8" fill="none" style={{ pathLength: lineProgress }} />
                  <motion.path d={pathD(50, 30, 65, 35, 80, 25)} stroke="url(#fireLineGrad)" strokeWidth="0.08" strokeLinecap="round" opacity="0.4" fill="none" style={{ pathLength: lineProgress }} />

                  {/* BOTTOM LEFT (X) */}
                  <motion.path d={pathD(40, 45, 25, 80, 30, 75)} stroke="url(#fireLineGrad)" strokeWidth="0.15" strokeLinecap="round" opacity="0.8" fill="none" style={{ pathLength: lineProgress }} />
                  <motion.path d={pathD(50, 70, 35, 65, 30, 75)} stroke="url(#fireLineGrad)" strokeWidth="0.08" strokeLinecap="round" opacity="0.4" fill="none" style={{ pathLength: lineProgress }} />

                  {/* BOTTOM RIGHT (Instagram) */}
                  <motion.path d={pathD(60, 45, 75, 80, 70, 75)} stroke="url(#fireLineGrad)" strokeWidth="0.15" strokeLinecap="round" opacity="0.8" fill="none" style={{ pathLength: lineProgress }} />
                  <motion.path d={pathD(50, 70, 65, 65, 70, 75)} stroke="url(#fireLineGrad)" strokeWidth="0.08" strokeLinecap="round" opacity="0.4" fill="none" style={{ pathLength: lineProgress }} />
                </g>
              </svg>
            </div>

            {/* Constellation Nodes */}
            <div className="absolute inset-0 z-30 pointer-events-none">
              
              {/* Center Sun Node (Linktree) */}
              <CenterSun 
                opacity={sunOpacity} 
                scale={sunScale}
                onClick={() => {
                  window.open('https://linktr.ee/albin.thomas?utm_source=qr_code', '_blank')
                }} 
              />

              {/* Node 1: GitHub (Top Left) */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${nodePos.topLeft.x}%`, top: `${nodePos.topLeft.y}%` }}>
                <SolarNode 
                  icon={<GitHubSocialIcon />} 
                  href="https://github.com/Albiin777" 
                  title="GITHUB" 
                  textAlignment="top-left" 
                  opacity={nodesOpacity} 
                  scale={nodesScale} 
                  textOpacity={textOpacity} 
                  ringOrientation="top"
                />
              </div>

              {/* Node 2: LinkedIn (Top Right) */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${nodePos.topRight.x}%`, top: `${nodePos.topRight.y}%` }}>
                <SolarNode 
                  icon={<LinkedInSocialIcon />} 
                  href="https://www.linkedin.com/in/albinthomas18/" 
                  title="LINKEDIN" 
                  textAlignment="right" 
                  opacity={nodesOpacity} 
                  scale={nodesScale} 
                  textOpacity={textOpacity} 
                  ringOrientation="top"
                />
              </div>

              {/* Node 3: X / Twitter (Bottom Left) */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${nodePos.bottomLeft.x}%`, top: `${nodePos.bottomLeft.y}%` }}>
                <SolarNode 
                  icon={<TwitterSocialIcon />} 
                  href="https://x.com/albiin7777" 
                  title="TWITTER / X" 
                  textAlignment="left" 
                  opacity={nodesOpacity} 
                  scale={nodesScale} 
                  textOpacity={textOpacity} 
                  ringOrientation="bottom"
                />
              </div>

              {/* Node 4: Instagram (Bottom Right) */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${nodePos.bottomRight.x}%`, top: `${nodePos.bottomRight.y}%` }}>
                <SolarNode 
                  icon={<InstagramSocialIcon />} 
                  href="https://instagram.com/albiin.thomas/" 
                  title="INSTAGRAM" 
                  textAlignment="right" 
                  opacity={nodesOpacity} 
                  scale={nodesScale} 
                  textOpacity={textOpacity} 
                  ringOrientation="bottom"
                />
              </div>

            </div>
          </div>
          </div>

        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col overflow-visible">
        <div className="absolute left-1/2 top-0 bottom-0 w-screen -translate-x-1/2 bg-[#050505] pointer-events-none z-0" />
        <div className="-ml-1 sm:-ml-3 w-full relative z-10">
          {/* ══════════════════════════════════════════════════════ */}
          {/*  Original 4-Card Info Grid                            */}
          {/* ══════════════════════════════════════════════════════ */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full mb-16 mt-[30px] relative z-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.12, margin: '0px 0px -6% 0px' }}
            transition={{ staggerChildren: 0.075 }}
          >
            <ContactCard
              icon={<PhoneIcon />}
              label="CALL"
              value="+91 80785 74876"
              onClick={() => window.location.href = 'tel:+918078574876'}
            />
            <ContactCard
              icon={<EnvelopeIcon />}
              label="EMAIL"
              value="albiin7777@gmail.com"
              onClick={() => window.location.href = 'mailto:albiin7777@gmail.com'}
            />
            <ContactCard
              icon={<MapPinIcon />}
              label="LOCATION"
              value="Thiruvalla, Keralam"
              onClick={() => window.open('https://goo.gl/maps/gLy71usGCQFwps9K7', '_blank')}
            />
            <ContactCard
              icon={<DocumentIcon />}
              label="RESUME"
              value="Download My Resume ↗"
              onClick={() => downloadResume(resumeUrl)}
            />
          </motion.div>

          {/* ══════════════════════════════════════════════════════ */}
          {/*  07 // GET IN TOUCH — Original Form Layout            */}
          {/* ══════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start relative z-20 pb-20">

          {/* Left — heading */}
          <motion.div
            className="lg:col-span-5 flex flex-col items-start justify-center"
            initial={{ opacity: 0, x: -28, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ duration: 0.62, ease: 'easeOut' }}
          >
            <div className="font-mono text-white/40 text-xs mb-4 tracking-[0.2em] uppercase">
              07
            </div>
            <h2 className="text-[2.6rem] md:text-[3rem] font-bold tracking-tight leading-[1.1] mb-3">
              <span className="text-white block">Send Me</span>
              <span className="text-accent block">a Message.</span>
            </h2>
            <p className="text-white/40 text-[14px] font-montserrat leading-relaxed">
              Interested in working together or just saying hello? Feel free to connect.
            </p>

            {/* Decorative accent line */}
            <div className="flex items-center gap-1.5 mt-6">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="w-[7px] h-[3px] bg-accent/70 -skew-x-12 inline-block" />
              ))}
              <div className="w-16 h-[1px] bg-gradient-to-r from-accent/40 to-transparent ml-1" />
              <div className="relative w-1.5 h-1.5 ml-1">
                <span className="absolute inset-0 rounded-full bg-accent/35 animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* Right — form with button inside */}
          <motion.div
            className="lg:col-span-7 flex flex-col w-full"
            initial={{ opacity: 0, x: 28, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.66, ease: 'easeOut', delay: 0.08 }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">

              {/* Name + Email row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] text-white/50 font-mono uppercase tracking-[0.18em]">Your Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="w-full bg-[#0a0a0c]/80 border border-white/[0.08] hover:border-white/[0.14]
                                 focus:border-accent/45 focus:shadow-[0_0_0_1px_rgba(255, 176, 0,0.1)]
                                 px-4 py-3 text-[12.5px] text-white placeholder-white/25
                                 outline-none transition-all duration-300 font-sans"
                      style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <UserIcon />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] text-white/50 font-mono uppercase tracking-[0.18em]">Your Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="w-full bg-[#0a0a0c]/80 border border-white/[0.08] hover:border-white/[0.14]
                                 focus:border-accent/45 focus:shadow-[0_0_0_1px_rgba(255, 176, 0,0.1)]
                                 px-4 py-3 text-[12.5px] text-white placeholder-white/25
                                 outline-none transition-all duration-300 font-sans"
                      style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <EnvelopeIcon />
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10.5px] text-white/50 font-mono uppercase tracking-[0.18em]">Your Message</label>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    rows={5}
                    required
                    className="w-full bg-[#0a0a0c]/80 border border-white/[0.08] hover:border-white/[0.14]
                               focus:border-accent/45 focus:shadow-[0_0_0_1px_rgba(255, 176, 0,0.1)]
                               px-4 py-3 text-[12.5px] text-white placeholder-white/25
                               outline-none resize-none transition-all duration-300 font-sans"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                  />
                  <div className="absolute right-3.5 bottom-3.5 pointer-events-none">
                    <PencilIcon />
                  </div>
                </div>
              </div>

              {/* SEND MESSAGE — centered on mobile, inline on desktop */}
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 sm:gap-4 mt-2">

                {/* Left decorative line */}
                <div className="hidden sm:flex items-center gap-1.5 text-accent/30 flex-1 min-w-0">
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-accent/40" />
                  <span className="text-[6px] tracking-widest font-mono select-none">▰▰</span>
                </div>

                {/* Button — orange fill sweep on hover */}
                <div className="relative group shrink-0 overflow-hidden w-full sm:w-auto"
                  style={{ clipPath: 'polygon(12px 0,calc(100% - 12px) 0,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0 calc(100% - 12px),0 12px)' }}
                >
                  {/* Hover fill sweep background */}
                  <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  {/* Outer glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                  shadow-[0_0_20px_4px_rgba(255, 176, 0,0.4)] pointer-events-none" />
                  <button
                    type="submit"
                    disabled={status === 'sending' || status === 'success'}
                    className="relative z-10 w-full sm:w-auto px-10 py-3 border border-accent/50 group-hover:border-accent
                               bg-[#09090b]/90
                               text-white font-mono text-[10.5px] uppercase tracking-[0.28em]
                               flex items-center justify-center gap-2.5 cursor-pointer
                               transition-colors duration-300
                               disabled:opacity-50 disabled:cursor-not-allowed select-none"
                    style={{ clipPath: 'polygon(12px 0,calc(100% - 12px) 0,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0 calc(100% - 12px),0 12px)' }}
                  >
                    {status === 'idle' && <><span>SEND MESSAGE</span><SendIcon /></>}
                    {status === 'sending' && <span>SENDING...</span>}
                    {status === 'success' && <span>MESSAGE SENT ✓</span>}
                    {status === 'error' && <span>TRY AGAIN</span>}
                  </button>
                </div>

                {/* Right decorative line */}
                <div className="hidden sm:flex items-center gap-1.5 text-accent/30 flex-1 min-w-0">
                  <span className="text-[6px] tracking-widest font-mono select-none">▰▰</span>
                  <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-accent/40" />
                </div>

              </div>

            </form>
          </motion.div>

        </div>{/* end grid: 07 GET IN TOUCH */}
        </div>
      </div>{/* end max-w-7xl container */}

      {/* ══════════════════════════════════════════════════════ */}
      {/*  FOOTER — Original Full-Width                         */}
      {/* ══════════════════════════════════════════════════════ */}
      <footer className="relative w-full flex flex-col items-center overflow-hidden bg-[#050505] pb-6 z-10 px-4 sm:px-0 mt-8">

        {/* Glowing divider — pure light bloom, angled end brackets */}
        <div className="relative w-full flex items-center justify-center h-[13px]">
          {/* Left arm */}
          <motion.div
            className="absolute left-0 right-1/2 flex items-center justify-end origin-right"
            initial={{ scaleX: 0, opacity: 0.35 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg width="22" height="13" viewBox="0 0 22 13" fill="none" className="shrink-0 mr-[-1px] opacity-55">
              <polyline points="0,13 8,0 22,0" stroke="#FFB000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="h-[1px] flex-1"
              style={{ background: 'linear-gradient(to right, transparent 0%, #FFB0002a 20%, #FFB000aa 100%)' }} />
          </motion.div>

          {/* Center bloom glow — realistic multi-layered volumetric light beam */}
          <div className="relative z-10 pointer-events-none w-full h-0 flex items-center justify-center">
            {/* 1. Widest soft ambient glow backdrop (non-clipped, centered at bottom) */}
            <div className="absolute bottom-[0px] w-[420px] h-[40px] -translate-y-1/2"
              style={{
                background: 'radial-gradient(ellipse at bottom, rgba(255, 176, 0, 0.12) 0%, rgba(255, 110, 0, 0.02) 60%, transparent 90%)',
                filter: 'blur(15px)',
              }}
            />

            {/* 2. Outer volumetric light beam (softer, wider cone) */}
            <div className="absolute bottom-[0px] w-[340px] h-[96px]"
              style={{
                background: 'linear-gradient(to top, rgba(255, 176, 0, 0.16) 0%, rgba(255, 110, 0, 0.04) 50%, transparent 100%)',
                clipPath: 'polygon(15% 0, 85% 0, 62% 100%, 38% 100%)',
                filter: 'blur(15px)',
              }}
            />

            {/* 3. Inner core light beam (brighter, narrower cone) */}
            <div className="absolute bottom-[0px] w-[140px] h-[90px]"
              style={{
                background: 'linear-gradient(to top, rgba(255, 85, 31, 0.32) 0%, rgba(255, 180, 60, 0.08) 60%, transparent 100%)',
                clipPath: 'polygon(28% 0, 72% 0, 58% 100%, 42% 100%)',
                filter: 'blur(8px)',
              }}
            />

            {/* 4. Very sharp, flat horizontal laser line (lens flare horizontal beam) */}
            <div className="absolute bottom-[0px] w-[180px] h-[2.5px] -translate-y-1/2"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(255, 133, 0, 0.85) 20%, rgba(255, 235, 170, 1) 50%, rgba(255, 133, 0, 0.85) 80%, transparent)',
                filter: 'blur(0.8px)',
              }}
            />

            {/* 5. Intense pinpoint center glint (hologram lens source) */}
            <div className="absolute bottom-[0px] w-[8px] h-[8px] -translate-y-1/2"
              style={{
                background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 190, 60, 0.9) 40%, transparent 75%)',
                filter: 'blur(0.6px)',
              }}
            />
          </div>

          {/* Right arm */}
          <motion.div
            className="absolute left-1/2 right-0 flex items-center justify-start origin-left"
            initial={{ scaleX: 0, opacity: 0.35 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="h-[1px] flex-1"
              style={{ background: 'linear-gradient(to right, #FFB000aa 0%, #FFB0002a 80%, transparent 100%)' }} />
            <svg width="22" height="13" viewBox="0 0 22 13" fill="none" className="shrink-0 ml-[-1px] opacity-55">
              <polyline points="22,13 14,0 0,0" stroke="#FFB000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>

        {/* Copyright text */}
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-white/35 text-[10px] sm:text-[11px] font-montserrat tracking-wide select-none mt-3.5 text-center px-4">
          <span className="inline-flex items-center justify-center gap-1.5">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="text-white/45"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="8.5" />
              <path d="M14.8 9.2a4 4 0 1 0 0 5.6" strokeLinecap="round" />
            </svg>
            <span>2026 <span className="text-white/85 font-semibold">Albin Thomas</span>. All Rights Reserved</span>
          </span>
          <span className="hidden sm:inline text-white/10 mx-1.5">|</span>
          <div className="flex items-center gap-1">
            <span>Created with</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-white/85 inline-block mx-0.5" aria-label="love">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>by <span className="text-white/85 font-semibold">Albin</span></span>
          </div>
        </div>

      </footer>

    </div>
  )
}
