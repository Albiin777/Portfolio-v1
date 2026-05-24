
export default function TechSeparator() {
  return (
    <div className="relative w-full flex justify-center py-3 md:py-4 select-none pointer-events-none z-10">
      <svg
        width="100%"
        height="60"
        viewBox="0 0 800 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-[800px] w-full"
      >
        <defs>
          {/* Intense fire/orange glow filter */}
          <filter id="separatorGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Central glowing gradient */}
          <linearGradient id="centerLineGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFB000" stopOpacity="0" />
            <stop offset="25%" stopColor="#FFB000" stopOpacity="0.25" />
            <stop offset="45%" stopColor="#ff8500" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ffaa1f" stopOpacity="1" />
            <stop offset="55%" stopColor="#ff8500" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#FFB000" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFB000" stopOpacity="0" />
          </linearGradient>

          {/* Circuit line gradients */}
          <linearGradient id="circuitLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFB000" stopOpacity="0.03" />
            <stop offset="30%" stopColor="#FFB000" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#ffaa1f" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#FFB000" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFB000" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* 1. Main Central glowing segment */}
        <line
          x1="200"
          y1="30"
          x2="600"
          y2="30"
          stroke="url(#centerLineGlow)"
          strokeWidth="1"
        />
        {/* The super-bright core glowing bar in the center */}
        <line
          x1="365"
          y1="30"
          x2="435"
          y2="30"
          stroke="#ff8500"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#separatorGlow)"
          className="animate-pulse"
          style={{ animationDuration: '3s' }}
        />
        


        {/* 3. Bottom Circuit line (low plateau in center) */}
        <path
          d="M 60 40 L 325 40 L 335 46 L 465 46 L 475 40 L 740 40"
          stroke="url(#circuitLineGrad)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        {/* Glow dots at the endpoints of the bottom line */}
        <circle cx="60" cy="40" r="2" fill="#FFB000" opacity="0.8" />
        <circle cx="740" cy="40" r="2" fill="#FFB000" opacity="0.8" />
        
        {/* Small decorative dots along bottom step */}
        <circle cx="325" cy="40" r="1.5" fill="#FFB000" opacity="0.6" />
        <circle cx="475" cy="40" r="1.5" fill="#FFB000" opacity="0.6" />
        
        {/* 4. Extra decorative details: small dashed components */}
        {/* Left disconnected line */}
        <line x1="100" y1="30" x2="160" y2="30" stroke="rgba(255, 176, 0, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
        {/* Right disconnected line */}
        <line x1="640" y1="30" x2="700" y2="30" stroke="rgba(255, 176, 0, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
        
        {/* Faint dot groupings (cyberpunk accent) */}
        <circle cx="270" cy="30" r="1" fill="rgba(255, 176, 0, 0.3)" />
        <circle cx="280" cy="30" r="1" fill="rgba(255, 176, 0, 0.3)" />
        <circle cx="520" cy="30" r="1" fill="rgba(255, 176, 0, 0.3)" />
        <circle cx="530" cy="30" r="1" fill="rgba(255, 176, 0, 0.3)" />

        {/* Accent lines representing micro circuitry */}
        <path d="M 180 40 L 200 40 L 205 43" stroke="rgba(255, 176, 0, 0.2)" strokeWidth="0.8" fill="none" />
        <path d="M 620 40 L 600 40 L 595 43" stroke="rgba(255, 176, 0, 0.2)" strokeWidth="0.8" fill="none" />
      </svg>
    </div>
  )
}
