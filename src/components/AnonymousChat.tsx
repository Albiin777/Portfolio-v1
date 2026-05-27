import { useState } from 'react'
import { motion } from 'framer-motion'
import { sendPortfolioMessage } from '../lib/messages'

export default function AnonymousChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSend = async () => {
    if (!message.trim()) return
    setStatus('sending')

    try {
      await sendPortfolioMessage({
        type: 'anonymous',
        message: message.trim()
      })

      setStatus('sent')
      setMessage('')
      setTimeout(() => {
        setIsOpen(false)
        setStatus('idle')
      }, 2000)
    } catch (error) {
      console.error('Failed to send anonymous message:', error)
      setStatus('error')
    }
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end pointer-events-none"
      initial={{ opacity: 0, y: 16, scale: 0.96, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ delay: 3.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Chat Window */}
      <div 
        className={`anonymous-chat-window mb-4 w-80 bg-[#111111] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.9),_inset_0_2px_4px_rgba(255,255,255,0.02)] overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <div className="bg-[#111111] px-5 py-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <div className="font-mono text-[10px] tracking-[0.25em] text-white uppercase">Secret Comms</div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 -m-2 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer"
            aria-label="Close anonymous message panel"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-5 flex flex-col gap-4">
          <p className="text-[12px] font-sans text-white/50 leading-relaxed">
            Send me an anonymous message. Your identity is completely hidden.
          </p>
          
          <textarea 
            className="w-full h-28 bg-[#050505] border border-white/10 text-white/80 text-[13px] font-sans p-3 focus:outline-none focus:border-accent/40 resize-none transition-colors shadow-inner placeholder:text-white/20"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={status !== 'idle'}
          />
          
          <button 
            className="w-full py-[12px] bg-white/5 backdrop-blur-[10px] border border-accent/30 text-accent font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-accent/10 hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            onClick={handleSend}
            disabled={!message.trim() || status !== 'idle'}
          >
            {status === 'idle' && 'TRANSMIT'}
            {status === 'sending' && 'TRANSMITTING...'}
            {status === 'sent' && 'DELIVERED'}
            {status === 'error' && 'TRY AGAIN'}
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        className="group relative w-14 h-14 bg-[#111111] border border-[#111111] rounded-full flex items-center justify-center hover:border-accent/40 transition-all duration-300 cursor-pointer pointer-events-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50 group-hover:text-accent transition-colors duration-300">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        
        {/* Unread indicator / glowing dot on button */}
        {!isOpen && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#111111] shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
        )}
      </button>
    </motion.div>
  )
}
