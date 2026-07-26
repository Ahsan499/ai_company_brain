import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cloud } from 'lucide-react';

const StorageCard = ({
  used = 7.2,
  total = 10,
  delay = 0,
}) => {
  const percent = Math.min(100, Math.round((used / total) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to="/dashboard/files"
        className="
          relative block overflow-hidden rounded-[16px] p-3.5 sm:p-4
          bg-gradient-to-br from-[#F8FAFC] via-white to-[#EFF6FF]/70
          border border-border/45
          shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_4px_14px_rgba(15,23,42,0.04)]
          transition-all duration-200
          hover:border-primary/25 hover:shadow-[0_8px_24px_rgba(37,99,235,0.1)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
        "
      >
        <div className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-primary/[0.06] blur-2xl" />

        <div className="relative flex items-start gap-3">
          <span
            className="
              flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px]
              bg-gradient-to-br from-[#EFF6FF] to-[#BFDBFE]
              text-primary
              ring-1 ring-primary/10
              shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_2px_6px_rgba(37,99,235,0.12)]
            "
          >
            <Cloud size={15} strokeWidth={1.95} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[13px] font-medium text-heading tracking-[-0.01em]">
                Storage
              </p>
              <p className="text-[11px] font-semibold text-primary tabular-nums tracking-tight">
                {percent}%
              </p>
            </div>
            <p className="mt-0.5 text-[11.5px] leading-snug text-secondaryText/85">
              <span className="font-medium text-heading/70 tabular-nums">{used} GB</span>
              {' '}of {total} GB used
            </p>
          </div>
        </div>

        <div className="relative mt-3.5 h-[7px] rounded-full bg-slate-100/90 overflow-hidden ring-1 ring-inset ring-slate-200/60">
          <motion.div
            className="
              relative h-full rounded-full
              bg-gradient-to-r from-[#1D4ED8] via-primary to-[#60A5FA]
              shadow-[0_0_12px_rgba(37,99,235,0.35)]
            "
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{
              delay: delay + 0.12,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span
              className="
                pointer-events-none absolute inset-0 overflow-hidden rounded-full
                bg-gradient-to-r from-transparent via-white/35 to-transparent
                animate-[profile-shimmer_2.4s_ease-in-out_infinite]
              "
              aria-hidden
            />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default StorageCard;
