import { useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useDocData } from '../lib/content'

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

// ─── Icon Components ──────────────────────────────────────────────────────────
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

// ─── Reusable card icon wrapper ───────────────────────────────────────────────
const CardIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-10 h-10 border border-accent/30 bg-accent/[0.06] flex items-center justify-center
                  shadow-[0_0_12px_rgba(255,75,31,0.07)] group-hover:shadow-[0_0_18px_rgba(255,75,31,0.22)]
                  group-hover:border-accent/55 group-hover:bg-accent/[0.12]
                  transition-all duration-300 shrink-0"
    style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}
  >
    {children}
  </div>
)

// ─── Contact Card ─────────────────────────────────────────────────────────────
interface ContactCardProps {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  onClick?: () => void
}
const ContactCard = ({ icon, label, value, sub, onClick }: ContactCardProps) => (
  <div
    className={`group relative bg-[#0e0e10]/70 border border-white/[0.07] p-5 flex flex-col gap-3
               hover:border-accent/20 transition-all duration-300 overflow-hidden ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
    onClick={onClick}
  >
    {/* top-right angled corner accent */}
    <span className="absolute top-0 right-[10px] w-[calc(100%-10px)] h-[1px] bg-accent/10 group-hover:bg-accent/25 transition-colors duration-300" />
    <span className="absolute top-[10px] right-0 w-[1px] h-[calc(100%-10px)] bg-accent/10 group-hover:bg-accent/25 transition-colors duration-300" />

    <CardIcon>{icon}</CardIcon>
    <div className="flex flex-col gap-0.5">
      <span className="text-[9.5px] text-white/40 font-mono uppercase tracking-[0.22em]">{label}</span>
      <span className="text-[12.5px] font-semibold text-white font-sans group-hover:text-accent transition-colors duration-300 leading-snug">
        {value}
      </span>
      {sub && <span className="text-[10px] text-white/30 font-mono mt-0.5 leading-snug">{sub}</span>}
    </div>
  </div>
)

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const profile = useDocData<ProfileData>('profile', 'main', { resumeUrl: '/Albin_Thomas-resume.pdf' })
  const resumeUrl = profile.resumeUrl || '/Albin_Thomas-resume.pdf'

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

  return (
    <div className="relative w-full pt-16 md:pt-20 pb-0 bg-bg-dark text-white font-sans overflow-hidden border-t border-white/[0.03] flex flex-col items-center">

      {/* Ambient glows */}
      <div className="absolute right-[-8%] top-[8%]  w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute left-[-8%] bottom-[15%] w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[130px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col">

        {/* ══════════════════════════════════════════════════════ */}
        {/*  06 // CONTACT — Hero Row                             */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-center mb-10">

          {/* Left — typography */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="font-mono text-white/40 text-xs mb-4 tracking-[0.2em] uppercase">
              06 // CONTACT
            </div>
            <h2 className="text-[2.6rem] md:text-[3.2rem] font-bold tracking-tight mb-3 leading-[1.1]">
              <span className="text-white">Let's&nbsp;</span>
              <span className="text-accent">Connect.</span>
            </h2>
            <p className="text-white/40 text-[13px] font-mono leading-relaxed mb-5 max-w-md">
              Open to collaborations, projects, and meaningful conversations.
            </p>

            {/* Accent dashes + line */}
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="w-[7px] h-[3px] bg-accent/80 -skew-x-12 inline-block" />
              ))}
              <div className="w-20 h-[1px] bg-gradient-to-r from-accent/50 to-transparent ml-1" />
              <div className="relative w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />
                <span className="absolute inset-0 rounded-full bg-accent shadow-[0_0_6px_2px_rgba(255,75,31,0.5)]" />
              </div>
            </div>
          </div>

          {/* Right — orbital graphic */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <svg width="240" height="200" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent/50 opacity-75">
              <defs>
                <radialGradient id="cGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff4b1f" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="#ff8500" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ff4b1f" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="120" cy="100" r="44" fill="url(#cGlow)" />
              <circle cx="120" cy="100" r="4" fill="#ffaa1f" />

              {/* Spinning core element */}
              <circle cx="120" cy="100" r="9" stroke="#ff4b1f" strokeWidth="1" strokeDasharray="1.5 3" className="animate-spin" style={{ transformOrigin: '120px 100px', animationDuration: '8s' }} />

              {/* Orbit 1: rx=62, ry=26 */}
              <g transform="rotate(-15 120 100)">
                <ellipse cx="120" cy="100" rx="62" ry="26" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 4" />
                <path id="orbitPath1" d="M 58,100 A 62,26 0 1,0 182,100 A 62,26 0 1,0 58,100" fill="none" />
                <circle r="1.5" fill="#ff8500" className="animate-pulse">
                  <animateMotion dur="10s" repeatCount="indefinite">
                    <mpath href="#orbitPath1" />
                  </animateMotion>
                </circle>
              </g>

              {/* Orbit 2: rx=92, ry=39 */}
              <g transform="rotate(-15 120 100)">
                <ellipse cx="120" cy="100" rx="92" ry="39" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 6" />
                <path id="orbitPath2" d="M 28,100 A 92,39 0 1,0 212,100 A 92,39 0 1,0 28,100" fill="none" />
                <circle r="2" fill="#ff4b1f">
                  <animateMotion dur="16s" repeatCount="indefinite">
                    <mpath href="#orbitPath2" />
                  </animateMotion>
                </circle>
              </g>

              {/* Orbit 3: rx=126, ry=53 */}
              <g transform="rotate(-15 120 100)">
                <ellipse cx="120" cy="100" rx="126" ry="53" stroke="currentColor" strokeWidth="0.55" strokeDasharray="1 5" />
                <path id="orbitPath3" d="M -6,100 A 126,53 0 1,0 246,100 A 126,53 0 1,0 -6,100" fill="none" />
                <circle r="1.5" fill="#ffaa1f">
                  <animateMotion dur="24s" repeatCount="indefinite">
                    <mpath href="#orbitPath3" />
                  </animateMotion>
                </circle>
              </g>

              {/* Orbit 4: rx=157, ry=66 */}
              <g transform="rotate(-15 120 100)">
                <ellipse cx="120" cy="100" rx="157" ry="66" stroke="currentColor" strokeWidth="0.45" strokeDasharray="4 8" />
                <path id="orbitPath4" d="M -37,100 A 157,66 0 1,0 277,100 A 157,66 0 1,0 -37,100" fill="none" />
                <circle r="1" fill="#fff" opacity="0.7">
                  <animateMotion dur="32s" repeatCount="indefinite">
                    <mpath href="#orbitPath4" />
                  </animateMotion>
                </circle>
              </g>
            </svg>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/*  4-Card Info Grid                                     */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full mb-4">
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
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/*  Social Panel — CONNECT WITH ME inside the box       */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="relative z-20 w-full border border-white/[0.07] bg-[#0e0e10]/50 mb-12 overflow-hidden"
          style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}>

          {/* Label row */}
          <div className="flex items-center justify-center gap-3 py-3 border-b border-white/[0.06]">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-accent/30 ml-6" />
            <span className="text-[9px] font-mono tracking-[0.3em] text-white/50 uppercase select-none">
              CONNECT WITH ME
            </span>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-accent/30 mr-6" />
          </div>

          {/* Social links */}
          <div className="flex flex-row flex-wrap items-center justify-center gap-4 px-6 py-5">
            <a href="https://github.com/Albiin777" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-white/55 hover:text-accent transition-all duration-300 font-sans font-semibold text-[13px] group">
              <GitHubSocialIcon />
              <span>GitHub</span>
            </a>
            <span className="w-[1px] h-5 bg-white/8" />
            <a href="https://www.linkedin.com/in/albinthomas18/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-white/55 hover:text-accent transition-all duration-300 font-sans font-semibold text-[13px] group">
              <LinkedInSocialIcon />
              <span>LinkedIn</span>
            </a>
            <span className="w-[1px] h-5 bg-white/8" />
            <a href="https://x.com/albiin7777" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-white/55 hover:text-accent transition-all duration-300 font-sans font-semibold text-[13px] group">
              <TwitterSocialIcon />
              <span>Twitter / X</span>
            </a>
            <span className="w-[1px] h-5 bg-white/8" />
            <a href="https://instagram.com/albiin.thomas/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-white/55 hover:text-accent transition-all duration-300 font-sans font-semibold text-[13px] group">
              <InstagramSocialIcon />
              <span>Instagram</span>
            </a>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/*  07 // GET IN TOUCH — two-col layout                 */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">

          {/* Left — heading only (plane removed) */}
          <div className="lg:col-span-5 flex flex-col items-start justify-center">
            <div className="font-mono text-white/40 text-xs mb-4 tracking-[0.2em] uppercase">
              07 // GET IN TOUCH
            </div>
            <h2 className="text-[2.6rem] md:text-[3rem] font-bold tracking-tight leading-[1.1] mb-3">
              <span className="text-white block">Send Me</span>
              <span className="text-accent block">a Message.</span>
            </h2>
            <p className="text-white/40 text-[13px] font-mono leading-relaxed">
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
          </div>

          {/* Right — form with button inside */}
          <div className="lg:col-span-7 flex flex-col w-full">
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
                                 focus:border-accent/45 focus:shadow-[0_0_0_1px_rgba(255,75,31,0.1)]
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
                                 focus:border-accent/45 focus:shadow-[0_0_0_1px_rgba(255,75,31,0.1)]
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
                               focus:border-accent/45 focus:shadow-[0_0_0_1px_rgba(255,75,31,0.1)]
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
                                  shadow-[0_0_20px_4px_rgba(255,75,31,0.4)] pointer-events-none" />
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
          </div>

        </div>{/* end grid: 07 GET IN TOUCH */}

      </div>{/* end max-w-7xl container */}

      {/* ══════════════════════════════════════════════════════ */}
      {/*  FOOTER — full-width, integrated with the page        */}
      {/* ══════════════════════════════════════════════════════ */}
      <footer className="relative w-full mt-24 flex flex-col items-center overflow-hidden bg-[#090909] pb-6 z-10 px-4 sm:px-0">

        {/* Glowing divider — pure light bloom, angled end brackets */}
        <div className="relative w-full flex items-center justify-center h-[13px]">
          {/* Left arm */}
          <div className="absolute left-0 right-1/2 flex items-center justify-end">
            <svg width="22" height="13" viewBox="0 0 22 13" fill="none" className="shrink-0 mr-[-1px] opacity-55">
              <polyline points="0,13 8,0 22,0" stroke="#ff4b1f" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="h-[1px] flex-1"
              style={{ background: 'linear-gradient(to right, transparent 0%, #ff4b1f2a 20%, #ff4b1faa 100%)' }} />
          </div>

          {/* Center bloom glow — realistic multi-layered volumetric light beam */}
          <div className="relative z-10 pointer-events-none w-full h-0 flex items-center justify-center">
            {/* 1. Widest soft ambient glow backdrop (non-clipped, centered at bottom) */}
            <div className="absolute bottom-[0px] w-[420px] h-[40px] -translate-y-1/2"
              style={{
                background: 'radial-gradient(ellipse at bottom, rgba(255, 75, 31, 0.12) 0%, rgba(255, 110, 0, 0.02) 60%, transparent 90%)',
                filter: 'blur(15px)',
              }}
            />

            {/* 2. Outer volumetric light beam (softer, wider cone) */}
            <div className="absolute bottom-[0px] w-[340px] h-[96px]"
              style={{
                background: 'linear-gradient(to top, rgba(255, 75, 31, 0.16) 0%, rgba(255, 110, 0, 0.04) 50%, transparent 100%)',
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
          <div className="absolute left-1/2 right-0 flex items-center justify-start">
            <div className="h-[1px] flex-1"
              style={{ background: 'linear-gradient(to right, #ff4b1faa 0%, #ff4b1f2a 80%, transparent 100%)' }} />
            <svg width="22" height="13" viewBox="0 0 22 13" fill="none" className="shrink-0 ml-[-1px] opacity-55">
              <polyline points="22,13 14,0 0,0" stroke="#ff4b1f" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Copyright text */}
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-white/35 text-[10px] sm:text-[11px] font-mono tracking-wide select-none mt-3.5 text-center px-4">
          <span>&copy; 2026 <span className="text-white/85 font-semibold">Albin Thomas</span>. All Rights Reserved</span>
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
