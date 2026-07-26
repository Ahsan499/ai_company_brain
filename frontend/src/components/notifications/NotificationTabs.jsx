import React from 'react';
import { motion } from 'framer-motion';
import { NOTIFICATION_TABS } from './notificationData';

const NotificationTabs = ({ active = 'all', onChange, tabs = NOTIFICATION_TABS }) => {
  return (
    <div
      className="
        relative flex gap-0.5 overflow-x-auto dashboard-scrollbar
        rounded-2xl bg-slate-100/80 p-1
        ring-1 ring-inset ring-slate-200/60
      "
      role="tablist"
      aria-label="Notification filters"
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(tab.id)}
            className={`
              relative shrink-0 rounded-xl px-3 sm:px-3.5 py-2
              text-[11px] sm:text-[12px] font-semibold tracking-tight
              transition-colors duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-1
              ${isActive ? 'text-primary' : 'text-secondaryText hover:text-heading'}
            `}
          >
            {isActive && (
              <motion.span
                layoutId="notif-tab-pill"
                className="
                  absolute inset-0 rounded-xl bg-white
                  shadow-[0_1px_3px_rgba(15,23,42,0.08),0_0_0_1px_rgba(37,99,235,0.06)]
                "
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default NotificationTabs;
