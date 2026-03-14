'use client';
import { useEffect, useRef, useState } from 'react';

interface MovingCartProps {
  itemCount: number;
  totalSins: number;
  onDrop: (e: React.DragEvent) => void;
  onCartClick: () => void;
}

export default function MovingCart({ itemCount, totalSins, onDrop, onCartClick }: MovingCartProps) {
  const cartRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 200, y: 200 });
  const velRef = useRef({ vx: 1.2, vy: 0.8 });
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [wheelSpeed, setWheelSpeed] = useState('slow');

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  useEffect(() => {
    const CART_W = 100;
    const CART_H = 90;

    const animate = () => {
      const cart = cartRef.current;
      if (!cart) { animRef.current = requestAnimationFrame(animate); return; }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const { x, y } = posRef.current;
      let { vx, vy } = velRef.current;

      // Distance from mouse to cart center
      const cx = x + CART_W / 2;
      const cy = y + CART_H / 2;
      const dx = mouseRef.current.x - cx;
      const dy = mouseRef.current.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Speed multiplier based on distance
      let speed = 1.2;
      if (dist < 300) speed = 2.5;
      if (dist < 150) speed = 5;
      if (dist < 80) speed = 9;

      setWheelSpeed(speed > 4 ? 'fast' : 'slow');
      setIsZooming(speed > 4);

      // Flee from mouse when close
      if (dist < 200) {
        const fleeX = -dx / dist;
        const fleeY = -dy / dist;
        vx += fleeX * 0.5;
        vy += fleeY * 0.5;
      }

      // Clamp velocity
      const maxSpeed = speed;
      const mag = Math.sqrt(vx * vx + vy * vy);
      if (mag > maxSpeed) { vx = (vx / mag) * maxSpeed; vy = (vy / mag) * maxSpeed; }
      if (mag < 0.5) { vx += (Math.random() - 0.5) * 0.3; vy += (Math.random() - 0.5) * 0.3; }

      // Move
      let nx = x + vx;
      let ny = y + vy;

      // Bounce off walls
      if (nx <= 0 || nx >= vw - CART_W) { vx = -vx; nx = Math.max(0, Math.min(vw - CART_W, nx)); }
      if (ny <= 60 || ny >= vh - CART_H) { vy = -vy; ny = Math.max(60, Math.min(vh - CART_H, ny)); }

      posRef.current = { x: nx, y: ny };
      velRef.current = { vx, vy };

      cart.style.left = `${nx}px`;
      cart.style.top = `${ny}px`;

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current!);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    setIsDragOver(false);
    onDrop(e);
  };

  return (
    <div
      ref={cartRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onCartClick}
      className="fixed z-[500] cursor-pointer select-none"
      style={{ left: 200, top: 200, width: 100 }}
    >
      {/* Cart body */}
      <div
        className={`relative transition-all duration-100 ${isDragOver ? 'scale-125' : isZooming ? 'scale-110' : 'scale-100'}`}
        style={{
          filter: isDragOver
            ? 'drop-shadow(0 0 20px #00ff41)'
            : isZooming
            ? 'drop-shadow(0 0 12px #ff4400)'
            : 'drop-shadow(0 0 8px #00ff41aa)',
        }}
      >
        {/* Cart emoji + count badge */}
        <div className="relative text-center">
          <span className="text-5xl">{isDragOver ? '🫳' : '🛒'}</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#00ff41] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>

        {/* SINS display */}
        {itemCount > 0 && (
          <div className="text-center text-[10px] text-[#00ff41] font-mono leading-tight">
            {totalSins} SINS
          </div>
        )}

        {/* Axle */}
        <div className="flex justify-around px-2 mt-1">
          {/* Wheel Left */}
          <div
            className={`w-5 h-5 rounded-full border-2 border-[#00ff41] bg-[#001a00] flex items-center justify-center text-[8px] ${wheelSpeed === 'fast' ? 'animate-[wheelSpin_0.15s_linear_infinite]' : 'animate-[wheelSpin_0.8s_linear_infinite]'}`}
            style={{ animation: `wheelSpin ${wheelSpeed === 'fast' ? '0.1s' : '0.7s'} linear infinite` }}
          >
            ◉
          </div>
          {/* Wheel Right */}
          <div
            className={`w-5 h-5 rounded-full border-2 border-[#00ff41] bg-[#001a00] flex items-center justify-center text-[8px]`}
            style={{ animation: `wheelSpin ${wheelSpeed === 'fast' ? '0.1s' : '0.7s'} linear infinite` }}
          >
            ◉
          </div>
        </div>

        {/* Drop hint */}
        {isDragOver && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[#00ff41] text-[10px] font-mono">
            DROP IT!
          </div>
        )}

        {/* Panic label when speeding */}
        {isZooming && !isDragOver && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-red-400 text-[9px] font-mono animate-pulse">
            STAY BACK!
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
