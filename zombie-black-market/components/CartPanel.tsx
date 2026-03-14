'use client';
import { type Product } from '@/data/products';

interface CartItem { product: Product; qty: number; }

interface CartPanelProps {
  items: CartItem[];
  onCheckout: () => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

export default function CartPanel({ items, onCheckout, onRemove, onClose }: CartPanelProps) {
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-[#050f05] border-l border-[#00ff41]/30 z-[800] flex flex-col"
      style={{ boxShadow: '-10px 0 40px rgba(0,255,65,0.1)' }}>

      {/* Header */}
      <div className="border-b border-[#00ff41]/20 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-[#00ff41] font-display text-2xl tracking-widest">YOUR SINS</h2>
          <p className="text-[#00ff41]/40 text-xs font-mono">{items.length} item(s) condemned</p>
        </div>
        <button onClick={onClose} className="text-[#00ff41]/50 hover:text-[#00ff41] text-xl transition-colors">✕</button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3 opacity-30">🛒</div>
            <p className="text-[#00ff41]/30 text-sm font-mono">Cart empty.</p>
            <p className="text-[#00ff41]/20 text-xs font-mono mt-1">Good luck catching the button.</p>
          </div>
        ) : (
          items.map(({ product, qty }) => (
            <div key={product.id} className="border border-[#00ff41]/10 bg-[#001a00]/50 p-3 flex items-center gap-3">
              <span className="text-2xl">{product.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[#00ff41] text-xs font-mono truncate">{product.name}</p>
                <p className="text-[#aaff00] text-xs font-mono">{product.price * qty} SINS</p>
                {qty > 1 && <p className="text-[#00ff41]/40 text-[10px] font-mono">×{qty}</p>}
              </div>
              <button
                onClick={() => onRemove(product.id)}
                className="text-red-800 hover:text-red-400 text-xs transition-colors"
              >✕</button>
            </div>
          ))
        )}
      </div>

      {/* Total + checkout */}
      <div className="border-t border-[#00ff41]/20 p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#00ff41]/60 text-xs font-mono tracking-widest">TOTAL SINS OWED:</span>
          <span className="text-[#aaff00] font-display text-2xl">{total}</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full border-2 border-[#00ff41] text-[#00ff41] font-display text-xl tracking-[0.2em] py-3
            hover:bg-[#00ff41]/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
          style={{ boxShadow: items.length > 0 ? '0 0 20px rgba(0,255,65,0.2)' : 'none' }}
        >
          ☠ COMMIT YOUR SINS ☠
        </button>
        <p className="text-[#00ff41]/20 text-[10px] text-center mt-2 font-mono">No refunds. No survivors.</p>
      </div>
    </div>
  );
}
