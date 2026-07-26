import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck, Settings, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationSearch from './NotificationSearch';
import NotificationTabs from './NotificationTabs';
import NotificationCard from './NotificationCard';
import EmptyNotifications from './EmptyNotifications';
import {
  DUMMY_NOTIFICATIONS,
  filterNotifications,
} from './notificationData';

const IconAction = ({ label, onClick, children, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`
      h-9 w-9 inline-flex items-center justify-center rounded-xl
      text-secondaryText
      hover:bg-slate-100/80 hover:text-heading
      transition-all duration-200
      focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
      ${className}
    `}
  >
    {children}
  </button>
);

const NotificationDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState(DUMMY_NOTIFICATIONS);

  const unreadCount = useMemo(
    () => items.filter((n) => n.unread).length,
    [items]
  );

  const filtered = useMemo(
    () => filterNotifications(items, { tab, query }),
    [items, tab, query]
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markOneRead = (notification) => {
    setItems((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, unread: false } : n))
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close notifications"
            className="fixed inset-0 z-[60] bg-heading/25 backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="notifications-title"
            className="
              fixed inset-y-0 right-0 z-[70]
              flex w-full sm:w-[80%] lg:w-[420px] flex-col
              bg-white/92 backdrop-blur-2xl
              border-l border-white/60 border-border/40
              shadow-[-20px_0_60px_rgba(15,23,42,0.12),-1px_0_0_rgba(255,255,255,0.5)_inset]
            "
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
          >
            {/* Header */}
            <div className="shrink-0 border-b border-border/40 bg-gradient-to-b from-white via-white to-slate-50/40 px-4 sm:px-5 pt-5 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary shadow-sm ring-1 ring-primary/10">
                    <Bell size={18} strokeWidth={2} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2
                        id="notifications-title"
                        className="text-[17px] sm:text-lg font-bold text-heading tracking-tight"
                      >
                        Notifications
                      </h2>
                      {unreadCount > 0 && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10.5px] font-semibold text-primary ring-1 ring-primary/12">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-secondaryText mt-0.5 leading-snug">
                      Stay on top of your workspace
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="
                      inline-flex items-center gap-1.5
                      rounded-xl px-2.5 py-2 text-[11.5px] font-semibold text-primary
                      hover:bg-primary/[0.06] transition-colors
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
                    "
                    title="Mark all as read"
                  >
                    <CheckCheck size={14} strokeWidth={2.25} />
                    <span className="hidden sm:inline">Mark all</span>
                  </button>
                  <IconAction label="Notification settings">
                    <Settings size={15} strokeWidth={1.85} />
                  </IconAction>
                  <IconAction label="Close" onClick={onClose}>
                    <X size={16} strokeWidth={1.85} />
                  </IconAction>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <NotificationSearch value={query} onChange={setQuery} />
                <NotificationTabs active={tab} onChange={setTab} />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto dashboard-scrollbar px-3.5 sm:px-4 py-3.5 space-y-2 bg-gradient-to-b from-slate-50/30 to-transparent">
              {filtered.length === 0 ? (
                <EmptyNotifications
                  onBack={() => {
                    onClose?.();
                    navigate('/dashboard');
                  }}
                />
              ) : (
                filtered.map((n, i) => (
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    delay={Math.min(i * 0.035, 0.28)}
                    onClick={markOneRead}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border/40 p-4 sm:p-5 bg-gradient-to-t from-slate-50/95 via-white/90 to-white/70 backdrop-blur-md">
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  onClose?.();
                  navigate('/dashboard/notifications');
                }}
                className="
                  w-full h-12 rounded-2xl
                  border border-border/50 bg-white
                  text-[13px] font-semibold text-heading
                  shadow-[0_1px_2px_rgba(15,23,42,0.04)]
                  hover:border-primary/25 hover:text-primary hover:bg-primary/[0.03]
                  hover:shadow-[0_6px_20px_rgba(37,99,235,0.08)]
                  transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
                "
              >
                View All Notifications
              </motion.button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDrawer;
