import React from 'react';
import { motion } from 'framer-motion';

const QuickActionCard = ({
  icon: Icon,
  title,
  description,
  tone = 'from-[#EFF6FF] to-[#BFDBFE] text-[#2563EB]',
  active = false,
  onClick,
  onMouseEnter,
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={`
        group relative flex flex-col items-start gap-2.5
        rounded-[18px] p-3 sm:p-3.5 text-left
        border transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
        ${
          active
            ? 'bg-white border-primary/20 shadow-[0_10px_28px_rgba(37,99,235,0.12),0_1px_0_rgba(255,255,255,0.9)_inset] ring-1 ring-primary/10'
            : 'bg-white/70 border-border/40 hover:bg-white hover:border-primary/12 hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)]'
        }
      `}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-[18px] bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-hidden
      />
      <span
        className={`
          relative flex h-9 w-9 items-center justify-center rounded-[12px]
          bg-gradient-to-br ${tone}
          shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_3px_10px_rgba(15,23,42,0.07)]
          transition-transform duration-200 group-hover:scale-[1.06]
        `}
      >
        {Icon ? <Icon size={15} strokeWidth={2.05} /> : null}
      </span>
      <span className="relative min-w-0">
        <span className="block text-[12.5px] font-semibold text-heading tracking-[-0.02em] leading-snug">
          {title}
        </span>
        <span className="mt-1 block text-[11px] leading-snug text-secondaryText/80 line-clamp-2">
          {description}
        </span>
      </span>
    </motion.button>
  );
};

export default QuickActionCard;
