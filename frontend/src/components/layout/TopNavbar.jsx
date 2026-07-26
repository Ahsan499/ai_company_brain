import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Bell,
  MessageSquare,
  Moon,
  Plus,
  Menu,
  ChevronDown,
} from 'lucide-react';
import ProfileDropdown from '../profile/ProfileDropdown';

const IconButton = ({ children, className = '', label, ...props }) => (
  <button
    type="button"
    aria-label={label}
    className={`
      relative inline-flex items-center justify-center
      h-10 w-10 rounded-xl text-secondaryText
      hover:bg-white/90 hover:text-heading
      border border-transparent hover:border-border/60
      shadow-none hover:shadow-sm
      transition-all duration-200
      focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

const TopNavbar = ({ onMenuClick, onNotificationsClick, onSearchClick }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileTriggerRef = useRef(null);

  const isMac =
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || '');

  return (
    <header
      className="
        sticky top-0 z-20 h-16 sm:h-20
        flex items-center gap-2.5 sm:gap-4
        px-3 sm:px-6
        bg-white/65 backdrop-blur-2xl
        border-b border-white/50 border-border/40
        shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]
      "
    >
      <IconButton label="Open sidebar" onClick={onMenuClick} className="lg:hidden">
        <Menu size={18} strokeWidth={1.85} />
      </IconButton>

      <button
        type="button"
        onClick={onSearchClick}
        className="
          group relative flex-1 max-w-xl h-10 sm:h-11
          flex items-center gap-2.5 rounded-xl
          border border-border/60 bg-white/70
          pl-3.5 pr-2.5
          text-left
          shadow-[0_1px_2px_rgba(15,23,42,0.03)]
          hover:bg-white hover:border-primary/25
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20
          transition-all duration-200
        "
        aria-label="Open search"
      >
        <Search
          size={16}
          strokeWidth={1.85}
          className="shrink-0 text-slate-400 transition-colors group-hover:text-primary"
        />
        <span className="flex-1 truncate text-[13px] sm:text-sm text-slate-400">
          Search projects, users, meetings...
        </span>
        <kbd
          className="
            hidden sm:inline-flex items-center gap-0.5 shrink-0
            rounded-md border border-border/70 bg-slate-50
            px-1.5 py-0.5
            text-[10.5px] font-semibold text-secondaryText
          "
        >
          {isMac ? '⌘' : 'Ctrl'}K
        </kbd>
      </button>

      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <IconButton label="Notifications" onClick={onNotificationsClick}>
          <Bell size={17} strokeWidth={1.85} />
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error/80 opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-error ring-2 ring-white" />
          </span>
        </IconButton>

        <IconButton label="Messages" className="hidden sm:inline-flex">
          <MessageSquare size={17} strokeWidth={1.85} />
        </IconButton>

        <IconButton label="Toggle dark mode" className="hidden md:inline-flex">
          <Moon size={17} strokeWidth={1.85} />
        </IconButton>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="
            hidden sm:inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl
            bg-gradient-to-r from-primary to-[#1D4ED8] text-white text-[13px] font-semibold
            shadow-[0_4px_14px_rgba(37,99,235,0.28)]
            hover:shadow-[0_6px_18px_rgba(37,99,235,0.38)]
            transition-shadow
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2
          "
        >
          <Plus size={15} strokeWidth={2.25} />
          <span className="hidden md:inline">Quick Add</span>
        </motion.button>

        <div className="relative ml-0.5">
          <button
            ref={profileTriggerRef}
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            className={`
              flex items-center gap-1.5 sm:gap-2 pl-1 pr-1.5 sm:pr-2 py-1 rounded-xl
              border transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
              ${
                profileOpen
                  ? 'bg-white border-border/70 shadow-sm'
                  : 'hover:bg-white/90 border-transparent hover:border-border/60'
              }
            `}
            aria-label="User menu"
          >
            <div className="relative">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-[#3B82F6] via-primary to-[#1E40AF] flex items-center justify-center text-white text-[11px] font-semibold ring-2 ring-white shadow-[0_2px_8px_rgba(37,99,235,0.35)]">
                AT
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success shadow-[0_0_0_2px_#fff]" />
            </div>
            <motion.span
              animate={{ rotate: profileOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="hidden sm:block text-slate-400"
            >
              <ChevronDown size={14} />
            </motion.span>
          </button>

          <ProfileDropdown
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            anchorRef={profileTriggerRef}
          />
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
