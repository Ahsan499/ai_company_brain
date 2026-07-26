import { motion } from 'framer-motion';

const SettingsSection = ({
  title,
  description,
  action,
  children,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    className={`space-y-5 ${className}`}
  >
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-[20px] sm:text-[22px] font-bold text-heading tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-1 max-w-xl text-[13px] sm:text-[14px] text-secondaryText leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>

    <div
      className="
        rounded-[20px] border border-border/45 bg-white/90
        p-4 sm:p-6
        shadow-[0_2px_12px_rgba(15,23,42,0.04)]
      "
    >
      {children}
    </div>
  </motion.div>
);

export default SettingsSection;
