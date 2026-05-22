import { motion } from 'framer-motion'
import ConcentricRadar from './ConcentricRadar'

const EDUCATION_DATA = [
  {
    year: '2021 - 2025',
    title: 'B.E. Computer Science Engineering',
    institution: 'Anna University',
    score: 'CGPA: 8.31 / 10.0',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    ),
    badge: 'Current'
  },
  {
    year: '2020 - 2021',
    title: 'Higher Secondary Education',
    institution: "St. John's Matric Hr. Sec. School",
    score: 'Percentage: 90.5%',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    ),
    badge: null
  },
  {
    year: '2018 - 2019',
    title: 'Secondary Education',
    institution: "St. John's Matric Hr. Sec. School",
    score: 'Percentage: 94.4%',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    badge: null
  }
]

export default function EducationColumn() {
  return (
    <div className="relative">
      <ConcentricRadar />
      
      <div className="relative pl-12 md:pl-16">
        {/* Vertical Timeline Line */}
        <div className="absolute left-[27px] md:left-[35px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent via-accent/20 to-transparent shadow-[0_0_10px_rgba(255,75,31,0.5)]" />
        
        {/* Rocket Nodes and Cards */}
        <div className="flex flex-col gap-12 relative z-10">
          {EDUCATION_DATA.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Rocket SVG Node */}
              <div className="absolute -left-[45px] md:-left-[53px] top-1/2 -translate-y-1/2 flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="drop-shadow-[0_0_8px_rgba(255,75,31,0.8)]">
                  <path d="M18 4L22 10V22L26 26V28H10V26L14 22V10L18 4Z" fill="#1f1f22" stroke="#ff4b1f" strokeWidth="1.5" />
                  <path d="M14 28L18 32L22 28" stroke="#ff4b1f" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="18" cy="16" r="2" fill="#ff4b1f" />
                </svg>
              </div>

              {/* Card Content */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-mono text-accent text-xs tracking-wider">{item.year}</div>
                  <div className="flex items-center gap-3">
                    {item.badge && (
                      <span className="px-2 py-1 text-[10px] font-mono text-accent border border-accent/30 rounded bg-accent/5">
                        {item.badge}
                      </span>
                    )}
                    {item.icon}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white/90 mb-2 group-hover:text-white transition-colors">{item.title}</h3>
                <div className="text-white/60 text-sm mb-4">{item.institution}</div>
                <div className="font-mono text-xs text-white/40">{item.score}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
