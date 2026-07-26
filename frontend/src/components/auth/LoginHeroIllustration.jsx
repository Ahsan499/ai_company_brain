import React from 'react';
import { motion } from 'framer-motion';

const floatTransition = (delay = 0, duration = 3.4) => ({
  duration,
  repeat: Infinity,
  ease: 'easeInOut',
  delay,
});

/** Animated flat illustration — people + analytics dashboard (design match). */
const LoginHeroIllustration = ({ className = '' }) => (
  <div className={`relative w-full ${className}`} aria-hidden="true">
    <svg viewBox="0 0 640 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <ellipse cx="320" cy="398" rx="240" ry="16" fill="#1D4ED8" opacity="0.28" />

      {/* Main monitor */}
      <motion.g
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <rect x="175" y="42" width="290" height="205" rx="14" fill="#FFFFFF" />
        <rect x="186" y="54" width="268" height="165" rx="8" fill="#EFF6FF" />
        <rect x="285" y="252" width="70" height="12" rx="3" fill="#CBD5E1" />
        <rect x="255" y="266" width="130" height="7" rx="3" fill="#94A3B8" />

        <motion.path
          d="M205 175 C235 145, 255 195, 285 160 C315 125, 335 170, 365 150 C395 130, 415 155, 435 140"
          stroke="#2563EB"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.4, ease: 'easeInOut' }}
        />
        <motion.circle cx="285" cy="160" r="4" fill="#2563EB" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }} />
        <motion.circle cx="365" cy="150" r="4" fill="#2563EB" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.05 }} />

        {[
          { x: 210, h: 24, delay: 0.55, color: '#93C5FD' },
          { x: 232, h: 39, delay: 0.65, color: '#60A5FA' },
          { x: 254, h: 31, delay: 0.75, color: '#3B82F6' },
          { x: 276, h: 49, delay: 0.85, color: '#2563EB' },
        ].map((bar) => (
          <motion.rect
            key={bar.x}
            x={bar.x}
            width="16"
            rx="3"
            fill={bar.color}
            initial={{ y: 214, height: 0 }}
            animate={{ y: 214 - bar.h, height: bar.h }}
            transition={{ duration: 0.55, delay: bar.delay, ease: 'easeOut' }}
          />
        ))}

        <motion.g
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 180 }}
          style={{ transformOrigin: '400px 190px' }}
        >
          <circle cx="400" cy="190" r="40" fill="#FDE68A" />
          <path d="M400 150 A40 40 0 0 1 436 204 L400 190 Z" fill="#F472B6" />
          <path d="M436 204 A40 40 0 0 1 372 220 L400 190 Z" fill="#34D399" />
          <path d="M372 220 A40 40 0 0 1 400 150 L400 190 Z" fill="#60A5FA" />
          <circle cx="400" cy="190" r="16" fill="#EFF6FF" />
        </motion.g>
      </motion.g>

      {/* Floating check card */}
      <motion.g
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <motion.g animate={{ y: [0, -10, 0] }} transition={floatTransition(1.2, 3.6)}>
          <rect x="505" y="68" width="90" height="74" rx="12" fill="#FFFFFF" />
          <circle cx="534" cy="96" r="14" fill="#34D399" />
          <path d="M528 96 L532 100 L542 90" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="520" y="118" width="58" height="6" rx="3" fill="#E2E8F0" />
          <rect x="520" y="128" width="42" height="6" rx="3" fill="#E2E8F0" />
        </motion.g>
      </motion.g>

      {/* Floating pie */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <motion.g animate={{ y: [0, -12, 0] }} transition={floatTransition(0.8, 3.8)}>
          <circle cx="140" cy="90" r="28" fill="#FFFFFF" />
          <path d="M140 90 L140 62 A28 28 0 0 1 165 103 Z" fill="#F472B6" />
          <path d="M140 90 L165 103 A28 28 0 0 1 120 110 Z" fill="#60A5FA" />
          <path d="M140 90 L120 110 A28 28 0 0 1 140 62 Z" fill="#FBBF24" />
          <circle cx="140" cy="90" r="10" fill="#FFFFFF" />
        </motion.g>
      </motion.g>

      {/* Check badge */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, type: 'spring', stiffness: 220 }}
      >
        <motion.g animate={{ y: [0, -7, 0] }} transition={floatTransition(1.5, 3.2)}>
          <circle cx="520" cy="175" r="16" fill="#10B981" />
          <path d="M513 175 L518 180 L529 168" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      </motion.g>

      {/* Left person */}
      <motion.g
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35, duration: 0.6, ease: 'easeOut' }}
      >
        <ellipse cx="95" cy="325" rx="40" ry="9" fill="#1D4ED8" opacity="0.2" />
        <rect x="60" y="275" width="68" height="44" rx="10" fill="#1E40AF" opacity="0.35" />
        <path d="M72 255 C72 225, 120 225, 120 255 L115 295 C100 305, 90 305, 77 295 Z" fill="#3B82F6" />
        <circle cx="96" cy="212" r="22" fill="#FDBA74" />
        <path d="M79 202 C86 190, 106 190, 113 202 C109 194, 83 194, 79 202 Z" fill="#1F2937" />
        <path d="M118 258 C140 263, 150 270, 155 278" stroke="#FDBA74" strokeWidth="10" strokeLinecap="round" />
        <rect x="132" y="278" width="68" height="40" rx="4" fill="#E2E8F0" />
        <rect x="138" y="283" width="56" height="26" rx="2" fill="#93C5FD" />
        <rect x="127" y="317" width="78" height="5" rx="2" fill="#94A3B8" />
      </motion.g>

      {/* Center person */}
      <motion.g
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.65, ease: 'easeOut' }}
      >
        <ellipse cx="320" cy="355" rx="34" ry="8" fill="#1D4ED8" opacity="0.2" />
        <path d="M298 255 C298 225, 344 225, 344 255 L354 335 C340 345, 300 345, 288 335 Z" fill="#A78BFA" />
        <circle cx="321" cy="205" r="24" fill="#FDBA74" />
        <path d="M299 200 C306 180, 341 180, 343 203 C336 190, 306 190, 299 200 Z" fill="#7C3AED" />
        <path d="M344 248 C378 222, 398 202, 412 188" stroke="#FDBA74" strokeWidth="11" strokeLinecap="round" />
        <path d="M298 260 C274 274, 268 294, 270 308" stroke="#FDBA74" strokeWidth="10" strokeLinecap="round" />
      </motion.g>

      {/* Right person */}
      <motion.g
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45, duration: 0.6, ease: 'easeOut' }}
      >
        <ellipse cx="528" cy="345" rx="38" ry="9" fill="#1D4ED8" opacity="0.2" />
        <rect x="572" y="305" width="26" height="30" rx="4" fill="#F59E0B" />
        <ellipse cx="585" cy="305" rx="15" ry="5" fill="#D97706" />
        <path d="M585 305 C572 278, 595 262, 585 248" stroke="#22C55E" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M585 296 C595 272, 610 276, 600 258" stroke="#4ADE80" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M505 260 C505 230, 552 230, 552 260 L547 325 C532 336, 522 336, 510 325 Z" fill="#FBBF24" />
        <circle cx="528" cy="215" r="22" fill="#FDBA74" />
        <path d="M510 205 C518 190, 542 190, 546 210 C538 195, 516 195, 510 205 Z" fill="#92400E" />
        <path d="M505 268 C482 278, 472 292, 470 302" stroke="#FDBA74" strokeWidth="10" strokeLinecap="round" />
        <rect x="455" y="305" width="62" height="36" rx="4" fill="#E2E8F0" />
        <rect x="460" y="310" width="52" height="24" rx="2" fill="#86EFAC" />
      </motion.g>
    </svg>
  </div>
);

export default LoginHeroIllustration;
