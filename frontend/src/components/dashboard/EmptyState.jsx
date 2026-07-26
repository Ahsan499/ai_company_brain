import React from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

/**
 * Reusable empty state for lists / feeds.
 */
const EmptyState = ({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description = 'When activity appears, it will show up in this space.',
  action,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex flex-col items-center justify-center text-center px-4 py-10 ${className}`}
    role="status"
  >
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 text-primary">
      <Icon size={22} strokeWidth={1.75} />
    </div>
    <p className="text-sm font-semibold text-heading">{title}</p>
    <p className="mt-1 max-w-[240px] text-[13px] text-secondaryText leading-relaxed">
      {description}
    </p>
    {action && <div className="mt-4">{action}</div>}
  </motion.div>
);

export default EmptyState;
