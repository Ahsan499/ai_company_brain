import React from 'react';
import { motion } from 'framer-motion';

const BASE =
  'rounded-[20px] border border-border/40 bg-white/80 backdrop-blur-sm ' +
  'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)] ' +
  'transition-[box-shadow,border-color,transform] duration-300 ' +
  'hover:border-primary/15 hover:shadow-[0_8px_30px_rgba(37,99,235,0.08),0_2px_8px_rgba(15,23,42,0.04)]';

/**
 * Shared premium panel shell for dashboard widgets.
 */
const DashboardPanel = ({
  children,
  className = '',
  delay = 0,
  padding = 'p-5 sm:p-6',
  hoverLift = true,
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    whileHover={hoverLift ? { y: -2 } : undefined}
    className={`${BASE} ${padding} ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

export const PanelHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
    <div className="min-w-0">
      <h3 className="text-[15px] sm:text-base font-semibold text-heading tracking-tight">
        {title}
      </h3>
      {subtitle && (
        <p className="text-[12px] sm:text-[13px] text-secondaryText mt-0.5 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
    {action}
  </div>
);

export default DashboardPanel;
