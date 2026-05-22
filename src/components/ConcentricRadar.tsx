export default function ConcentricRadar() {
  return (
    <div className="relative w-full h-[250px] flex items-center justify-center mb-8 overflow-hidden">
      <svg width="300" height="300" viewBox="0 0 300 300" className="opacity-80">
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4b1f" stopOpacity="0.5" />
            <stop offset="20%" stopColor="#ff4b1f" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Center Glow */}
        <circle cx="150" cy="150" r="100" fill="url(#radarGlow)" />
        <circle cx="150" cy="150" r="6" fill="#ff4b1f" filter="url(#glow)" />
        
        {/* Inner Rings */}
        <circle cx="150" cy="150" r="20" fill="none" stroke="rgba(255, 75, 31, 0.5)" strokeWidth="1" />
        <circle cx="150" cy="150" r="40" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="150" cy="150" r="60" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
        
        {/* Outer Rings */}
        <circle cx="150" cy="150" r="90" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="2 6" />
        
        {/* Crosshairs */}
        <line x1="150" y1="30" x2="150" y2="130" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        <line x1="150" y1="170" x2="150" y2="270" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        <line x1="30" y1="150" x2="130" y2="150" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        <line x1="170" y1="150" x2="270" y2="150" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        
        {/* Orbiting Planets/Dots */}
        <circle cx="150" cy="60" r="3" fill="#ff4b1f" filter="url(#glow)" />
        <circle cx="210" cy="150" r="2" fill="#fff" opacity="0.5" />
        <circle cx="110" cy="220" r="4" fill="#ff4b1f" filter="url(#glow)" opacity="0.8" />
        <circle cx="50" cy="100" r="2" fill="#fff" opacity="0.3" />
      </svg>
    </div>
  )
}
