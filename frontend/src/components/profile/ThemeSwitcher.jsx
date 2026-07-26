import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';

const OPTIONS = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

/**
 * Static theme switcher UI (no theme engine wired).
 */
const ThemeSwitcher = ({ value = 'light', onChange }) => {
  return (
    <div
      className="
        rounded-[14px] p-1
        bg-gradient-to-b from-slate-100/95 to-slate-50/90
        ring-1 ring-inset ring-slate-200/80
        shadow-[0_1px_2px_rgba(15,23,42,0.04)_inset]
      "
      role="radiogroup"
      aria-label="Theme"
    >
      <div className="grid grid-cols-3 gap-0.5">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange?.(opt.id)}
              className={`
                relative flex items-center justify-center gap-1.5
                rounded-[11px] px-1.5 py-2 sm:py-[9px]
                text-[11px] font-medium tracking-tight
                transition-colors duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-inset
                ${active ? 'text-primary' : 'text-secondaryText/85 hover:text-heading'}
              `}
            >
              {active && (
                <motion.span
                  layoutId="profile-theme-pill"
                  className="
                    absolute inset-0 rounded-[11px]
                    bg-white
                    shadow-[0_1px_3px_rgba(15,23,42,0.08),0_0_0_1px_rgba(37,99,235,0.08)]
                  "
                  transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                />
              )}
              <motion.span
                className="relative z-10 inline-flex"
                animate={active ? { rotate: [0, -12, 8, 0], scale: [1, 1.08, 1] } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Icon size={13} strokeWidth={active ? 2.2 : 1.9} />
              </motion.span>
              <span className="relative z-10 hidden min-[380px]:inline">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
