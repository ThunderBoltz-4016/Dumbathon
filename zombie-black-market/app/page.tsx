'use client';
import { useState, useCallback } from 'react';
import { PRODUCTS, type Product } from '@/data/products';
import CaptchaOverlay from '@/components/CaptchaOverlay';
import PopupInterrupt from '@/components/PopupInterrupt';
import MovingCart from '@/components/MovingCart';
import ProductCard from '@/components/ProductCard';
import CartPanel from '@/components/CartPanel';

type Phase = 'captcha' | 'store' | 'checkout-done';

interface CartItem { product: Product; qty: number; }
interface PendingAction { type: 'add'; product: Product; }

export default function Home() {
  const [phase, setPhase] = useState<Phase>('captcha');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalSins = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(''), 3000);
  };

  // Every action triggers CAPTCHA first, then popup
  const handleAddToCart = useCallback((product: Product) => {
    setPendingAction({ type: 'add', product });
    setShowCaptcha(true);
  }, []);

  const handleCaptchaPass = () => {
    setShowCaptcha(false);
    setShowPopup(true); // After captcha → popup
  };

  const handlePopupConfirm = () => {
    setShowPopup(false);
    if (!pendingAction) return;
    // Actually add to cart
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === pendingAction.product.id);
      if (existing) return prev.map(i => i.product.id === pendingAction.product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product: pendingAction.product, qty: 1 }];
    });
    showToast(`☠ ${pendingAction.product.name} added. ${pendingAction.product.price} SINS owed.`, 'success');
    setPendingAction(null);
  };

  const handlePopupDeny = (msg: string) => {
    setShowPopup(false);
    setPendingAction(null);
    showToast(msg, 'error');
  };

  // Drag onto moving cart
  const handleCartDrop = (e: React.DragEvent) => {
    const productId = e.dataTransfer.getData('productId');
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) handleAddToCart(product);
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== id));
  };

  const handleCheckout = () => {
    setPendingAction(null);
    setShowCaptcha(true);
  };

  const handleCheckoutCaptchaPass = () => {
    setShowCaptcha(false);
    setShowPopup(true);
  };

  const handleCheckoutPopupConfirm = () => {
    setShowPopup(false);
    setCartItems([]);
    setShowCart(false);
    setPhase('checkout-done');
  };

  if (phase === 'checkout-done') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-center p-12 border border-[#00ff41]/20 max-w-md">
          <div className="text-8xl mb-6">☠️</div>
          <h1 className="text-[#00ff41] font-display text-4xl tracking-widest mb-4">SINS COMMITTED</h1>
          <p className="text-[#a0ffb0]/60 text-sm font-mono mb-2">Your order has been received.</p>
          <p className="text-[#a0ffb0]/40 text-xs font-mono mb-6">Delivery estimated: when the horde allows it.</p>
          <button
            onClick={() => { setPhase('captcha'); }}
            className="border border-[#00ff41]/50 text-[#00ff41]/70 text-xs font-mono px-6 py-2 hover:border-[#00ff41] hover:text-[#00ff41] transition-all"
          >
            COMMIT MORE SINS →
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative">

      {/* ===== CAPTCHA OVERLAY ===== */}
      {(phase === 'captcha' || showCaptcha) && (
        <CaptchaOverlay
          onPass={phase === 'captcha'
            ? () => setPhase('store')
            : pendingAction
              ? handleCaptchaPass
              : handleCheckoutCaptchaPass
          }
        />
      )}

      {/* ===== POPUP INTERRUPT ===== */}
      {showPopup && (
        <PopupInterrupt
          onConfirm={pendingAction ? handlePopupConfirm : handleCheckoutPopupConfirm}
          onDeny={handlePopupDeny}
          itemName={pendingAction?.product.name}
        />
      )}

      {phase === 'store' && (
        <>
          {/* ===== MOVING CART ===== */}
          <MovingCart
            itemCount={totalItems}
            totalSins={totalSins}
            onDrop={handleCartDrop}
            onCartClick={() => setShowCart(true)}
          />

          {/* ===== CART PANEL ===== */}
          {showCart && (
            <CartPanel
              items={cartItems}
              onCheckout={handleCheckout}
              onRemove={handleRemoveFromCart}
              onClose={() => setShowCart(false)}
            />
          )}

          {/* ===== HEADER ===== */}
          <header className="sticky top-0 z-[400] bg-[#050f05]/95 backdrop-blur-sm border-b border-[#00ff41]/20 px-6 py-3">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div>
                <h1 className="text-[#00ff41] font-display text-3xl tracking-[0.3em] glitch-text" data-text="ZOMBIE BLACK MARKET">
                  🧟 ZOMBIE BLACK MARKET
                </h1>
                <p className="text-[#00ff41]/40 text-[10px] font-mono tracking-[0.2em]">
                  ☣ UNDERGROUND BUNKER TRADE POST ☣ CURRENCY: SINS ☣ NO SURVIVORS GUARANTEED ☣
                </p>
              </div>
              <button
                onClick={() => setShowCart(true)}
                className="relative border border-[#00ff41]/40 text-[#00ff41] px-4 py-2 text-sm font-mono hover:border-[#00ff41] hover:bg-[#00ff41]/10 transition-all"
              >
                🛒 {totalItems} SINS BAG
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-700 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </header>

          {/* ===== TICKER ===== */}
          <div className="bg-[#001a00] border-b border-[#00ff41]/10 overflow-hidden py-1">
            <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
              {['⚠ HORDE APPROACHING FROM SECTOR 7', '☣ NEW STOCK: INFECTED RATIONS (SLIGHTLY RADIOACTIVE)', '💀 SELLER "ROTFACE99" HAS GONE OFFLINE', '🧠 BRAIN JUICE FLASH SALE: STILL 666 SINS (PRICES DON\'T DROP HERE)', '☠ RULE #1: NO REFUNDS. RULE #2: SEE RULE #1'].map((t, i) => (
                <span key={i} className="text-[#00ff41]/50 text-xs font-mono px-8">{t}</span>
              ))}
            </div>
          </div>

          {/* ===== HERO ===== */}
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="border border-[#00ff41]/10 bg-[#001a00]/30 p-6 mb-8 relative overflow-hidden">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-8xl opacity-10">☣️</div>
              <p className="text-[#aaff00] font-display text-4xl tracking-widest mb-1">TRADE OR DIE</p>
              <p className="text-[#00ff41]/50 text-sm font-mono">Welcome, survivor. Currency accepted: SINS only. We don't make change. We don't make friends.</p>
              <p className="text-red-500/60 text-xs font-mono mt-2">⚠ Drag items to the cart. Or try clicking the button. Good luck with that.</p>
            </div>

            {/* ===== PRODUCT GRID ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            <p className="text-[#00ff41]/15 text-xs font-mono text-center mt-8">
              © ZOMBIE BLACK MARKET • Est. Day 1 of the Apocalypse • All SINS final
            </p>
          </div>
        </>
      )}

      {/* ===== TOAST ===== */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] border px-6 py-3 text-sm font-mono max-w-sm text-center transition-all
          ${toastType === 'success'
            ? 'border-[#00ff41]/50 bg-[#001a00] text-[#00ff41]'
            : 'border-red-700/50 bg-[#1a0000] text-red-400'
          }`}
          style={{ boxShadow: toastType === 'success' ? '0 0 20px rgba(0,255,65,0.2)' : '0 0 20px rgba(139,0,0,0.3)' }}
        >
          {toast}
        </div>
      )}

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes panicShake {
          0%,100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-4px) rotate(-2deg); }
          75% { transform: translateX(4px) rotate(2deg); }
        }
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
