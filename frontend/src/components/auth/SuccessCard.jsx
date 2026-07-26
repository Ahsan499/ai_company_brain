import React from 'react';
import { motion } from 'framer-motion';

/**
 * Soft green success info list for auth completion screens.
 */
const SuccessCard = ({
  items = [],
  className = '',
}) => {
  return (
    <div
      className={`
        rounded-2xl bg-[#ECFDF5] border border-success/15
        px-4 py-4 sm:px-5 sm:py-5 space-y-4
        ${className}
      `}
      role="list"
      aria-label="Success details"
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            role="listitem"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
            className="flex items-start gap-3"
          >
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm border border-success/10">
              {Icon ? <Icon size={18} className="text-success" strokeWidth={2.25} /> : null}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-semibold text-heading leading-snug">
                {item.title}
              </p>
              <p className="mt-0.5 text-xs sm:text-sm text-secondaryText leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SuccessCard;
