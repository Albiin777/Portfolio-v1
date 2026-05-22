import { Link } from 'react-router-dom'

export default function Contact() {
  return (
    <div className="min-h-screen bg-bg-dark text-white font-sans flex flex-col items-center justify-center gap-7">
      <div className="font-mono text-xs tracking-[0.2em] text-white/40">06 // CONTACT</div>
      <h1 className="text-6xl font-bold">Get In Touch</h1>
      <p className="max-w-md text-center text-white/50 leading-relaxed font-mono text-sm">
        Have a project in mind or just want to say hi? My inbox is always open.
      </p>
      <a
        href="mailto:albinthomas@example.com"
        className="px-9 py-4 bg-accent text-white rounded font-mono text-sm tracking-widest hover:opacity-90 transition-opacity no-underline"
      >
        SAY HELLO →
      </a>
      <Link to="/" className="text-accent font-mono text-xs tracking-[0.15em] no-underline hover:underline mt-2">
        ← BACK HOME
      </Link>
    </div>
  )
}
