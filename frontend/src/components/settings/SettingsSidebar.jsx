import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell,
  Building2,
  CreditCard,
  KeyRound,
  Shield,
  User,
} from 'lucide-react';
import { SETTINGS_NAV } from './settingsData';

const ICONS = {
  User,
  Building2,
  Shield,
  Bell,
  KeyRound,
  CreditCard,
};

const SettingsSidebar = () => (
  <>
    {/* Desktop vertical sub-nav */}
    <nav
      className="
        hidden lg:flex flex-col gap-0.5 shrink-0 w-[220px]
        rounded-[20px] border border-border/45 bg-white/90 p-2
        shadow-[0_2px_12px_rgba(15,23,42,0.04)]
        h-fit sticky top-4
      "
      aria-label="Settings sections"
    >
      {SETTINGS_NAV.map(({ to, label, icon }) => {
        const Icon = ICONS[icon] || User;
        return (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              relative flex items-center gap-2.5 rounded-[12px] px-3 py-2.5
              text-[13px] font-medium tracking-tight transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
              ${
                isActive
                  ? 'text-primary'
                  : 'text-secondaryText hover:bg-slate-50 hover:text-heading'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="settings-nav-pill"
                    className="absolute inset-0 rounded-[12px] bg-primary/[0.08] ring-1 ring-primary/10"
                    transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                  />
                )}
                <Icon
                  size={16}
                  strokeWidth={isActive ? 2.15 : 1.85}
                  className={`relative z-10 shrink-0 ${
                    isActive ? 'text-primary' : 'text-slate-400'
                  }`}
                />
                <span className="relative z-10 truncate">{label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>

    {/* Mobile horizontal tabs */}
    <nav
      className="
        lg:hidden -mx-1 flex gap-1 overflow-x-auto dashboard-scrollbar
        rounded-[14px] border border-border/45 bg-slate-100/70 p-1
      "
      aria-label="Settings sections"
    >
      {SETTINGS_NAV.map(({ to, label, icon }) => {
        const Icon = ICONS[icon] || User;
        return (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              relative shrink-0 inline-flex items-center gap-1.5 rounded-[11px]
              px-3 py-2 text-[12px] font-semibold tracking-tight
              ${isActive ? 'text-primary' : 'text-secondaryText'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="settings-tab-pill"
                    className="absolute inset-0 rounded-[11px] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)] ring-1 ring-primary/10"
                    transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                  />
                )}
                <Icon size={14} className="relative z-10" />
                <span className="relative z-10 whitespace-nowrap">{label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  </>
);

export default SettingsSidebar;
