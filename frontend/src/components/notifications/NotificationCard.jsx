import React from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  CheckCircle2,
  CalendarDays,
  Paperclip,
  AlertTriangle,
  Settings,
  AtSign,
  UserPlus,
} from 'lucide-react';
import { AVATAR_TONES, NOTIFICATION_CATEGORIES } from './notificationData';

const CATEGORY_ICONS = {
  project: FolderKanban,
  task: CheckCircle2,
  meeting: CalendarDays,
  files: Paperclip,
  alert: AlertTriangle,
  system: Settings,
  mention: AtSign,
};

const NotificationCard = ({ notification, onClick, delay = 0 }) => {
  const { title, description, time, unread, category, avatar } = notification;

  const meta = NOTIFICATION_CATEGORIES[category] || NOTIFICATION_CATEGORIES.system;
  const Icon = CATEGORY_ICONS[category] || UserPlus;
  const avatarTone = AVATAR_TONES[avatar] || AVATAR_TONES.SY;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      onClick={() => onClick?.(notification)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(notification);
        }
      }}
      className={`
        group relative cursor-pointer rounded-[18px] p-3.5 sm:p-[15px]
        border transition-all duration-250
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-1
        ${
          unread
            ? `
              bg-gradient-to-br from-[#DBEAFE]/90 via-[#EFF6FF]/95 to-white
              border-primary/20 border-l-[3px] border-l-primary
              shadow-[0_4px_18px_rgba(37,99,235,0.08)]
              hover:shadow-[0_8px_28px_rgba(37,99,235,0.12)]
              hover:border-primary/30
            `
            : `
              bg-white/90 border-border/45
              hover:bg-white hover:border-slate-300/80
              hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]
            `
        }
      `}
    >
      <div className="flex gap-3 sm:gap-3.5">
        <div className="relative shrink-0 pt-0.5">
          <div
            className={`
              h-10 w-10 sm:h-11 sm:w-11 rounded-full
              bg-gradient-to-br ${avatarTone}
              text-white text-[11px] font-semibold tracking-wide
              flex items-center justify-center
              ring-[2.5px] ring-white
              shadow-[0_2px_8px_rgba(15,23,42,0.12)]
              transition-transform duration-200 group-hover:scale-[1.03]
            `}
          >
            {avatar}
          </div>
          <span
            className={`
              absolute -bottom-0.5 -right-0.5
              flex h-[18px] w-[18px] items-center justify-center rounded-full
              ${meta.iconBg}
              ring-[2px] ring-white
              shadow-sm
            `}
          >
            <Icon size={10} strokeWidth={2.4} />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2.5">
            <p
              className={`
                text-[13px] sm:text-[13.5px] leading-snug tracking-tight
                ${unread ? 'font-semibold text-heading' : 'font-medium text-heading/90'}
              `}
            >
              {title}
            </p>
            <div className="flex items-center gap-2 shrink-0 pt-0.5">
              <span className="text-[10.5px] sm:text-[11px] font-medium text-slate-400 tabular-nums">
                {time}
              </span>
              {unread && (
                <span className="relative flex h-2 w-2" aria-label="Unread">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/70 opacity-50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_0_2px_rgba(37,99,235,0.15)]" />
                </span>
              )}
            </div>
          </div>

          <p className="mt-1 text-[12px] sm:text-[12.5px] text-secondaryText leading-relaxed line-clamp-2">
            {description}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span
              className={`
                inline-flex items-center rounded-full px-2 py-[3px]
                text-[10px] font-semibold tracking-wide ring-1
                ${meta.badge}
              `}
            >
              {meta.label}
            </span>
            {unread && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-primary/80">
                New
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default NotificationCard;
