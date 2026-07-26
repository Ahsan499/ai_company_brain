import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const DEFAULT_REQUIREMENTS = [
  'At least 8 characters',
  'One uppercase letter',
  'One lowercase letter',
  'One number',
  'One special character',
];

/**
 * Static password strength UI (no validation logic).
 * Designed for premium auth screens — display-only.
 */
const PasswordStrength = ({
  label = 'Strong',
  /** 0–4 segments filled; default shows "Strong" look */
  segmentsFilled = 4,
  totalSegments = 4,
  requirements = DEFAULT_REQUIREMENTS,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-heading">
            Password Strength
          </span>
          <span className="text-xs sm:text-sm font-semibold text-success">
            {label}
          </span>
        </div>
        <div
          className="flex gap-1.5"
          role="meter"
          aria-label="Password strength"
          aria-valuemin={0}
          aria-valuemax={totalSegments}
          aria-valuenow={segmentsFilled}
          aria-valuetext={label}
        >
          {Array.from({ length: totalSegments }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.35 }}
              className={`
                h-1.5 flex-1 rounded-full origin-left
                ${i < segmentsFilled ? 'bg-success' : 'bg-gray-200'}
              `}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 border border-border/60 px-3.5 py-3.5 sm:px-4 sm:py-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
          {requirements.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="flex items-start gap-2 text-xs sm:text-sm text-heading"
            >
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15">
                <Check size={11} className="text-success" strokeWidth={3} />
              </span>
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PasswordStrength;
