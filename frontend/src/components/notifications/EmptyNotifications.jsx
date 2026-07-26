import React from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

const EmptyNotifications = ({ onBack, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col items-center justify-center text-center px-6 py-16 ${className}`}
      role="status"
    >
      <div className="relative mb-6">
        <motion.div
          className="absolute inset-0 rounded-[28px] bg-primary/15 blur-2xl"
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative flex h-[88px] w-[88px] items-center justify-center rounded-[28px] bg-gradient-to-br from-[#EFF6FF] via-white to-[#DBEAFE] text-primary shadow-[0_8px_30px_rgba(37,99,235,0.12)] ring-1 ring-primary/10">
          <BellOff size={36} strokeWidth={1.4} />
        </div>
        <span className="absolute -right-1.5 -top-1.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-primary shadow-[0_4px_14px_rgba(15,23,42,0.1)] ring-1 ring-border/50">
          <Bell size={15} strokeWidth={2} />
        </span>
        <span className="absolute -left-2 bottom-1 flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#1D4ED8] text-white shadow-md">
          <Sparkles size={12} />
        </span>
      </div>

      <h3 className="text-[17px] sm:text-lg font-bold text-heading tracking-tight">
        No Notifications
      </h3>
      <p className="mt-2 max-w-[280px] text-[13px] text-secondaryText leading-relaxed">
        You&apos;re all caught up. New updates from your workspace will appear here.
      </p>

      {onBack && (
        <Button
          type="button"
          onClick={onBack}
          className="
            mt-6 h-11 rounded-xl px-5 text-[13px] font-semibold
            bg-gradient-to-r from-primary to-[#1D4ED8] border-0
            shadow-[0_4px_16px_rgba(37,99,235,0.28)]
            hover:shadow-[0_6px_20px_rgba(37,99,235,0.36)]
          "
        >
          Back to Dashboard
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyNotifications;
