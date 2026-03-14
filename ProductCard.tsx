'use client';
import { useRef, useState, useCallback } from 'react';
import type { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  disabled?: boolean;
}

export default function ProductCard({ product, onAddToCart, disabled }: ProductCardProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const btnPos = useRef({ x: 0, y: 0 });
  const [isPanicking, setIsPanicking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fleeCount, setFleeCount] = useState(0);

  const fleeFromCursor = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const btnCx = rect.left + rect.width / 2;
    const btnCy = rect.top + rect.height / 2;
    const dx = e.clientX - btnCx;
    const dy = e.clientY - btnCy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 180) return;

    setIsPanicking(true);

    // Flee direction
    const angle = Math.atan2(dy, dx);
    const flee = Math.min(300 / dist * 40, 120);
    const nx = btnPos.current.x - Math.cos(angle) * flee;
    const ny = btnPos.current.y - Math.sin(angle) * flee;

    // Clamp to card bounds (rough)
    const clamped = {
      x: Math.max(-60, Math.min(60, nx)),
      y: Math.max(-30, Math.min(30, ny)),
    };

    btnPos.current = clamped;
    btn.style.transform = `translate(${clamped.x}px, ${clamped.y}px) rotate(${clamped.x * 0.3}deg)`;
    setFleeCount(c => c + 1);

    setTimeout(() => setIsPanicking(false), 500);
  }, []);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('productId', product.id);
    e.dataTransfer.setData('productName', product.name);
    setIsDragging(true);
  };
  const handleDragEnd = () => setIsDragging(false);

  return (
    <div
      className={`relative bg-[#050f05] border transition-all duration-200 overflow-visible group
        ${isDragging ? 'border-[#00ff41] scale-95 opacity-70' : 'border-[#00ff41]/20 hover:border-[#00ff41]/60'}
      `}
      style={{ boxShadow: isDragging ? '0 0 30px rgba(0,255,65,0.4)' : '0 0 10px rgba(0,255,65,0.05)' }}
      onMouseMove={fleeFromCursor}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Biohazard corner */}
      <div className="absolute top-1 right-1 text-[10px] opacity-30">☣</div>

      {/* Drag hint */}
      <div className="absolute top-1 left-1 text-[9px] text-[#00ff41]/30 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
        ⟡ DRAG TO CART
      </div>

      {/* Product emoji */}
      <div className="text-center pt-6 pb-2">
        <span className="text-6xl filter drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,65,0.3))' }}>
          {product.emoji}
        </span>
      </div>

      {/* Product info */}
      <div className="px-3 pb-3">
        <h3 className="text-[#00ff41] font-display text-xl tracking-widest text-center mb-1">
          {product.name}
        </h3>
        <p className="text-[#a0ffb0]/50 text-xs text-center mb-2 leading-relaxed font-mono">
          {product.description}
        </p>
        <p className="text-red-500/70 text-[10px] text-center mb-3 font-mono">{product.warning}</p>

        {/* Price */}
        <div className="text-center mb-4">
          <span className="text-[#aaff00] font-display text-2xl">{product.price}</span>
          <span className="text-[#00ff41]/50 text-xs ml-1 font-mono">{product.unit}</span>
        </div>

        {/* Fleeing button wrapper */}
        <div className="relative h-10 flex items-center justify-center overflow-visible">
          <button
            ref={btnRef}
            onClick={() => !disabled && onAddToCart(product)}
            className={`absolute border px-4 py-1.5 text-xs font-mono tracking-widest transition-colors whitespace-nowrap
              ${isPanicking
                ? 'border-red-500 text-red-400 bg-red-900/10 animate-[panicShake_0.15s_infinite]'
                : 'border-[#00ff41]/60 text-[#00ff41] bg-transparent hover:bg-[#00ff41]/10'
              }`}
            style={{ transition: 'transform 0.05s ease-out, color 0.1s, border-color 0.1s' }}
          >
            {isPanicking ? '😱 NO NO NO' : fleeCount > 5 ? '😰 PLEASE STOP' : '+ ADD TO CART'}
          </button>
        </div>

        {fleeCount > 3 && (
          <p className="text-[#00ff41]/20 text-[9px] text-center mt-8 font-mono">
            (or just drag it to the cart...)
          </p>
        )}
      </div>
    </div>
  );
}
