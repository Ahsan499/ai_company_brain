import { motion } from 'framer-motion';

const TONE = {
  blue: {
    orb: 'from-[#2563EB]/20 to-[#60A5FA]/5',
    icon: 'bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-[#2563EB] ring-1 ring-[#2563EB]/10',
  },
  green: {
    orb: 'from-[#10B981]/20 to-[#6EE7B7]/5',
    icon: 'bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-[#059669] ring-1 ring-[#10B981]/10',
  },
  orange: {
    orb: 'from-[#F59E0B]/20 to-[#FCD34D]/5',
    icon: 'bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] text-[#D97706] ring-1 ring-[#F59E0B]/10',
  },
  purple: {
    orb: 'from-[#8B5CF6]/20 to-[#C4B5FD]/5',
    icon: 'bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] text-[#7C3AED] ring-1 ring-[#8B5CF6]/10',
  },
  slate: {
    orb: 'from-slate-400/20 to-slate-200/5',
    icon: 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 ring-1 ring-slate-300/50',
  },
};

const ReportStatCard = ({
  title,
  value,
  hint,
  icon: Icon,
  tone = 'blue',
  delay = 0,
}) => {
  const t = TONE[tone] || TONE.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="
        group relative overflow-hidden rounded-[20px]
        border border-border/40 bg-white/85 backdrop-blur-sm
        p-5
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)]
        hover:border-primary/15
        hover:shadow-[0_12px_36px_rgba(37,99,235,0.1),0_2px_8px_rgba(15,23,42,0.04)]
        transition-[box-shadow,border-color] duration-300
      "
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${t.orb} blur-2xl opacity-80`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-[12px] ${t.icon}`}>
          {Icon ? <Icon size={18} strokeWidth={1.9} /> : null}
        </div>
      </div>
      <p className="relative mt-4 text-[12.5px] font-medium text-secondaryText tracking-wide">
        {title}
      </p>
      <p className="relative mt-1 text-[28px] font-bold leading-none text-heading tracking-tight tabular-nums">
        {value}
      </p>
      {hint && (
        <p className="relative mt-2 text-[11.5px] text-secondaryText/90 leading-snug">{hint}</p>
      )}
    </motion.div>
  );
};

export default ReportStatCard;
