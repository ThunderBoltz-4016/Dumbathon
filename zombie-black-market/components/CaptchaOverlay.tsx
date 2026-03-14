'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { CAPTCHA_POOL, type CaptchaChallenge } from '@/data/products';

interface CaptchaOverlayProps {
  onPass: () => void;
}

export default function CaptchaOverlay({ onPass }: CaptchaOverlayProps) {
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(15);
  const [clickCount, setClickCount] = useState(0);
  const [invisPos, setInvisPos] = useState({ x: 70, y: 50 });
  const [attempt, setAttempt] = useState(0);
  const [shaking, setShaking] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const movedRef = useRef(false);

  const pickChallenge = useCallback(() => {
    const pick = CAPTCHA_POOL[Math.floor(Math.random() * CAPTCHA_POOL.length)];
    setChallenge(pick);
    setSelected([]);
    setError('');
    setCountdown(15);
    setClickCount(0);
    movedRef.current = false;
    // randomize invisible button position
    setInvisPos({ x: Math.random() * 70 + 10, y: Math.random() * 60 + 20 });
  }, []);

  useEffect(() => { pickChallenge(); }, [pickChallenge]);

  // Countdown timer for no-mouse challenge
  useEffect(() => {
    if (challenge?.type !== 'countdown') return;
    timerRef.current = setInterval(() => {
      if (movedRef.current) {
        setCountdown(15);
        movedRef.current = false;
        setError('YOU MOVED. Timer reset. Stay still, survivor.');
      } else {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            onPass();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [challenge, onPass]);

  const handleMouseMove = () => {
    if (challenge?.type === 'countdown') movedRef.current = true;
  };

  const triggerShake = (msg: string) => {
    setError(msg);
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
    setAttempt(a => a + 1);
    setTimeout(pickChallenge, 2000);
  };

  const handleGridClick = (idx: number) => {
    setSelected(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleVerify = () => {
    if (!challenge) return;

    if (challenge.type === 'grid-select' || challenge.type === 'blank-grid') {
      const correct = (challenge.data?.correctIndices as number[]) || [];
      const isCorrect =
        correct.length === selected.length &&
        correct.every(i => selected.includes(i));
      if (isCorrect) { onPass(); return; }
      triggerShake(challenge.data?.note as string || '☠️ WRONG. Try again, meat bag.');
      return;
    }

    if (challenge.type === 'only-wrong') {
      triggerShake('❌ Incorrect. The Market has rejected your answer.');
      return;
    }

    if (challenge.type === 'click-count') {
      if (clickCount === (challenge.data?.target as number)) { onPass(); return; }
      triggerShake(`You clicked ${clickCount} times. WRONG. Starting over.`);
      setClickCount(0);
      return;
    }

    onPass();
  };

  const handleOptionClick = (opt: string) => {
    if (!challenge) return;
    if (challenge.id === 'trolley-problem' && opt === 'Add all 6 to cart') { onPass(); return; }
    if (challenge.id === 'not-robot') {
      triggerShake('☠️ Only robots are allowed here. Rejected.');
      return;
    }
    triggerShake(`"${opt}" — Wrong answer. The Market laughs at you.`);
  };

  const handleCountClick = () => {
    const target = challenge?.data?.target as number || 50;
    const next = clickCount + 1;
    if (next > target) {
      setClickCount(0);
      setError(`${next} clicks! TOO MANY. Back to 0. Start again.`);
    } else {
      setClickCount(next);
      if (next === target) { onPass(); }
    }
  };

  if (!challenge) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
      onMouseMove={handleMouseMove}
    >
      {/* Biohazard BG */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 text-[30rem] pointer-events-none select-none">☣️</div>

      <div className={`relative w-full max-w-lg mx-4 bg-[#050f05] border-2 border-[#00ff41] rounded-none p-6 ${shaking ? 'animate-shake' : ''}`}
        style={{ boxShadow: '0 0 40px rgba(0,255,65,0.3), inset 0 0 40px rgba(0,0,0,0.8)' }}>

        {/* Header */}
        <div className="border-b border-[#00ff41]/30 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-pulse">☣️</span>
            <div>
              <p className="text-[#00ff41] text-xs tracking-[0.3em] opacity-70">ZOMBIE BLACK MARKET SECURITY</p>
              <h2 className="text-[#00ff41] font-display text-2xl tracking-widest">PROVE YOU'RE ALIVE</h2>
            </div>
          </div>
          <p className="text-[#00ff41]/50 text-xs mt-1">Attempt #{attempt + 1} • Failure is not an option (but it is very common)</p>
        </div>

        {/* Instruction */}
        <div className="bg-[#001a00] border border-[#00ff41]/20 p-3 mb-4 rounded">
          <p className="text-[#aaff00] text-sm leading-relaxed">{challenge.instruction}</p>
          {challenge.data?.note && (
            <p className="text-[#00ff41]/40 text-xs mt-1 italic">{challenge.data.note as string}</p>
          )}
        </div>

        {/* Challenge content */}
        <div className="mb-4 min-h-[200px] flex items-center justify-center">

          {/* GRID SELECT / BLANK GRID */}
          {(challenge.type === 'grid-select' || challenge.type === 'blank-grid') && (
            <div className="grid grid-cols-3 gap-1 w-full">
              {Array.from({ length: 9 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleGridClick(i)}
                  className={`aspect-square border text-3xl flex items-center justify-center transition-all
                    ${selected.includes(i)
                      ? 'border-[#00ff41] bg-[#00ff41]/15'
                      : 'border-[#00ff41]/20 bg-[#001a00] hover:border-[#00ff41]/50'
                    }`}
                >
                  {challenge.type === 'blank-grid' ? '' :
                    (challenge.data?.images as string[])?.[i] || ''}
                </button>
              ))}
            </div>
          )}

          {/* ONLY WRONG OPTIONS */}
          {challenge.type === 'only-wrong' && (
            <div className="flex flex-col gap-3 w-full">
              {(challenge.data?.options as string[])?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  className="w-full border border-[#00ff41]/30 bg-[#001a00] hover:bg-[#00ff41]/10 text-[#a0ffb0] text-sm p-3 text-left transition-all hover:border-[#00ff41]"
                >
                  ▸ {opt}
                </button>
              ))}
            </div>
          )}

          {/* INVISIBLE BUTTON */}
          {challenge.type === 'invisible-button' && (
            <div className="relative w-full h-48">
              <p className="text-[#00ff41]/40 text-xs text-center mb-2">The VERIFY button is here. Somewhere.</p>
              <div className="absolute inset-0">
                <button
                  onClick={onPass}
                  className="absolute opacity-0 w-16 h-8 cursor-default"
                  style={{ left: `${invisPos.x}%`, top: `${invisPos.y}%` }}
                  aria-label="verify"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-[#001a00] text-sm select-none">
                {/* Ghost hint */}
                <span className="opacity-[0.03]" style={{ position: 'absolute', left: `${invisPos.x}%`, top: `${invisPos.y}%` }}>VERIFY</span>
              </div>
            </div>
          )}

          {/* COUNTDOWN */}
          {challenge.type === 'countdown' && (
            <div className="text-center">
              <div className={`text-8xl font-display text-[#00ff41] bio-glow-text ${countdown <= 5 ? 'animate-pulse' : ''}`}>
                {countdown}
              </div>
              <p className="text-[#00ff41]/60 text-xs mt-2">seconds remaining • DO NOT MOVE</p>
              <div className="mt-4 text-xs text-[#00ff41]/30">
                {countdown > 10 ? '🟢 Stay still...' : countdown > 5 ? '🟡 Almost there...' : '🔴 DON\'T YOU DARE MOVE'}
              </div>
            </div>
          )}

          {/* CLICK COUNT */}
          {challenge.type === 'click-count' && (
            <div className="text-center">
              <div className="text-6xl font-display text-[#00ff41] mb-4">{clickCount} / {challenge.data?.target as number}</div>
              <button
                onClick={handleCountClick}
                className="border-2 border-[#00ff41] text-[#00ff41] px-8 py-4 text-lg font-display tracking-widest hover:bg-[#00ff41]/10 active:scale-95 transition-all"
              >
                CLICK ME
              </button>
              {clickCount > 0 && (
                <p className="text-[#00ff41]/40 text-xs mt-2">
                  {(challenge.data?.target as number) - clickCount} more to go...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-[#1a0000] border border-red-800 p-2 mb-3 text-red-400 text-xs animate-pulse">
            {error}
          </div>
        )}

        {/* Verify button — not shown for some types */}
        {challenge.type !== 'countdown' && challenge.type !== 'invisible-button' && challenge.type !== 'only-wrong' && (
          <button
            onClick={handleVerify}
            className="w-full border-2 border-[#00ff41] bg-transparent text-[#00ff41] font-display text-xl tracking-[0.3em] py-3 hover:bg-[#00ff41]/10 transition-all active:scale-[0.98]"
            style={{ boxShadow: '0 0 15px rgba(0,255,65,0.2)' }}
          >
            ☣️ VERIFY HUMANITY ☣️
          </button>
        )}

        <p className="text-[#00ff41]/20 text-xs text-center mt-3">
          Having trouble? Good. That means the system is working.
        </p>
      </div>
    </div>
  );
}
