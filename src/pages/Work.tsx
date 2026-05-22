import { Link } from 'react-router-dom'

const projects = [
  { title: 'AI Accident Detection App', desc: 'Real-time accident detection using computer vision and deep learning.' },
  { title: 'Web-based Trip Planner', desc: 'Intelligent travel planner with route optimization and recommendation engine.' },
]

export default function Work() {
  return (
    <div className="min-h-screen bg-bg-dark text-white font-sans flex flex-col items-center justify-center gap-8">
      <div className="font-mono text-xs tracking-[0.2em] text-white/40">02 / WORK</div>
      <h1 className="text-6xl font-bold">My Work</h1>
      <div className="flex flex-wrap gap-6 justify-center">
        {projects.map(p => (
          <div key={p.title} className="p-7 border border-white/10 rounded-xl max-w-xs bg-white/[0.03]">
            <h2 className="text-lg font-semibold mb-3">{p.title}</h2>
            <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
      <Link to="/" className="text-accent font-mono text-xs tracking-[0.15em] no-underline hover:underline">
        ← BACK HOME
      </Link>
    </div>
  )
}
