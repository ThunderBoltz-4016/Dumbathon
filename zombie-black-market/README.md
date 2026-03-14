# 🧟 ZOMBIE BLACK MARKET
### *Trade or Die — Underground Bunker Marketplace*
> Built for DUMBATHON 2.0 // APOCALYPSE PROTOCOL // E-Commerce Track

---

## ⚡ QUICK START (get it running in 2 minutes)

```bash
# 1. Enter the project
cd zombie-black-market

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev

# 4. Open browser
# → http://localhost:3000
```

---

## 🎮 HOW IT WORKS (show this to judges)

### Flow:
```
1. CAPTCHA HELL        → Prove you're alive before entering
2. THE STORE           → Browse 6 apocalypse products
3. ADD TO CART         → Two ways (both are awful):
   a) Click the button  → It FLEES your cursor
   b) Drag the card     → Drop on the MOVING CART (it speeds up when you get close)
4. CAPTCHA AGAIN       → Every. Single. Action.
5. POPUP QUIZ          → Answer a dumb question or lose your item
6. CHECKOUT            → "Commit Your Sins"
7. DONE                → Order confirmed. Probably.
```

---

## 🔥 FEATURES IMPLEMENTED

| Feature | Status | Notes |
|--------|--------|-------|
| Ragebait CAPTCHA | ✅ | 8 types, random every time |
| CAPTCHA on every action | ✅ | No mercy |
| Fleeing Add-to-Cart button | ✅ | Panics when cursor is close |
| Moving cart on wheels | ✅ | Speeds up near cursor |
| Drag item onto cart | ✅ | Drop target with glow |
| Apocalypse popups | ✅ | Wrong answer = item removed |
| Core shop + cart flow | ✅ | Full browse → checkout |
| Biohazard glitch aesthetic | ✅ | Scanlines, glow, ticker |

---

## 🧟 CAPTCHA TYPES

1. **Select all traffic lights** — there are none. Still click Verify.
2. **Select atoms of carbon** — blank grid
3. **Prove you're not a robot** — only options are "I AM a robot"
4. **Click the invisible VERIFY button** — it's somewhere on the screen
5. **Don't move your mouse for 15 seconds** — any movement resets timer
6. **Click exactly 50 times** — 51 = start over
7. **Select images of "profound longing"** — all subjective, we judge you
8. **Click all bridges** — half are dental bridges

---

## 💀 POPUP QUESTIONS & ANSWERS

| Question | Answer |
|---------|--------|
| How many zombies in a horde? | 47 |
| What do you pledge your SINS to? | THE MARKET |
| What is the password? | BRAINS |
| What does the cart want? | MORE SINS |
| Are you alive? | YES |
| How mutated are you (1-10)? | 7 |
| Who controls the bunker? | NOBODY |
| How many SINS power the generator? | 9000 |

---

## 🛠️ PROJECT STRUCTURE

```
zombie-black-market/
├── app/
│   ├── page.tsx          ← Main store + state orchestration
│   ├── layout.tsx        ← Root layout
│   └── globals.css       ← Glitch/biohazard styles
├── components/
│   ├── CaptchaOverlay.tsx   ← 8 evil CAPTCHA types
│   ├── ProductCard.tsx      ← Fleeing button + drag
│   ├── MovingCart.tsx       ← Physics-based moving cart
│   ├── PopupInterrupt.tsx   ← Quiz popup, wrong = item removed
│   └── CartPanel.tsx        ← Cart sidebar + checkout
├── data/
│   └── products.ts       ← Products, CAPTCHAs, popup data
└── README.md
```

---

## 🎨 TECH STACK

- **Next.js 14** (App Router)
- **React 18** with hooks
- **Tailwind CSS** for styling
- **TypeScript** throughout
- **requestAnimationFrame** for cart physics
- **HTML5 Drag & Drop API** for dragging items

---

*© ZOMBIE BLACK MARKET • Est. Day 1 of the Apocalypse • All SINS final • No refunds • No survivors*
