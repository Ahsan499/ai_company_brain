import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Users,
  Network,
  FolderKanban,
  CheckSquare,
  UsersRound,
  Video,
  Timer,
  Files,
  Bell,
  BarChart3,
  ScrollText,
  Settings,
  UserRound,
  LogOut,
  X,
} from 'lucide-react';
import Logo from '../ui/Logo';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/organizations', label: 'Organizations', icon: Building2 },
  { to: '/dashboard/users', label: 'Users', icon: Users },
  { to: '/dashboard/departments', label: 'Departments', icon: Network },
  { to: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { to: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/dashboard/teams', label: 'Teams', icon: UsersRound },
  { to: '/dashboard/meetings', label: 'Meetings', icon: Video },
  { to: '/dashboard/time-tracking', label: 'Time Tracking', icon: Timer },
  { to: '/dashboard/files', label: 'Files', icon: Files },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { to: '#reports', label: 'Reports', icon: BarChart3 },
  { to: '#audit-logs', label: 'Audit Logs', icon: ScrollText },
  { to: '#settings', label: 'Settings', icon: Settings },
  { to: '#profile', label: 'Profile', icon: UserRound },
];

const SidebarContent = ({ onNavigate }) => (
  <div className="flex h-full flex-col">
    <div className="px-5 pt-6 pb-5 shrink-0 border-b border-border/40">
      <Logo iconSize={26} tagline="Smart. Organized. Productive." />
    </div>

    <nav
      className="flex-1 overflow-y-auto dashboard-scrollbar px-3 py-4 space-y-0.5"
      aria-label="Main"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => {
        const isPlaceholder = to.startsWith('#');
        return (
          <NavLink
            key={label}
            to={to}
            end={Boolean(end)}
            onClick={(e) => {
              if (isPlaceholder) e.preventDefault();
              onNavigate?.();
            }}
            className={({ isActive }) => {
              const active = !isPlaceholder && isActive;
              return `
                group relative flex items-center gap-3 rounded-xl px-3 py-2.5
                text-[13px] font-medium tracking-tight
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
                ${
                  active
                    ? 'bg-primary/[0.08] text-primary shadow-[inset_0_0_0_1px_rgba(37,99,235,0.08)]'
                    : 'text-secondaryText hover:bg-slate-50 hover:text-heading'
                }
              `;
            }}
          >
            {({ isActive }) => {
              const active = !isPlaceholder && isActive;
              return (
                <>
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-primary"
                    />
                  )}
                  <Icon
                    size={17}
                    strokeWidth={active ? 2.15 : 1.85}
                    className={`shrink-0 transition-colors ${
                      active ? 'text-primary' : 'text-slate-400 group-hover:text-heading'
                    }`}
                  />
                  <span className="truncate">{label}</span>
                </>
              );
            }}
          </NavLink>
        );
      })}
    </nav>

    <div className="shrink-0 border-t border-border/50 p-4 space-y-2.5 bg-gradient-to-t from-slate-50/80 to-transparent">
      <div className="flex items-center gap-3 rounded-2xl bg-white/90 border border-border/50 px-3 py-3 shadow-sm">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] flex items-center justify-center text-white text-[12px] font-semibold shrink-0 ring-2 ring-primary/10">
          AH
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-heading truncate">Ahsan Hassan</p>
          <p className="text-[11px] text-secondaryText truncate">Admin · Workspace</p>
        </div>
      </div>
      <button
        type="button"
        className="
          flex w-full items-center gap-3 rounded-xl px-3 py-2.5
          text-[13px] font-medium text-error/90
          hover:bg-red-50 hover:text-error transition-colors
          focus:outline-none focus-visible:ring-2 focus-visible:ring-error/20
        "
      >
        <LogOut size={16} strokeWidth={1.85} />
        Logout
      </button>
    </div>
  </div>
);

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      <aside
        className="
          hidden lg:flex lg:flex-col
          fixed inset-y-3 left-3 z-30
          w-[280px]
          rounded-[20px]
          bg-white/90 backdrop-blur-xl
          border border-white/60 border-border/40
          shadow-[0_8px_40px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)]
          overflow-hidden
        "
        aria-label="Sidebar"
      >
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close sidebar"
              className="fixed inset-0 z-40 bg-heading/35 backdrop-blur-[3px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className="
                fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw]
                bg-white/95 backdrop-blur-xl shadow-2xl lg:hidden
                flex flex-col overflow-hidden border-r border-border/40
              "
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              aria-label="Mobile sidebar"
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl text-secondaryText hover:bg-slate-100 hover:text-heading transition-colors z-10"
                aria-label="Close menu"
              >
                <X size={17} />
              </button>
              <SidebarContent onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
