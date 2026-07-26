import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const ProfileMenuItem = ({
  icon: Icon,
  title,
  description,
  onClick,
  trailing,
  delay = 0,
}) => {
  return (
    <motion.button
      type="button"
      role="menuitem"
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay,
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ x: 1 }}
      whileTap={{ scale: 0.992 }}
      onClick={onClick}
      className="
        group relative flex w-full items-center gap-3
        rounded-[14px] px-2.5 py-2 sm:py-[9px] text-left
        hover:bg-slate-50/95
        active:bg-slate-100/80
        transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-1
      "
    >
      <span
        className="
          relative flex h-9 w-9 shrink-0 items-center justify-center
          rounded-[11px]
          bg-gradient-to-b from-slate-50 to-slate-100/90
          text-slate-500
          ring-1 ring-slate-200/70
          shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]
          transition-all duration-200
          group-hover:from-[#EFF6FF] group-hover:to-[#DBEAFE]/80
          group-hover:text-primary
          group-hover:ring-primary/15
          group-hover:shadow-[0_2px_8px_rgba(37,99,235,0.1)]
        "
      >
        {Icon ? (
          <Icon
            size={15}
            strokeWidth={1.85}
            className="transition-transform duration-200 group-hover:scale-[1.06]"
          />
        ) : null}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium text-heading tracking-[-0.01em] leading-snug">
          {title}
        </span>
        {description && (
          <span className="mt-0.5 block text-[11.5px] leading-snug text-secondaryText/80 truncate">
            {description}
          </span>
        )}
      </span>

      {trailing || (
        <ChevronRight
          size={14}
          strokeWidth={2}
          className="
            shrink-0 text-slate-300/90
            transition-all duration-200
            group-hover:translate-x-0.5 group-hover:text-primary/55
          "
        />
      )}
    </motion.button>
  );
};

export default ProfileMenuItem;
