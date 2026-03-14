export interface Product {
  id: string;
  name: string;
  emoji: string;
  description: string;
  price: number;
  unit: string;
  warning: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'brain-juice',
    name: 'BRAIN JUICE',
    emoji: '🧠',
    description: 'Fresh-squeezed. Dont ask whose. Enhances cognition by 400% or death.',
    price: 666,
    unit: 'SINS/vial',
    warning: '⚠️ May cause zombie-vision',
  },
  {
    id: 'zombie-repellent',
    name: 'ZOMBIE REPELLENT',
    emoji: '🧴',
    description: 'Smells like rotting flesh. Zombies hate it. You will too.',
    price: 420,
    unit: 'SINS/can',
    warning: '⚠️ 12% effective rate',
  },
  {
    id: 'barbed-bat',
    name: 'BARBED WIRE BAT',
    emoji: '🏏',
    description: 'Lovingly hand-wrapped. Previous owner is no longer with us.',
    price: 999,
    unit: 'SINS/unit',
    warning: '⚠️ Returns not accepted',
  },
  {
    id: 'infected-rations',
    name: 'INFECTED RATIONS',
    emoji: '🥫',
    description: 'Expiry: unknown. Contents: classified. Best served cold.',
    price: 150,
    unit: 'SINS/pack',
    warning: '⚠️ Slight mutation risk',
  },
  {
    id: 'gas-mask',
    name: 'GAS MASK PRO™',
    emoji: '😷',
    description: 'Filters 3 of the 47 known airborne toxins. Stylish.',
    price: 1337,
    unit: 'SINS/mask',
    warning: '⚠️ Filter sold separately',
  },
  {
    id: 'mystery-syringe',
    name: 'MYSTERY SYRINGE',
    emoji: '💉',
    description: 'Could be a cure. Could be the virus. Exciting either way.',
    price: 777,
    unit: 'SINS/shot',
    warning: '⚠️ Irreversible effects',
  },
];

export interface CaptchaChallenge {
  id: string;
  instruction: string;
  type: 'grid-select' | 'no-click' | 'invisible-button' | 'countdown' | 'only-wrong' | 'click-count' | 'blank-grid' | 'type-text';
  data?: Record<string, unknown>;
}

export const CAPTCHA_POOL: CaptchaChallenge[] = [
  {
    id: 'traffic-lights',
    instruction: 'Select ALL squares containing traffic lights.',
    type: 'grid-select',
    data: {
      gridSize: 9,
      correctIndices: [],
      images: ['🌲','🏚️','🚗','🌫️','💀','🐀','🔧','🧱','☠️'],
      note: 'There are absolutely no traffic lights. Click "Verify" anyway.',
    },
  },
  {
    id: 'carbon-atom',
    instruction: 'Select all images containing a single atom of carbon.',
    type: 'blank-grid',
    data: { gridSize: 9, correctIndices: [] },
  },
  {
    id: 'not-robot',
    instruction: 'Prove you are NOT a robot. Select the correct option.',
    type: 'only-wrong',
    data: { options: ['I AM a robot', 'I AM a robot (definitely)', 'Beep boop, I am a robot'] },
  },
  {
    id: 'invisible-verify',
    instruction: 'Click "VERIFY" to continue. It\'s somewhere on the screen.',
    type: 'invisible-button',
    data: {},
  },
  {
    id: 'no-mouse',
    instruction: 'DO NOT move your mouse for 15 seconds. Any movement resets the timer.',
    type: 'countdown',
    data: { seconds: 15 },
  },
  {
    id: 'click-count',
    instruction: 'Click this button EXACTLY 50 times. Click 51 times and you start over.',
    type: 'click-count',
    data: { target: 50 },
  },
  {
    id: 'longing',
    instruction: 'Select all images that depict "a profound sense of longing."',
    type: 'grid-select',
    data: {
      gridSize: 9,
      correctIndices: [0, 2, 4, 6, 8],
      images: ['🌧️','🏠','🌅','🐕','🪟','📷','🌃','🛋️','🌊'],
      note: 'All answers are subjective. We will judge you.',
    },
  },
  {
    id: 'dental-bridges',
    instruction: 'Click all the BRIDGES. Be careful.',
    type: 'grid-select',
    data: {
      gridSize: 9,
      correctIndices: [1, 4, 7],
      images: ['🦷','🌉','🦷','🦷','🌁','🦷','🦷','🏗️','🦷'],
      note: 'Some of these may be dental bridges. Choose wisely.',
    },
  },
  {
    id: 'trolley-problem',
    instruction: 'Solve the trolley problem to access your cart.',
    type: 'only-wrong',
    data: { options: ['Pull the lever (5 die)', 'Don\'t pull (1 dies)', 'Become the trolley', 'Add all 6 to cart'] },
  },
];

export const POPUP_MESSAGES = [
  { title: '⚠️ HORDE DETECTED', body: 'A 47-zombie horde is 0.3km away. Do you still want to add this item?', question: 'How many zombies in a "horde"?', answer: '47', wrong: 'WRONG. Item confiscated. The horde thanks you.' },
  { title: '☣️ SUPPLY SHORTAGE', body: 'The Black Market cartel demands a loyalty oath before purchase.', question: 'What do you pledge your SINS to?', answer: 'THE MARKET', wrong: 'Oath rejected. Item returned to the void.' },
  { title: '📡 FACTION ALERT', body: 'The Infected Traders Guild requires identification.', question: 'What is the password?', answer: 'BRAINS', wrong: 'Access denied. Your item has been confiscated.' },
  { title: '🔴 SYSTEM WARNING', body: 'CRITICAL ERROR: Your cart has developed sentience. Appease it.', question: 'What does the cart want?', answer: 'MORE SINS', wrong: 'Cart rejected. Item thrown into the wasteland.' },
  { title: '💀 DEATH PROTOCOL', body: 'You must prove you are alive to complete this action.', question: 'Are you alive?', answer: 'YES', wrong: 'Unacceptable. Only the undead shop here. Item removed.' },
  { title: '🧬 MUTATION CHECK', body: 'Our sensors detect suspicious levels of humanity in your DNA.', question: 'How mutated are you (1-10)?', answer: '7', wrong: 'Wrong mutation level. Item quarantined.' },
  { title: '📻 BUNKER BROADCAST', body: 'This purchase has been flagged by the Shadow Council.', question: 'Who controls the bunker?', answer: 'NOBODY', wrong: 'The Council has spoken. Item seized.' },
  { title: '⚡ POWER SURGE', body: 'The generator demands tribute before processing your order.', question: 'How many SINS power the generator?', answer: '9000', wrong: 'Insufficient tribute. Transaction voided.' },
];
