import { motion } from 'framer-motion';

const ProjectProgressBar = ({
  value = 0,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  const height = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-secondaryText">Progress</span>
          <span className="text-[11px] font-semibold text-primary tabular-nums">{pct}%</span>
        </div>
      )}
      <div
        className={`${height} w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200/60`}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#1D4ED8] via-primary to-[#60A5FA]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
};

export default ProjectProgressBar;
