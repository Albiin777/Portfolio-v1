import { useState, useRef, useEffect, type ReactNode } from 'react'
import { useDocData } from '../lib/content'
import { sendPortfolioMessage } from '../lib/messages'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import type { Variants } from 'framer-motion'

type ProfileData = {
  resumeUrl: string
}

export default function Contact() {
  return <LegacyContact />
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

const ArrowRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-accent shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
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
const EMBER_PARTICLES = Array.from({ length: 42 }, (_, i) => {
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



// ─── Reusable card icon wrapper ───────────────────────────────────────────────
const CardIcon = ({ children }: { children: ReactNode }) => (
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
  icon: ReactNode
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
const LegacyContact = () => {
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
      await sendPortfolioMessage({
        type: 'direct',
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      })
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch (error) {
      console.error('Failed to send message:', error)
      setStatus('error')
    }
  }

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 92, damping: 24, restDelta: 0.001 })
  const cardOpacity = useTransform(smoothProgress, [0, 0.08], [0, 1])
  const cardScale = useTransform(smoothProgress, [0, 0.08], [0.96, 1])
  const logoOpacity = useTransform(smoothProgress, [0.02, 0.22], [1, 0])
  const logoScale = useTransform(smoothProgress, [0.02, 0.22], [1, 0.94])
  const qrOpacity = useTransform(smoothProgress, [0.18, 0.4], [0, 1])
  const qrTranslate = useTransform(smoothProgress, [0.18, 0.4], [26, 0])
  const qrClip = useTransform(smoothProgress, [0.18, 0.4], ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'])
  const link1Opacity = useTransform(smoothProgress, [0.4, 0.48], [0, 1])
  const link1Offset = useTransform(smoothProgress, [0.4, 0.48], [16, 0])
  const link2Opacity = useTransform(smoothProgress, [0.46, 0.54], [0, 1])
  const link2Offset = useTransform(smoothProgress, [0.46, 0.54], [16, 0])
  const link3Opacity = useTransform(smoothProgress, [0.52, 0.60], [0, 1])
  const link3Offset = useTransform(smoothProgress, [0.52, 0.60], [16, 0])
  const link4Opacity = useTransform(smoothProgress, [0.58, 0.66], [0, 1])
  const link4Offset = useTransform(smoothProgress, [0.58, 0.66], [16, 0])

  const linkStyles = [
    { opacity: link1Opacity, y: link1Offset },
    { opacity: link2Opacity, y: link2Offset },
    { opacity: link3Opacity, y: link3Offset },
    { opacity: link4Opacity, y: link4Offset }
  ]

  return (
    <div className="contact-section relative w-full pt-0 pb-0 bg-[#050505] text-white font-sans flex flex-col items-center">

      {/* Ambient glows safely contained */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute right-[-8%] top-[8%] w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[130px]" />
        <div className="absolute left-[-8%] bottom-[15%] w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[130px]" />
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/*  Solar Constellation Sequence                          */}
      {/* ══════════════════════════════════════════════════════ */}
      <div ref={containerRef} className={`relative w-full ${isMobile ? 'h-[250vh]' : 'h-[300vh]'}`}>
        <div className="contact-sticky sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
          <div className="contact-top-fade absolute top-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-b from-[#050505]/90 via-[#050505]/50 to-transparent pointer-events-none z-20" />
          <div className="contact-bottom-fade absolute bottom-0 left-0 right-0 h-36 md:h-44 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent pointer-events-none z-20" />
          <div className="contact-side-fade hidden md:block absolute top-0 bottom-0 left-0 w-16 md:w-24 bg-gradient-to-r from-bg-dark via-bg-dark/80 to-transparent pointer-events-none z-20" />

          {/* Background: Embers & Space */}
          <div className="contact-space-bg absolute inset-0 z-0 bg-[#050505]">
            <div className="contact-center-glow absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-[#FFB000]/[0.02] rounded-full blur-[120px]" />

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
            <div className="absolute inset-0 flex flex-col justify-start px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl pt-16 md:pt-24 lg:pt-[14vh]">
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full gap-12 lg:gap-8 mt-4 lg:mt-8">

                {/* LEFT SIDE TEXT & BUTTON */}
                <div className="flex flex-col items-start w-full lg:w-[45%] z-30">
                  <motion.div
                    initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55 drop-shadow-md md:mb-4 md:text-xs"
                  >
                    06
                  </motion.div>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="mb-4 text-[2.6rem] font-bold leading-[1.05] tracking-tight drop-shadow-lg md:text-[3.8rem]"
                  >
                    <span className="block text-white">Let's </span>
                    <span className="block text-accent">Connect.</span>
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                    className="mb-8 md:mb-6 max-w-[280px] font-montserrat text-[14px] leading-relaxed text-white/60 drop-shadow-md md:max-w-md md:text-[15px]"
                  >
                    Open to collaborations, projects, and meaningful conversations.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, x: -15, filter: 'blur(4px)' }}
                    whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                    className="hidden md:flex items-center gap-4 mb-8 w-full max-w-[280px] opacity-90"
                  >
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <div key={i} className="w-4 h-[2px] bg-accent" />
                      ))}
                    </div>
                    <div className="flex items-center flex-1">
                      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-accent" />
                      <div className="w-[6px] h-[6px] rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
                    </div>
                  </motion.div>

                  <motion.a
                    initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                    href="https://wa.me/918078574876" target="_blank" rel="noreferrer" className="contact-start-btn group flex items-center justify-between w-full max-w-[280px] rounded-[24px] border-[1px] border-accent/50 bg-[#060606] px-5 py-3 transition-all duration-300 hover:border-accent hover:shadow-[0_0_15px_rgba(255,176,0,0.15)]"
                  >
                    <div className="flex items-center gap-3">
                      <WhatsAppIcon />
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/80">START A CONVERSATION</span>
                    </div>
                    <span className="text-accent group-hover:translate-x-1 transition-transform"><ArrowRightIcon /></span>
                  </motion.a>
                </div>

                {/* RIGHT SIDE QR CODE */}
                <div className="flex flex-col items-center justify-center w-full lg:w-[50%] relative z-30">
                  <motion.div style={{ opacity: cardOpacity, scale: cardScale }} className="w-full max-w-[320px] md:max-w-[360px] lg:max-w-[360px] relative">
                    <div className="contact-qr-container relative aspect-square rounded-[36px] border border-accent/80 bg-black/20 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(255,176,0,0.3),inset_0_-15px_30px_rgba(0,0,0,0.6),inset_0_4px_15px_rgba(255,255,255,0.15)] p-6 md:p-8 overflow-hidden group">
                      
                      {/* Convex Water Droplet Highlight */}
                      <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[70%] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.15)_0%,_transparent_70%)] pointer-events-none rounded-full transform rotate-[-5deg]" />
                      
                      {/* Additional Edge Light for Depth */}
                      <div className="absolute inset-0 rounded-[36px] shadow-[inset_0_0_20px_rgba(255,176,0,0.1)] pointer-events-none" />

                      {/* Top rim light */}
                      <div className="absolute top-[1px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-90 blur-[0.5px]" />

                      {/* Content Images */}
                      <div className="relative w-full h-full rounded-[24px] overflow-hidden flex items-center justify-center">
                        <motion.img
                          src="/logo-new.png"
                          alt="Albin Thomas logo"
                          className="contact-logo absolute inset-0 h-full w-full object-contain p-12 drop-shadow-[0_0_15px_rgba(255,176,0,0.4)]"
                          style={{ opacity: logoOpacity, scale: logoScale }}
                        />
                        <motion.img
                          src="/albin-linktree.svg"
                          alt="Linktree QR"
                          className="absolute inset-0 h-full w-full object-contain"
                          style={{
                            opacity: qrOpacity,
                            y: qrTranslate,
                            clipPath: qrClip,
                            filter: 'brightness(0) saturate(100%) invert(64%) sepia(55%) saturate(3015%) hue-rotate(7deg) brightness(105%) contrast(104%)'
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* SOCIAL LINKS ROW at the bottom right */}
              <div className="w-full mt-8 lg:mt-24 relative z-30 flex justify-center">
                
                <div className="flex flex-row flex-wrap justify-center items-center gap-10 md:gap-14 lg:gap-[60px] w-full max-w-5xl">
                  {[
                    { name: 'GitHub', icon: <GitHubSocialIcon />, url: 'https://github.com/Albiin777' },
                    { name: 'LinkedIn', icon: <LinkedInSocialIcon />, url: 'https://www.linkedin.com/in/albinthomas18/' },
                    { name: 'Instagram', icon: <InstagramSocialIcon />, url: 'https://instagram.com/albiin.thomas/' },
                    { name: 'X / Twitter', icon: <TwitterSocialIcon />, url: 'https://x.com/albiin7777' }
                  ].map((link, idx) => (
                    <motion.a key={idx} href={link.url} target="_blank" rel="noreferrer" style={linkStyles[idx]} className="relative group flex items-center rounded-full border border-accent/40 bg-[#050505] shadow-[0_0_15px_rgba(255,176,0,0.1)] overflow-visible px-5 py-2.5 lg:px-7 lg:py-3.5 hover:border-accent hover:shadow-[0_0_25px_rgba(255,176,0,0.25)] transition-all">
                      
                      {/* Yellow Floor Reflection */}
                      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[70%] h-[3px] bg-accent blur-[10px] opacity-50 rounded-full mix-blend-screen pointer-events-none group-hover:opacity-80 group-hover:blur-[14px] transition-all" />

                      {/* Glass Highlight */}
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-full" />
                      
                      {/* Icon */}
                      <div className="text-white relative z-10 w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center">
                        {link.icon}
                      </div>
                      
                      {/* Divider */}
                      <div className="w-[1px] h-[14px] lg:h-[16px] bg-white/20 mx-3 relative z-10" />
                      
                      {/* Text */}
                      <span className="text-[10px] lg:text-[11px] font-mono font-semibold uppercase tracking-[0.24em] text-white/90 relative z-10">
                        {link.name}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col overflow-visible">
        <div className="contact-lower-bg absolute left-1/2 top-0 bottom-0 w-screen -translate-x-1/2 bg-[#050505] pointer-events-none z-0" />
        <div className="w-full relative z-10">
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
                      className="contact-submit-btn relative z-10 w-full sm:w-auto px-10 py-3 border border-accent/50 group-hover:border-accent
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
      <footer className="contact-footer relative w-full flex flex-col items-center overflow-hidden bg-[#050505] pb-6 z-10 px-4 sm:px-0 mt-8">

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
