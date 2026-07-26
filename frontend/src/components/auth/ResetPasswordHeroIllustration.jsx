import React from 'react';
import { motion } from 'framer-motion';

const float = (delay = 0, duration = 3.6, y = 10) => ({
  animate: { y: [0, -y, 0] },
  transition: { duration, repeat: Infinity, ease: 'easeInOut', delay },
});

/** Shield + key + password illustration for Reset Password. */
const ResetPasswordHeroIllustration = ({ className = '' }) => (
  <div className={`relative w-full max-w-lg mx-auto ${className}`} aria-hidden="true">
    <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <ellipse cx="260" cy="396" rx="175" ry="12" fill="#BFDBFE" opacity="0.5" />

      {/* Server blocks */}
      <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <rect x="48" y="300" width="52" height="40" rx="8" fill="#93C5FD" />
        <rect x="56" y="310" width="18" height="6" rx="2" fill="#EFF6FF" />
        <rect x="56" y="320" width="28" height="6" rx="2" fill="#EFF6FF" />
        <rect x="70" y="270" width="52" height="40" rx="8" fill="#60A5FA" />
        <rect x="78" y="280" width="18" height="6" rx="2" fill="#EFF6FF" />
        <rect x="78" y="290" width="28" height="6" rx="2" fill="#EFF6FF" />
      </motion.g>

      {/* Floating password stars card */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <motion.g {...float(0.3, 3.8, 9)}>
          <rect x="360" y="70" width="120" height="44" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={382 + i * 18} cy="92" r="6" fill="#60A5FA" />
          ))}
        </motion.g>
      </motion.g>

      {/* Login mini card */}
      <motion.g initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
        <motion.g {...float(0.8, 4, 8)}>
          <rect x="40" y="90" width="100" height="72" rx="12" fill="#FFFFFF" stroke="#DBEAFE" strokeWidth="2" />
          <rect x="52" y="108" width="76" height="10" rx="4" fill="#E2E8F0" />
          <rect x="52" y="126" width="56" height="10" rx="4" fill="#BFDBFE" />
          <rect x="52" y="144" width="76" height="10" rx="4" fill="#2563EB" />
        </motion.g>
      </motion.g>

      {/* Green check */}
      <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}>
        <motion.g {...float(1, 3.2, 7)}>
          <circle cx="430" cy="160" r="22" fill="#10B981" />
          <path d="M420 160 L427 167 L442 150" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      </motion.g>

      {/* Golden / blue key */}
      <motion.g initial={{ opacity: 0, rotate: -20 }} animate={{ opacity: 1, rotate: 0 }} transition={{ delay: 0.55, duration: 0.5 }}>
        <motion.g
          animate={{ y: [0, -10, 0], rotate: [12, 18, 12] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '380px 280px' }}
        >
          <circle cx="360" cy="290" r="22" fill="#FBBF24" stroke="#F59E0B" strokeWidth="3" />
          <circle cx="360" cy="290" r="10" fill="#FEF3C7" />
          <rect x="378" y="282" width="70" height="16" rx="6" fill="#F59E0B" />
          <rect x="428" y="282" width="8" height="22" rx="3" fill="#D97706" />
          <rect x="412" y="282" width="8" height="18" rx="3" fill="#D97706" />
        </motion.g>
      </motion.g>

      {/* Main shield */}
      <motion.g
        initial={{ opacity: 0, y: 28, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.g
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M260 70
               C325 70, 380 95, 380 95
               V210
               C380 290, 310 345, 260 365
               C210 345, 140 290, 140 210
               V95
               C140 95, 195 70, 260 70 Z"
            fill="url(#resetShieldGrad)"
          />
          <path
            d="M260 95
               C310 95, 355 115, 355 115
               V210
               C355 275, 300 320, 260 338
               C220 320, 165 275, 165 210
               V115
               C165 115, 210 95, 260 95 Z"
            fill="#EFF6FF"
            opacity="0.2"
          />
          <rect x="228" y="195" width="64" height="54" rx="12" fill="#FFFFFF" />
          <path
            d="M242 195 V175 a18 18 0 0 1 36 0 v20"
            stroke="#BFDBFE"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="260" cy="218" r="6" fill="#2563EB" />
          <rect x="257" y="218" width="6" height="14" rx="3" fill="#2563EB" />
        </motion.g>
      </motion.g>

      <defs>
        <linearGradient id="resetShieldGrad" x1="140" y1="70" x2="380" y2="365" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="0.5" stopColor="#2563EB" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default ResetPasswordHeroIllustration;
