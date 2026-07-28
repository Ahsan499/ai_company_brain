import React from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, CheckSquare, CalendarDays } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const STATS = [
  {
    label: 'Projects',
    value: '24',
    icon: FolderKanban,
    iconClass: 'bg-gradient-to-br from-[#EFF6FF] to-[#BFDBFE] text-[#2563EB]',
  },
  {
    label: 'Tasks',
    value: '189',
    icon: CheckSquare,
    iconClass: 'bg-gradient-to-br from-[#ECFDF5] to-[#A7F3D0] text-[#059669]',
  },
  {
    label: 'Meetings',
    value: '6',
    icon: CalendarDays,
    iconClass: 'bg-gradient-to-br from-[#FFFBEB] to-[#FDE68A] text-[#D97706]',
  },
];

const ProfileCard = ({
  name,
  role,
  email,
  initials,
  online = true,
}) => {
  const { user } = useAuth();
  const resolvedName = name || user?.name || 'User';
  const resolvedRole = role || user?.role || 'Member';
  const resolvedEmail = email || user?.email || 'user@example.com';
  const resolvedInitials = initials || user?.initials || 'U';

  return (
    <div
      className="
        relative overflow-hidden rounded-[20px] p-4 sm:p-[18px]
        bg-gradient-to-br from-[#EFF6FF]/95 via-white to-[#DBEAFE]/55
        ring-1 ring-inset ring-primary/[0.08]
        shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_8px_24px_rgba(37,99,235,0.06)]
      "
    >
      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.16)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.12)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      <div className="relative flex items-center gap-3.5 sm:gap-4">
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-primary/25 blur-md scale-110" aria-hidden />
          <div
            className="
              relative h-14 w-14
              rounded-full
              bg-gradient-to-br from-[#3B82F6] via-primary to-[#1E40AF]
              text-white text-[15px] font-semibold tracking-wide
              flex items-center justify-center
              shadow-[0_8px_20px_rgba(37,99,235,0.38),0_1px_0_rgba(255,255,255,0.35)_inset]
              ring-[3px] ring-white
            "
          >
            <span className="relative z-10 drop-shadow-sm">{resolvedInitials}</span>
            <span
              className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-white/25"
              aria-hidden
            />
          </div>
          {online && (
            <span
              className="
                absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full
                bg-success
                shadow-[0_0_0_2.5px_#fff,0_0_0_4px_rgba(16,185,129,0.25)]
              "
              aria-label="Online"
            />
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[15px] sm:text-[16px] font-semibold text-heading tracking-[-0.02em] leading-snug truncate">
            {resolvedName}
          </p>
          <p className="mt-1 text-[12px] font-medium text-primary/90 tracking-tight truncate">
            {resolvedRole}
          </p>
          <p className="mt-0.5 text-[12px] text-secondaryText/90 tracking-tight truncate">
            {resolvedEmail}
          </p>
        </div>
      </div>

      <div className="relative mt-4 grid grid-cols-3 gap-2 sm:gap-2.5">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.06 + i * 0.045,
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="
                group/stat rounded-[14px]
                bg-white/80 backdrop-blur-md
                border border-white/90
                px-1.5 py-2.5 sm:py-3 text-center
                shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.03)]
                hover:bg-white hover:shadow-[0_4px_16px_rgba(37,99,235,0.1)]
                hover:border-primary/10
                transition-[box-shadow,background-color,border-color] duration-200
              "
            >
              <span
                className={`
                  mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-[9px]
                  shadow-[0_1px_2px_rgba(15,23,42,0.04)]
                  transition-transform duration-200 group-hover/stat:scale-105
                  ${stat.iconClass}
                `}
              >
                <Icon size={13} strokeWidth={2.15} />
              </span>
              <p className="text-[14px] sm:text-[15px] font-semibold text-heading tabular-nums tracking-tight leading-none">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[10px] font-medium text-secondaryText/85 tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileCard;
