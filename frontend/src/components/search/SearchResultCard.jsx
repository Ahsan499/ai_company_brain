import React from 'react';
import { motion } from 'framer-motion';
import { CornerDownLeft } from 'lucide-react';
import { CATEGORY_META } from './searchData';

const SearchResultCard = ({
  title,
  description,
  category,
  shortcut,
  active = false,
  onClick,
  onMouseEnter,
}) => {
  const meta = CATEGORY_META[category] || CATEGORY_META.Projects;
  const Icon = meta.icon;

  return (
    <motion.button
      type="button"
      role="option"
      aria-selected={active}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      whileTap={{ scale: 0.995 }}
      className={`
        group relative flex w-full items-center gap-3
        rounded-[16px] px-2.5 sm:px-3 py-2.5 text-left
        border transition-all duration-150
        focus:outline-none
        ${
          active
            ? 'bg-gradient-to-r from-white to-[#F8FAFC] border-primary/18 shadow-[0_8px_24px_rgba(37,99,235,0.1)] ring-1 ring-primary/[0.08]'
            : 'bg-transparent border-transparent hover:bg-white/95 hover:border-border/45 hover:shadow-[0_4px_16px_rgba(15,23,42,0.05)]'
        }
      `}
    >
      {active && (
        <motion.span
          layoutId="search-active-bar"
          className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full bg-primary"
          transition={{ type: 'spring', stiffness: 480, damping: 36 }}
        />
      )}

      <span
        className={`
          flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]
          bg-gradient-to-b from-white to-slate-50/90
          ring-1 ring-border/55
          shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_2px_6px_rgba(15,23,42,0.04)]
          transition-all duration-200
          ${active ? 'scale-[1.03] ring-primary/20' : 'group-hover:scale-[1.02]'}
        `}
      >
        <span
          className={`
            flex h-7 w-7 items-center justify-center rounded-[8px] ring-1
            ${meta.tone}
          `}
        >
          <Icon size={14} strokeWidth={2} />
        </span>
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 min-w-0">
          <span className="truncate text-[13.5px] font-semibold text-heading tracking-[-0.02em]">
            {title}
          </span>
          <span
            className={`
              shrink-0 inline-flex items-center rounded-md px-1.5 py-0.5
              text-[10px] font-semibold tracking-tight
              ring-1 ${meta.tone}
            `}
          >
            {category}
          </span>
        </span>
        {description && (
          <span className="mt-0.5 block truncate text-[12px] text-secondaryText/80 leading-snug">
            {description}
          </span>
        )}
      </span>

      <span
        className={`
          hidden sm:inline-flex items-center shrink-0
          transition-opacity duration-150
          ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'}
        `}
      >
        {shortcut && (
          <kbd
            className="
              inline-flex h-6 min-w-6 items-center justify-center rounded-[7px]
              border border-border/65 bg-white
              px-1.5 text-[10px] font-semibold text-secondaryText
              shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_1px_2px_rgba(15,23,42,0.04)]
            "
          >
            {shortcut === '↵' ? (
              <CornerDownLeft size={11} strokeWidth={2.2} />
            ) : (
              shortcut
            )}
          </kbd>
        )}
      </span>
    </motion.button>
  );
};

export default SearchResultCard;
