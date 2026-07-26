import React from 'react';
import { motion } from 'framer-motion';

const float = (delay = 0, duration = 3.6, y = 10) => ({
  animate: { y: [0, -y, 0] },
  transition: { duration, repeat: Infinity, ease: 'easeInOut', delay },
});

/** Email + shield verification illustration for OTP screen. */
const OtpHeroIllustration = ({ className = '' }) => (
  <div className={`relative w-full max-w-lg mx-auto ${className}`} aria-hidden="true">
    <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <ellipse cx="260" cy="395" rx="170" ry="12" fill="#BFDBFE" opacity="0.5" />

      {/* Plant */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
        <rect x="42" y="318" width="34" height="38" rx="6" fill="#F59E0B" />
        <ellipse cx="59" cy="318" rx="18" ry="6" fill="#D97706" />
        <path d="M59 316 C44 280, 72 255, 59 232" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M59 298 C74 270, 92 274, 80 250" stroke="#4ADE80" strokeWidth="5" strokeLinecap="round" fill="none" />
      </motion.g>

      {/* Coffee */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
        <rect x="100" y="332" width="36" height="28" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
        <path d="M136 340 C148 340, 148 352, 136 352" stroke="#E2E8F0" strokeWidth="4" fill="none" />
        <path d="M110 326 C112 318, 118 318, 120 326" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
      </motion.g>

      {/* Floating small envelope */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <motion.g {...float(0.2, 3.8, 11)}>
          <rect x="390" y="70" width="64" height="46" rx="10" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="3" />
          <path d="M398 82 L422 100 L446 82" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </motion.g>
      </motion.g>

      {/* Green check */}
      <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55, type: 'spring' }}>
        <motion.g {...float(0.5, 3.2, 8)}>
          <circle cx="80" cy="110" r="26" fill="#10B981" />
          <path d="M68 110 L76 118 L94 98" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      </motion.g>

      {/* Paper plane */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <motion.g
          animate={{ y: [0, -12, 0], x: [0, 5, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M400 300 L470 270 L400 350 L422 300 Z" fill="#2563EB" />
          <path d="M400 300 L422 300 L470 270" fill="#93C5FD" />
        </motion.g>
      </motion.g>

      {/* Small lock */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <motion.g {...float(1, 3.5, 7)}>
          <rect x="400" y="180" width="34" height="28" rx="7" fill="#3B82F6" />
          <path d="M408 180 V172 a9 9 0 0 1 18 0 v8" stroke="#93C5FD" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="417" cy="193" r="3.5" fill="#FFFFFF" />
        </motion.g>
      </motion.g>

      {/* Main open envelope */}
      <motion.g
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
        {/* Envelope back */}
        <path d="M110 220 L260 140 L410 220 L410 320 L110 320 Z" fill="#DBEAFE" />
        <path d="M110 220 L260 280 L410 220" fill="#BFDBFE" />
        <path d="M110 220 L110 320 L260 280 Z" fill="#93C5FD" />
        <path d="M410 220 L410 320 L260 280 Z" fill="#60A5FA" />

        {/* Stars card (password / code) */}
        <motion.g {...float(0.8, 4, 6)}>
          <rect x="185" y="175" width="150" height="48" rx="12" fill="#FFFFFF" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={210 + i * 24} cy="199" r="7" fill="#60A5FA" />
          ))}
        </motion.g>

        {/* Shield rising from envelope */}
        <motion.g
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M260 95
               C305 95, 345 110, 345 110
               V185
               C345 235, 300 270, 260 285
               C220 270, 175 235, 175 185
               V110
               C175 110, 215 95, 260 95 Z"
            fill="url(#otpShieldGrad)"
          />
          <path
            d="M260 112
               C298 112, 330 124, 330 124
               V185
               C330 225, 295 255, 260 268
               C225 255, 190 225, 190 185
               V124
               C190 124, 222 112, 260 112 Z"
            fill="#EFF6FF"
            opacity="0.22"
          />
          <rect x="238" y="175" width="44" height="38" rx="9" fill="#FFFFFF" />
          <path
            d="M248 175 V162 a12 12 0 0 1 24 0 v13"
            stroke="#BFDBFE"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="260" cy="190" r="4.5" fill="#2563EB" />
          <rect x="258" y="190" width="4" height="10" rx="2" fill="#2563EB" />
        </motion.g>
      </motion.g>

      <defs>
        <linearGradient id="otpShieldGrad" x1="175" y1="95" x2="345" y2="285" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="0.55" stopColor="#2563EB" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default OtpHeroIllustration;
