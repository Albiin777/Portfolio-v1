import { motion } from 'framer-motion'
import EducationColumn from '../components/EducationColumn'
import ExperienceColumn from '../components/ExperienceColumn'

export default function Journey() {
  return (
    <div id="journey" className="min-h-screen bg-bg-dark text-white font-sans pb-20 pt-12 md:pt-20">
      
      {/* Header Section */}
      <div className="relative flex flex-col items-center mb-20 px-6">
        <div className="font-mono text-accent text-sm mb-4 tracking-widest">02</div>
        <div className="relative w-full flex justify-center items-center mb-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-white">My </span>
            <span className="text-accent">Journey</span>
          </h1>
          {/* Tech Borders (Left & Right) */}
          <div className="absolute top-1/2 left-[2%] md:left-[10%] w-[18%] md:w-[25%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-accent/50 -translate-y-1/2" />
          <div className="absolute top-1/2 right-[2%] md:right-[10%] w-[18%] md:w-[25%] h-[1px] bg-gradient-to-l from-transparent via-white/20 to-accent/50 -translate-y-1/2" />
        </div>
        
        <p className="text-white/40 text-sm md:text-base font-mono max-w-2xl text-center">
          Education that built the foundation. Experience that's building the future.
        </p>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
          
          {/* EDUCATION COLUMN */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-[#111113]/40 border border-white/5 rounded-2xl p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                <h2 className="text-xl font-mono tracking-[0.2em] uppercase text-white/90">Education</h2>
              </div>
              <div className="font-mono text-white/20 text-sm">03</div>
            </div>
            
            {/* Education Content goes here */}
            <EducationColumn />
          </motion.div>

          {/* EXPERIENCE COLUMN */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative bg-[#111113]/40 border border-white/5 rounded-2xl p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <h2 className="text-xl font-mono tracking-[0.2em] uppercase text-white/90">Experience</h2>
              </div>
              <div className="font-mono text-white/20 text-sm">04</div>
            </div>
            
            {/* Experience Content goes here */}
            <ExperienceColumn />
          </motion.div>

        </div>
      </div>
    </div>
  )
}
