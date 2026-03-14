'use client';
import { useState, useEffect } from 'react';
import { POPUP_MESSAGES } from '@/data/products';

interface PopupProps {
  onConfirm: () => void;
  onDeny: (msg: string) => void;
  itemName?: string;
}

export default function PopupInterrupt({ onConfirm, onDeny, itemName }: PopupProps) {
  const [popup] = useState(() => POPUP_MESSAGES[Math.floor(Math.random() * POPUP_MESSAGES.length)]);
  const [answer, setAnswer] = useState('');
  const [shaking, setShaking] = useState(false);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    // Random glitch effect
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (answer.toUpperCase().trim() === popup.answer.toUpperCase()) {
      onConfirm();
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      onDeny(popup.wrong);
    }
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div
        className={`w-full max-w-md mx-4 bg-[#050505] border border-red-900 p-0 overflow-hidden transition-all ${shaking ? 'animate-shake' : ''} ${glitching ? 'animate-glitch' : ''}`}
        style={{ boxShadow: '0 0 50px rgba(139,0,0,0.5), 0 0 100px rgba(139,0,0,0.2)' }}
      >
        {/* Title bar */}
        <div className="bg-red-900/80 px-4 py-2 flex items-center justify-between border-b border-red-800">
          <div className="flex items-center gap-2">
            <span className="animate-pulse">🔴</span>
            <span className="text-red-300 text-xs tracking-[0.2em] font-mono">{popup.title}</span>
          </div>
          <div className="flex gap-1">
            {['▪','▪','▪'].map((d,i) => (
              <div key={i} className="w-3 h-3 bg-red-800 border border-red-700" />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {itemName && (
            <p className="text-[#00ff41]/50 text-xs mb-3 font-mono">
              ▸ Intercepted action: ADD TO CART — <span className="text-[#00ff41]">{itemName}</span>
            </p>
          )}

          <p className="text-[#c8ffc8] text-sm leading-relaxed mb-5 font-mono">
            {popup.body}
          </p>

          <div className="bg-[#0a0a0a] border border-red-900/50 p-3 mb-4">
            <p className="text-red-400 text-xs mb-2 tracking-widest">⚠ SECURITY QUESTION:</p>
            <p className="text-[#ffcc00] text-sm font-mono">{popup.question}</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Your answer..."
              className="flex-1 bg-[#0a0a0a] border border-[#00ff41]/30 text-[#00ff41] px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#00ff41] placeholder-[#00ff41]/20"
              autoFocus
            />
            <button
              onClick={handleSubmit}
              className="border border-[#00ff41] text-[#00ff41] px-4 py-2 text-xs font-mono tracking-widest hover:bg-[#00ff41]/10 transition-all active:scale-95"
            >
              SUBMIT
            </button>
          </div>

          <p className="text-red-900 text-xs mt-3 text-center font-mono">
            Wrong answer = item removed from your cart. Choose wisely.
          </p>
        </div>
      </div>
    </div>
  );
}
