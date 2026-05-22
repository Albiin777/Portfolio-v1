import { motion } from 'framer-motion'
import EducationColumn from '../components/EducationColumn'
import ExperienceColumn from '../components/ExperienceColumn'
import FireParticles from '../components/FireParticles'
import TechSeparator from '../components/TechSeparator'

export default function Journey() {
  return (
    <div id="journey" className="relative min-h-screen bg-bg-dark text-white font-sans pb-20 pt-12 md:pt-20 overflow-hidden">
      {/* Subtle fire particles background behind all layout elements */}
      <FireParticles />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col items-center mb-20 px-6">
        <div className="font-mono text-white/40 text-sm mb-4 tracking-widest">02</div>
        <div className="w-full max-w-5xl flex items-center justify-center gap-4 md:gap-8 mb-4">
          {/* Left Circuit Design */}
          <svg
            className="hidden md:block flex-1 h-[60px]"
            viewBox="0 0 300 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="leftCircuitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff4b1f" stopOpacity="0.05" />
                <stop offset="50%" stopColor="#ff4b1f" stopOpacity="0.4" />
                <stop offset="85%" stopColor="#ff8500" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffaa1f" stopOpacity="1" />
              </linearGradient>
              <filter id="glowLeft" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Main Path */}
            <path
              d="M 10,25 L 140,25 L 152,37 L 220,37 L 232,25 L 280,25"
              stroke="url(#leftCircuitGrad)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Glow nodes */}
            <circle cx="10" cy="25" r="2" fill="#ff4b1f" opacity="0.6" />
            <circle cx="220" cy="37" r="3" fill="#ff8500" filter="url(#glowLeft)" className="animate-pulse" style={{ animationDuration: '2s' }} />
            <circle cx="280" cy="25" r="4" fill="#ffaa1f" filter="url(#glowLeft)" />
            
            {/* Left secondary line */}
            <line x1="70" y1="31" x2="130" y2="31" stroke="#ff4b1f" strokeWidth="0.8" opacity="0.25" />
            <circle cx="70" cy="31" r="1.5" fill="#ff4b1f" opacity="0.3" />

            {/* Right secondary line */}
            <line x1="240" y1="31" x2="275" y2="31" stroke="#ff8500" strokeWidth="0.8" opacity="0.35" />
            <circle cx="275" cy="31" r="1.5" fill="#ffaa1f" opacity="0.4" />
          </svg>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight whitespace-nowrap">
            <span className="text-white">My </span>
            <span className="text-accent">Journey</span>
          </h1>

          {/* Right Circuit Design */}
          <svg
            className="hidden md:block flex-1 h-[60px]"
            viewBox="0 0 300 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="rightCircuitGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ff4b1f" stopOpacity="0.05" />
                <stop offset="50%" stopColor="#ff4b1f" stopOpacity="0.4" />
                <stop offset="85%" stopColor="#ff8500" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffaa1f" stopOpacity="1" />
              </linearGradient>
              <filter id="glowRight" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Main Path */}
            <path
              d="M 290,25 L 160,25 L 148,37 L 80,37 L 68,25 L 20,25"
              stroke="url(#rightCircuitGrad)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Glow nodes */}
            <circle cx="290" cy="25" r="2" fill="#ff4b1f" opacity="0.6" />
            <circle cx="80" cy="37" r="3" fill="#ff8500" filter="url(#glowRight)" className="animate-pulse" style={{ animationDuration: '2s' }} />
            <circle cx="20" cy="25" r="4" fill="#ffaa1f" filter="url(#glowRight)" />

            {/* Right secondary line */}
            <line x1="230" y1="31" x2="170" y2="31" stroke="#ff4b1f" strokeWidth="0.8" opacity="0.25" />
            <circle cx="230" cy="31" r="1.5" fill="#ff4b1f" opacity="0.3" />

            {/* Left secondary line */}
            <line x1="60" y1="31" x2="25" y2="31" stroke="#ff8500" strokeWidth="0.8" opacity="0.35" />
            <circle cx="25" cy="31" r="1.5" fill="#ffaa1f" opacity="0.4" />
          </svg>
        </div>

        <p className="text-white/40 text-sm md:text-base font-mono max-w-2xl text-center">
          From classrooms to real-world problem solving.
        </p>
      </div>

      {/* Main Grid Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">

          {/* EDUCATION COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-[#111113]/40 border border-white/5 rounded-2xl p-6 md:p-10 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                <h2 className="text-xl font-mono tracking-[0.2em] uppercase text-white/90">Education</h2>
              </div>
            </div>

            {/* Education Content */}
            <EducationColumn />
          </motion.div>

          {/* EXPERIENCE COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative bg-[#111113]/40 border border-white/5 rounded-2xl p-6 md:p-10 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <h2 className="text-xl font-mono tracking-[0.2em] uppercase text-white/90">Experience</h2>
              </div>
            </div>

            {/* Experience Content */}
            <ExperienceColumn />
          </motion.div>

        </div>

        {/* Separator to next section */}
        <TechSeparator />
      </div>
    </div>
  )
}
