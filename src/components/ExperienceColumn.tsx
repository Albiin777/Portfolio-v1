import { motion } from 'framer-motion'

const EXPERIENCE_DATA = [
  {
    org: 'µLearn CHN',
    branchName: 'cec/mulearn-chn',
    active: true,
    roles: [
      { role: 'Content Lead', duration: 'Jan 2026 - Present', tags: ['Content Strategy', 'Leadership'], active: true },
      { role: 'Creative Content Writer', duration: 'Dec 2024 - Dec 2025', tags: ['Content Writing', 'Social Media'], active: false }
    ]
  },
  {
    org: 'PRODDEC CEC',
    branchName: 'cec/proddec-cec',
    active: true,
    roles: [
      { role: 'Treasurer', duration: 'Mar 2026 - Present', tags: ['Finance', 'Leadership'], active: true },
      { role: 'Secretary', duration: 'May 2025 - Feb 2026', tags: ['Operations', 'Documentation'], active: false }
    ]
  },
  {
    org: 'CODSOFT',
    branchName: 'org/codsoft',
    active: false,
    roles: [
      { role: 'Python Programming Intern', duration: 'Jun 2024 - Jul 2024', tags: ['Python', 'Problem Solving'], active: false }
    ]
  },
  {
    org: 'Cognifyz Technologies',
    branchName: 'org/cognifyz',
    active: false,
    roles: [
      { role: 'Python Development Intern', duration: 'Jun 2024 - Jul 2024', tags: ['Python'], active: false }
    ]
  }
]

export default function ExperienceColumn() {
  return (
    <div className="relative">
      {/* Main vertical trunk */}
      <div className="absolute left-[9px] top-0 bottom-6 w-[2px] bg-gradient-to-b from-accent via-accent/40 to-white/10" />

      <div className="flex flex-col gap-8">
        {EXPERIENCE_DATA.map((org, orgIndex) => (
          <motion.div
            key={orgIndex}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: orgIndex * 0.15 }}
            className="relative"
          >
            {/* Org commit node on trunk */}
            <div className="absolute left-0 top-[10px] z-10">
              <div className={`w-5 h-5 rounded-full border-2 bg-[#111111] flex items-center justify-center
                ${org.active ? 'border-accent shadow-[0_0_12px_rgba(255, 176, 0,0.7)]' : 'border-white/30'}`}>
                {org.active && <div className="w-2 h-2 rounded-full bg-accent" />}
              </div>
            </div>

            {/* Curved SVG connector from trunk node to org label */}
            <div className="absolute left-4 top-[8px] pointer-events-none">
              <svg width="36" height="24" viewBox="0 0 36 24" fill="none">
                <path
                  d={`M0,10 C8,10 12,14 20,14 L36,14`}
                  stroke={org.active ? 'rgba(255, 176, 0,0.55)' : 'rgba(255,255,255,0.18)'}
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Org block */}
            <div className="ml-11">
              {/* Org header row */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono border rounded-full
                  ${org.active ? 'border-accent/40 text-accent bg-accent/5' : 'border-white/10 text-white/40 bg-white/5'}`}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="6" y1="3" x2="6" y2="15" />
                    <circle cx="18" cy="6" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <path d="M18 9a9 9 0 0 1-9 9" />
                  </svg>
                  {org.branchName}
                </span>
                <span className="text-white/70 text-sm font-semibold">{org.org}</span>
              </div>

              {/* Roles as subfolder entries */}
              <div className="relative border border-white/5 rounded-xl bg-black/20 overflow-hidden">
                {/* Folder tree line */}
                <div className="absolute left-5 top-0 bottom-0 w-[1px] bg-white/8" />

                {org.roles.map((item, roleIndex) => (
                  <motion.div
                    key={roleIndex}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: orgIndex * 0.15 + roleIndex * 0.1 }}
                    className={`flex items-start gap-3 px-5 py-5 group hover:bg-white/5 transition-colors
                      ${roleIndex < org.roles.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                    {/* Straight branch line + commit dot */}
                    <div className="flex items-center shrink-0 mt-1">
                      <div className={`w-5 h-[1.5px] ${item.active ? 'bg-accent/50' : 'bg-white/15'}`} />
                      <div className={`w-2.5 h-2.5 rounded-full border shrink-0 bg-[#111111]
                        ${item.active ? 'border-accent shadow-[0_0_6px_rgba(255, 176, 0,0.6)]' : 'border-white/25'}`}>
                        {item.active && <div className="w-full h-full rounded-full scale-[0.45] bg-accent" />}
                      </div>
                    </div>

                    {/* Role info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <span className={`text-sm font-semibold ${item.active ? 'text-white' : 'text-white/70'} group-hover:text-white transition-colors`}>
                          {item.role}
                        </span>
                        <span className={`font-mono text-[11px] tracking-wide whitespace-nowrap ${item.active ? 'text-accent' : 'text-white/35'}`}>
                          {item.duration}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 text-[10px] font-mono text-white/45 border border-white/8 rounded bg-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {/* HEAD node at bottom of trunk */}
        <div className="relative flex items-center h-8">
          <div className="absolute left-[5px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-[#111111] border-2 border-white/20 z-10" />
          <div className="absolute left-[15px] top-1/2 -translate-y-1/2 w-8 h-[1.5px] bg-white/15" />
          <div className="ml-11">
            <span className="px-2.5 py-0.5 text-[10px] font-mono border border-white/10 text-white/25 bg-[#111111] rounded-full">B.Tech</span>
          </div>
        </div>
      </div>
    </div>
  )
}
