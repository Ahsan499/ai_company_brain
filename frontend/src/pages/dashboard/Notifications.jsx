import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationSearch from '../../components/notifications/NotificationSearch';
import NotificationTabs from '../../components/notifications/NotificationTabs';
import NotificationCard from '../../components/notifications/NotificationCard';
import EmptyNotifications from '../../components/notifications/EmptyNotifications';
import { filterNotifications } from '../../components/notifications/notificationData';
import Button from '../../components/ui/Button';
import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
  useUnreadCount,
} from '../../hooks/useNotifications';

const Notifications = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');

  const { data, isLoading } = useNotifications({ perPage: 50 });
  const { data: unreadCount = 0 } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const items = data?.data ?? [];

  const filtered = useMemo(
    () => filterNotifications(items, { tab, query }),
    [items, tab, query]
  );

  const handleClick = (notification) => {
    if (notification.unread) {
      markAsRead.mutate(notification.id);
    }
    if (notification.url) {
      navigate(notification.url);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5 sm:space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary shadow-sm ring-1 ring-primary/10">
              <Bell size={17} strokeWidth={2} />
            </span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-primary/12">
                {unreadCount} New
              </span>
            )}
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-heading tracking-tight leading-tight">
            Notifications
          </h1>
          <p className="mt-1.5 text-[13px] sm:text-[14px] text-secondaryText leading-relaxed max-w-md">
            Review mentions, projects, meetings and system updates.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            className="h-10 rounded-xl gap-2 text-[13px] font-semibold bg-white/85 backdrop-blur-sm shadow-sm"
            disabled={unreadCount === 0 || markAllAsRead.isPending}
            onClick={() => markAllAsRead.mutate()}
          >
            <CheckCheck size={15} strokeWidth={2.1} />
            Mark all as read
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-10 w-10 rounded-xl p-0 justify-center bg-white/85 backdrop-blur-sm shadow-sm"
            aria-label="Settings"
            onClick={() => navigate('/dashboard/settings/notifications')}
          >
            <Settings size={15} strokeWidth={1.85} />
          </Button>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="
          rounded-[20px] border border-border/40 bg-white/85 backdrop-blur-md
          p-4 sm:p-5 space-y-3.5
          shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)]
        "
      >
        <NotificationSearch value={query} onChange={setQuery} />
        <NotificationTabs active={tab} onChange={setTab} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="
          rounded-[20px] border border-border/40 bg-white/85 backdrop-blur-md
          p-3.5 sm:p-4 space-y-2
          shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)]
          min-h-[380px]
        "
      >
        {isLoading ? (
          <p className="py-10 text-center text-sm text-secondaryText">Loading…</p>
        ) : filtered.length === 0 ? (
          <EmptyNotifications onBack={() => navigate('/dashboard')} />
        ) : (
          filtered.map((n, i) => (
            <NotificationCard
              key={n.id}
              notification={n}
              delay={Math.min(i * 0.03, 0.24)}
              onClick={handleClick}
            />
          ))
        )}
      </motion.div>
    </div>
  );
};

export default Notifications;
