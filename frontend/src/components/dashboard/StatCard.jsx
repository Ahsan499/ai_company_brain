import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const TONE = {
  blue: {
    orb: 'from-[#2563EB]/20 to-[#60A5FA]/5',
    icon: 'bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-[#2563EB] ring-1 ring-[#2563EB]/10',
  },
  green: {
    orb: 'from-[#10B981]/20 to-[#6EE7B7]/5',
    icon: 'bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-[#059669] ring-1 ring-[#10B981]/10',
  },
  purple: {
    orb: 'from-[#8B5CF6]/20 to-[#C4B5FD]/5',
    icon: 'bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] text-[#7C3AED] ring-1 ring-[#8B5CF6]/10',
  },
  orange: {
    orb: 'from-[#F59E0B]/20 to-[#FCD34D]/5',
    icon: 'bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] text-[#D97706] ring-1 ring-[#F59E0B]/10',
  },
};

const StatCard = ({
  title,
  value,
  growth,
  icon: Icon,
  tone = 'blue',
  delay = 0,
}) => {
  const t = TONE[tone] || TONE.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="
        group relative overflow-hidden rounded-[20px]
        border border-border/40 bg-white/85 backdrop-blur-sm
        p-5 sm:p-6
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)]
        hover:border-primary/15
        hover:shadow-[0_12px_36px_rgba(37,99,235,0.1),0_2px_8px_rgba(15,23,42,0.04)]
        transition-[box-shadow,border-color] duration-300
      "
    >
      <div className={`pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${t.orb} blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-80`} />

      <div className="relative flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-[14px] ${t.icon}`}>
          {Icon ? <Icon size={20} strokeWidth={1.85} /> : null}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-success ring-1 ring-success/10">
          <TrendingUp size={11} strokeWidth={2.5} />
          {growth}
        </span>
      </div>

      <p className="relative mt-5 text-[13px] font-medium text-secondaryText tracking-wide">
        {title}
      </p>
      <p className="relative mt-1 text-[32px] sm:text-[36px] font-bold leading-none text-heading tracking-tight tabular-nums">
        {value}
      </p>
    </motion.div>
  );
};

export default StatCard;
