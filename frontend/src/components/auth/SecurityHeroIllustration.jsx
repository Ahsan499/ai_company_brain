import React from 'react';
import { motion } from 'framer-motion';

const float = (delay = 0, duration = 3.5, y = 10) => ({
  animate: { y: [0, -y, 0] },
  transition: { duration, repeat: Infinity, ease: 'easeInOut', delay },
});

/** 3D-style security illustration for Forgot Password (Screen 2). */
const SecurityHeroIllustration = ({ className = '' }) => (
  <div className={`relative w-full max-w-lg mx-auto ${className}`} aria-hidden="true">
    <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Soft floor */}
      <ellipse cx="260" cy="392" rx="180" ry="14" fill="#BFDBFE" opacity="0.55" />

      {/* Desk surface line */}
      <path d="M40 360 H480" stroke="#DBEAFE" strokeWidth="2" strokeLinecap="round" />

      {/* Plant */}
      <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <rect x="48" y="320" width="36" height="40" rx="6" fill="#F59E0B" />
        <ellipse cx="66" cy="320" rx="20" ry="7" fill="#D97706" />
        <path d="M66 318 C50 280, 78 255, 66 230" stroke="#22C55E" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M66 300 C80 270, 100 275, 88 250" stroke="#4ADE80" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M66 290 C52 265, 40 270, 48 248" stroke="#16A34A" strokeWidth="5" strokeLinecap="round" fill="none" />
      </motion.g>

      {/* Books */}
      <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <rect x="100" y="338" width="70" height="12" rx="2" fill="#60A5FA" />
        <rect x="104" y="326" width="66" height="12" rx="2" fill="#3B82F6" />
        <rect x="108" y="314" width="62" height="12" rx="2" fill="#2563EB" />
      </motion.g>

      {/* Coffee mug */}
      <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <rect x="185" y="330" width="38" height="30" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
        <path d="M223 338 C235 338, 235 352, 223 352" stroke="#E2E8F0" strokeWidth="4" fill="none" />
        <path d="M195 324 C197 316, 203 316, 205 324" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M208 324 C210 316, 216 316, 218 324" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
      </motion.g>

      {/* Floating envelope */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45 }}
      >
        <motion.g {...float(0.2, 3.8, 12)}>
          <rect x="70" y="90" width="72" height="52" rx="10" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="3" />
          <path d="M78 102 L106 122 L134 102" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="70" y="90" width="72" height="52" rx="10" fill="url(#envGrad)" opacity="0.15" />
        </motion.g>
      </motion.g>

      {/* Green check badge */}
      <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55, type: 'spring' }}>
        <motion.g {...float(0.6, 3.2, 8)}>
          <circle cx="420" cy="100" r="28" fill="#10B981" />
          <path d="M408 100 L416 108 L434 90" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      </motion.g>

      {/* Small lock */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
        <motion.g {...float(1, 3.6, 9)}>
          <rect x="400" y="200" width="36" height="30" rx="8" fill="#3B82F6" />
          <path d="M408 200 V190 a10 10 0 0 1 20 0 v10" stroke="#93C5FD" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="418" cy="214" r="4" fill="#FFFFFF" />
        </motion.g>
      </motion.g>

      {/* Paper plane */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
        <motion.g
          animate={{ y: [0, -14, 0], x: [0, 6, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        >
          <path d="M430 280 L490 250 L430 320 L450 280 Z" fill="#2563EB" />
          <path d="M430 280 L450 280 L490 250" fill="#93C5FD" />
        </motion.g>
      </motion.g>

      {/* Password stars */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
        <motion.g {...float(1.2, 4, 6)}>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={150 + i * 22} cy="70" r="7" fill="#60A5FA" />
          ))}
        </motion.g>
      </motion.g>

      {/* Main shield */}
      <motion.g
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
      >
        <motion.g
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Shield body */}
          <path
            d="M260 80
               C320 80, 370 100, 370 100
               V210
               C370 280, 310 330, 260 350
               C210 330, 150 280, 150 210
               V100
               C150 100, 200 80, 260 80 Z"
            fill="url(#shieldGrad)"
          />
          <path
            d="M260 100
               C310 100, 350 115, 350 115
               V210
               C350 268, 300 310, 260 328
               C220 310, 170 268, 170 210
               V115
               C170 115, 210 100, 260 100 Z"
            fill="#EFF6FF"
            opacity="0.2"
          />
          {/* Lock on shield */}
          <rect x="230" y="195" width="60" height="52" rx="12" fill="#FFFFFF" />
          <path
            d="M242 195 V175 a18 18 0 0 1 36 0 v20"
            stroke="#FFFFFF"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M242 195 V175 a18 18 0 0 1 36 0 v20"
            stroke="#BFDBFE"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="260" cy="218" r="6" fill="#2563EB" />
          <rect x="257" y="218" width="6" height="14" rx="3" fill="#2563EB" />
        </motion.g>
      </motion.g>

      <defs>
        <linearGradient id="shieldGrad" x1="150" y1="80" x2="370" y2="350" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="0.5" stopColor="#2563EB" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="envGrad" x1="70" y1="90" x2="142" y2="142" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#93C5FD" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default SecurityHeroIllustration;
