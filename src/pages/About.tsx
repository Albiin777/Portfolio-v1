import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen bg-bg-dark text-white font-sans flex flex-col items-center justify-center gap-6">
      <div className="font-mono text-xs tracking-[0.2em] text-white/40">01 / ABOUT</div>
      <h1 className="text-6xl font-bold">About Me</h1>
      <p className="max-w-lg text-center text-white/50 leading-relaxed font-mono text-sm">
        Computer Science Engineering student and developer passionate about building intelligent, user-focused digital solutions that solve real-world problems. I enjoy turning ideas into meaningful products through code, creativity, and innovation, with interests in AI, web development, accessibility, and modern user experiences.
      </p>
      <Link to="/" className="text-accent font-mono text-xs tracking-[0.15em] no-underline hover:underline">
        ← BACK HOME
      </Link>
    </div>
  )
}
