import { Link } from 'react-router-dom'

const skills = ['React', 'Vite', 'TypeScript', 'Python', 'TensorFlow', 'Node.js', 'PostgreSQL', 'Docker', 'Tailwind CSS']

export default function Skills() {
  return (
    <div className="min-h-screen bg-bg-dark text-white font-sans flex flex-col items-center justify-center gap-8">
      <div className="font-mono text-xs tracking-[0.2em] text-white/40">03 / SKILLS</div>
      <h1 className="text-6xl font-bold">Skills</h1>
      <div className="flex flex-wrap gap-3 justify-center max-w-lg">
        {skills.map(s => (
          <span key={s} className="px-5 py-2 border border-accent/40 rounded-full text-sm font-mono text-accent bg-accent/5">
            {s}
          </span>
        ))}
      </div>
      <Link to="/" className="text-accent font-mono text-xs tracking-[0.15em] no-underline hover:underline">
        ← BACK HOME
      </Link>
    </div>
  )
}
