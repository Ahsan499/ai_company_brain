import React from 'react';
import { motion } from 'framer-motion';

const float = (delay = 0, duration = 3.5, y = 10) => ({
  animate: { y: [0, -y, 0] },
  transition: { duration, repeat: Infinity, ease: 'easeInOut', delay },
});

/** Success celebration illustration — green check, shield, confetti. */
const PasswordUpdatedHeroIllustration = ({ className = '' }) => (
  <div className={`relative w-full max-w-lg mx-auto ${className}`} aria-hidden="true">
    <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Soft platform */}
      <ellipse cx="260" cy="340" rx="150" ry="28" fill="#BBF7D0" opacity="0.45" />
      <ellipse cx="260" cy="348" rx="120" ry="16" fill="#86EFAC" opacity="0.35" />

      {/* Confetti */}
      {[
        { x: 90, y: 80, c: '#60A5FA', d: 0 },
        { x: 130, y: 50, c: '#F472B6', d: 0.2 },
        { x: 400, y: 70, c: '#FBBF24', d: 0.1 },
        { x: 440, y: 110, c: '#34D399', d: 0.3 },
        { x: 70, y: 160, c: '#A78BFA', d: 0.15 },
        { x: 450, y: 180, c: '#F87171', d: 0.25 },
        { x: 100, y: 220, c: '#38BDF8', d: 0.4 },
        { x: 420, y: 240, c: '#FBBF24', d: 0.35 },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i % 2 === 0 ? 4 : 3}
          fill={p.c}
          animate={{ y: [0, -8, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.8 + (i % 3) * 0.4, repeat: Infinity, ease: 'easeInOut', delay: p.d }}
        />
      ))}
      {[
        { x: 150, y: 100, rot: 20 },
        { x: 380, y: 90, rot: -30 },
        { x: 80, y: 200, rot: 45 },
        { x: 430, y: 200, rot: -15 },
      ].map((l, i) => (
        <motion.rect
          key={`line-${i}`}
          x={l.x}
          y={l.y}
          width="14"
          height="3"
          rx="1.5"
          fill="#93C5FD"
          style={{ transformOrigin: `${l.x}px ${l.y}px` }}
          animate={{ rotate: [l.rot, l.rot + 12, l.rot], y: [0, -6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
        />
      ))}

      {/* Plant */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x="70" y="300" width="32" height="34" rx="5" fill="#F59E0B" />
        <ellipse cx="86" cy="300" rx="18" ry="6" fill="#D97706" />
        <path d="M86 298 C72 270, 95 250, 86 230" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M86 285 C100 260, 115 265, 105 245" stroke="#4ADE80" strokeWidth="5" strokeLinecap="round" fill="none" />
      </motion.g>

      {/* Floating shield */}
      <motion.g initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <motion.g {...float(0.2, 3.8, 11)}>
          <path
            d="M90 120 C120 120, 145 132, 145 132 V175 C145 205, 120 225, 90 235 C60 225, 35 205, 35 175 V132 C35 132, 60 120, 90 120 Z"
            fill="#2563EB"
          />
          <rect x="76" y="165" width="28" height="24" rx="6" fill="#FFFFFF" />
          <path d="M82 165 V156 a8 8 0 0 1 16 0 v9" stroke="#BFDBFE" strokeWidth="4" fill="none" strokeLinecap="round" />
        </motion.g>
      </motion.g>

      {/* Envelope with check badge */}
      <motion.g initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
        <motion.g {...float(0.5, 4, 9)}>
          <rect x="380" y="130" width="78" height="56" rx="10" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="3" />
          <path d="M388 144 L419 166 L450 144" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="450" cy="130" r="14" fill="#10B981" />
          <path d="M443 130 L448 135 L458 123" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      </motion.g>

      {/* Password mini card */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        <motion.g {...float(0.9, 3.6, 8)}>
          <rect x="380" y="230" width="90" height="50" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <rect x="392" y="244" width="18" height="22" rx="4" fill="#DBEAFE" />
          <circle cx="401" cy="252" r="3" fill="#2563EB" />
          <rect x="398" y="252" width="6" height="8" rx="2" fill="#2563EB" />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={422 + i * 12} cy="255" r="4" fill="#94A3B8" />
          ))}
        </motion.g>
      </motion.g>

      {/* Main green success check */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 14 }}
      >
        <motion.g
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="260" cy="195" r="88" fill="#D1FAE5" opacity="0.7" />
          <circle cx="260" cy="195" r="72" fill="#A7F3D0" opacity="0.55" />
          <circle cx="260" cy="195" r="58" fill="url(#successGrad)" />
          <motion.path
            d="M230 195 L250 215 L295 165"
            stroke="#FFFFFF"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.45, duration: 0.55, ease: 'easeOut' }}
          />
        </motion.g>
      </motion.g>

      <defs>
        <linearGradient id="successGrad" x1="202" y1="137" x2="318" y2="253" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default PasswordUpdatedHeroIllustration;
