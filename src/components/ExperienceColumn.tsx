import { motion } from 'framer-motion'

const EXPERIENCE_DATA = [
  {
    branchName: 'main',
    role: 'Frontend Developer Intern',
    company: 'Prodigy Infotech',
    duration: 'Jun 2024 - Aug 2024',
    description: 'Built responsive web interfaces and collaborated with the team to deliver scalable solutions.',
    tags: ['React', 'Tailwind CSS', 'TypeScript'],
    active: true
  },
  {
    branchName: 'feature/web-app',
    role: 'Web Developer Intern',
    company: 'CodeAlpha',
    duration: 'Oct 2023 - Jan 2024',
    description: 'Developed and maintained web applications using modern technologies.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    active: false
  },
  {
    branchName: 'feature/python-tools',
    role: 'Python Developer Intern',
    company: 'CodeClause',
    duration: 'Aug 2023 - Sep 2023',
    description: 'Worked on Python projects, debugging, and building efficient solutions.',
    tags: ['Python', 'Django'],
    active: false
  }
]

export default function ExperienceColumn() {
  return (
    <div className="relative pl-8 md:pl-12 pt-8">
      
      {/* Main Vertical Trunk */}
      <div className="absolute left-[9px] top-[40px] bottom-10 w-[2px] bg-gradient-to-b from-accent via-white/10 to-white/10" />
      
      {/* Top Main Node */}
      <div className="absolute left-[5px] top-[40px] w-[10px] h-[10px] rounded-full bg-[#111113] border-2 border-accent shadow-[0_0_10px_rgba(255,75,31,0.8)] z-10" />

      <div className="flex flex-col gap-12 relative z-10">
        {EXPERIENCE_DATA.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative pl-12 md:pl-16"
          >
            {/* Branching SVG & Node */}
            <div className="absolute left-[-23px] top-[-30px] bottom-0 w-[40px] pointer-events-none">
              {/* Branch curve */}
              <svg width="40" height="80" viewBox="0 0 40 80" fill="none" className="absolute top-0 left-0">
                <path 
                  d="M0,0 L0,20 Q0,35 15,35 L25,35 Q40,35 40,50 L40,80" 
                  stroke={item.active ? "#ff4b1f" : "rgba(255,255,255,0.15)"} 
                  strokeWidth="2" 
                  fill="none" 
                />
              </svg>
              {/* Node dot on the branch */}
              <div 
                className={`absolute left-[35px] top-[75px] w-[10px] h-[10px] rounded-full bg-[#111113] border-2 z-10 
                ${item.active ? 'border-accent shadow-[0_0_10px_rgba(255,75,31,0.8)]' : 'border-white/40'}`} 
              />
            </div>

            {/* Branch Pill Label */}
            <div className="absolute -top-6 left-12 md:left-16">
              <span className={`px-3 py-1 text-[10px] font-mono border rounded-full
                ${item.active ? 'border-accent/30 text-accent bg-accent/5' : 'border-white/10 text-white/40 bg-white/5'}`}>
                {item.branchName}
              </span>
            </div>

            {/* Content Card (Transparent, no border wrapper like education, just text layout) */}
            <div className="pt-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                <h3 className="text-lg font-bold text-white/90">{item.role}</h3>
                <div className="font-mono text-accent text-xs tracking-wider whitespace-nowrap">{item.duration}</div>
              </div>
              
              <div className="text-white/60 text-sm mb-4">{item.company}</div>
              
              <p className="text-white/40 text-sm leading-relaxed mb-6 font-mono">
                {item.description}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {item.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 text-[11px] font-mono text-white/60 border border-white/10 rounded bg-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Connection dot back to main branch (for inner nodes) */}
            {index < EXPERIENCE_DATA.length - 1 && (
              <div className="absolute left-[-27px] bottom-[-24px] w-[10px] h-[10px] rounded-full bg-[#111113] border-2 border-white/30 z-10" />
            )}
            {index === EXPERIENCE_DATA.length - 1 && (
               <div className="absolute left-[-27px] bottom-[-40px] w-[10px] h-[10px] rounded-full bg-[#111113] border-2 border-white/30 z-10" />
            )}
          </motion.div>
        ))}
        
        {/* Final "development" pill at the bottom of trunk */}
        <div className="absolute left-[-20px] -bottom-[45px]">
           <span className="px-3 py-1 text-[10px] font-mono border border-white/10 text-white/40 bg-[#111113] rounded-full">
              development
           </span>
        </div>
      </div>
    </div>
  )
}
