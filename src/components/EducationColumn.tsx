import { useRef } from 'react'
import { motion, useAnimation, useScroll, useSpring } from 'framer-motion'

const EDUCATION_DATA = [
  {
    year: 'Sep 2023 - Present',
    title: 'B.Tech Computer Science and Engineering',
    institution: 'College of Engineering Chengannur',
    score: 'CGPA: 8.41 / 10.0',
    badge: 'Current'
  },
  {
    year: 'Jun 2021 - Mar 2023',
    title: 'Higher Secondary Education',
    institution: 'Mar Dionysius Sr. Secondary School',
    score: 'Percentage: 91.8%',
    badge: null
  },
  {
    year: 'Jun 2011 - May 2021',
    title: 'Secondary Education',
    institution: 'Archbishop Mar Gregorios Public School',
    score: 'Percentage: 95.2%',
    badge: null
  }
]

const educationItemVariants = {
  hidden: { opacity: 0, x: -28, filter: 'blur(6px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
}

const educationNodeVariants = {
  hidden: { scale: 0.65, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
}

type EducationItem = (typeof EDUCATION_DATA)[number]

function EducationTimelineItem({ item, index }: { item: EducationItem; index: number }) {
  const controls = useAnimation()

  return (
    <motion.div
      variants={educationItemVariants}
      initial="hidden"
      animate={controls}
      onViewportEnter={() => controls.start('visible')}
      onViewportLeave={(entry) => {
        if (entry && entry.boundingClientRect.top > 0) {
          controls.start('hidden')
        }
      }}
      viewport={{ once: false, amount: 0.1, margin: '0px 0px 15% 0px' }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-10"
    >
      {/* Timeline Node */}
      <motion.div
        variants={educationNodeVariants}
        initial="hidden"
        animate={controls}
        transition={{ delay: index * 0.08 + 0.05, duration: 0.35, ease: 'easeOut' }}
        className={`absolute left-0 top-5 w-4 h-4 rounded-full border-2 bg-[#111111] z-10 transition-shadow
        ${index === 0 ? 'border-accent shadow-[0_0_12px_rgba(255, 176, 0,0.8)]' : 'border-white/30'}`}
      >
        {index === 0 && (
          <div className="absolute inset-[3px] rounded-full bg-accent" />
        )}
      </motion.div>

      {/* Card */}
      <div className="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all hover:bg-black/60 group font-montserrat">
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className={`font-mono text-xs tracking-wider ${index === 0 ? 'text-accent' : 'text-white/35'}`}>{item.year}</div>
          {item.badge && (
            <span className="px-2 py-0.5 text-[10px] font-mono text-accent border border-accent/30 rounded bg-accent/5 shrink-0">
              {item.badge}
            </span>
          )}
        </div>
        <h3 className="text-base font-bold text-white/90 mb-1.5 group-hover:text-white transition-colors leading-snug">
          {item.title}
        </h3>
        <div className="text-white/50 text-sm mb-2">{item.institution}</div>
        <div className="font-mono text-xs text-white/35">{item.score}</div>
      </div>
    </motion.div>
  )
}

export default function EducationColumn() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 68%'],
  })
  const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  return (
    <div ref={timelineRef} className="relative">
      {/* Vertical Timeline Line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-white/10" />
      <div className="absolute left-[7px] top-2 bottom-2 w-[2px] overflow-hidden">
        <motion.div
          className="h-full w-full origin-top bg-gradient-to-b from-accent via-accent/50 to-transparent shadow-[0_0_10px_rgba(255,176,0,0.45)]"
          style={{ scaleY: lineScale }}
        />
      </div>

      <div className="flex flex-col gap-10">
        {EDUCATION_DATA.map((item, index) => (
          <EducationTimelineItem key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  )
}
