import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  UserRound,
  Settings,
  Bell,
  Palette,
  Languages,
  HelpCircle,
  Keyboard,
  LogOut,
  IdCard,
} from 'lucide-react';
import ProfileCard from './ProfileCard';
import ProfileMenuItem from './ProfileMenuItem';
import ThemeSwitcher from './ThemeSwitcher';
import StorageCard from './StorageCard';
import { useAuth } from '../../context/AuthContext';

const SectionLabel = ({ children }) => (
  <p className="px-2.5 mb-1 mt-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400/90">
    {children}
  </p>
);

/**
 * Premium profile menu — desktop dropdown / mobile bottom sheet.
 */
const ProfileDropdown = ({ open, onClose, anchorRef }) => {
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const { logout } = useAuth();

  const go = (path) => {
    onClose?.();
    if (path) navigate(path);
  };

  const handleLogout = async () => {
    onClose?.();
    await logout();
  };

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    const onPointer = (e) => {
      const panel = panelRef.current;
      const anchor = anchorRef?.current;
      if (panel?.contains(e.target) || anchor?.contains(e.target)) return;
      onClose?.();
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [open, onClose, anchorRef]);

  useEffect(() => {
    if (!open) return undefined;
    const mq = window.matchMedia('(max-width: 639px)');
    if (mq.matches) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close profile menu"
            className="fixed inset-0 z-[55] bg-heading/20 backdrop-blur-[4px] sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            role="menu"
            aria-label="User profile menu"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 460, damping: 34, mass: 0.85 }}
            style={{ transformOrigin: 'top right' }}
            className="
              fixed inset-x-0 bottom-0 z-[60]
              max-h-[min(88dvh,720px)] overflow-y-auto dashboard-scrollbar
              rounded-t-[24px] sm:rounded-[24px]
              sm:absolute sm:inset-auto sm:right-0 sm:top-[calc(100%+10px)]
              sm:bottom-auto sm:left-auto
              sm:w-[320px] lg:w-[340px] sm:max-h-[min(80vh,720px)]
              border border-white/60 border-b-0 sm:border-b sm:border-border/40
              bg-white/88 backdrop-blur-2xl
              p-4 sm:p-5
              pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-5
              shadow-[0_-12px_48px_rgba(15,23,42,0.14)]
              sm:shadow-[0_0_0_1px_rgba(15,23,42,0.04),0_4px_8px_rgba(15,23,42,0.03),0_20px_48px_rgba(15,23,42,0.12)]
            "
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-[24px] bg-gradient-to-b from-white/70 to-transparent sm:rounded-t-[24px]"
              aria-hidden
            />

            <div className="relative mx-auto mb-3.5 h-1 w-9 rounded-full bg-slate-300/70 sm:hidden" />

            <div className="relative space-y-1">
              <ProfileCard />

              <div className="pt-3.5">
                <SectionLabel>Account</SectionLabel>
                <div className="space-y-px">
                  <ProfileMenuItem
                    icon={IdCard}
                    title="View Full Profile"
                    description="Public member profile"
                    delay={0.05}
                    onClick={() => go('/dashboard/profile')}
                  />
                  <ProfileMenuItem
                    icon={UserRound}
                    title="My Profile"
                    description="Manage your account"
                    delay={0.078}
                    onClick={() => go('/dashboard/settings/account')}
                  />
                  <ProfileMenuItem
                    icon={Settings}
                    title="Account Settings"
                    description="Preferences & Security"
                    delay={0.106}
                    onClick={() => go('/dashboard/settings')}
                  />
                  <ProfileMenuItem
                    icon={Bell}
                    title="Notifications"
                    description="Manage notifications"
                    delay={0.134}
                    onClick={() => go('/dashboard/settings/notifications')}
                  />
                </div>
              </div>

              <div className="pt-2">
                <SectionLabel>Preferences</SectionLabel>
                <div className="space-y-px">
                  <ProfileMenuItem
                    icon={Palette}
                    title="Appearance"
                    description="Light / Dark Mode"
                    delay={0.15}
                    onClick={onClose}
                  />
                  <ProfileMenuItem
                    icon={Languages}
                    title="Language"
                    description="English"
                    delay={0.178}
                    onClick={onClose}
                  />
                </div>
              </div>

              <div className="pt-2">
                <SectionLabel>Support</SectionLabel>
                <div className="space-y-px">
                  <ProfileMenuItem
                    icon={HelpCircle}
                    title="Help Center"
                    description="Documentation & Support"
                    delay={0.2}
                    onClick={onClose}
                  />
                  <ProfileMenuItem
                    icon={Keyboard}
                    title="Keyboard Shortcuts"
                    description="View shortcuts"
                    delay={0.228}
                    onClick={onClose}
                  />
                </div>
              </div>

              <div className="pt-3 space-y-3">
                <div>
                  <SectionLabel>Theme</SectionLabel>
                  <ThemeSwitcher value={theme} onChange={setTheme} />
                </div>

                <StorageCard delay={0.22} />
              </div>

              <div className="mt-3.5 border-t border-border/45 pt-3">
                <motion.button
                  type="button"
                  role="menuitem"
                  whileHover={{ x: 1 }}
                  whileTap={{ scale: 0.992 }}
                  onClick={handleLogout}
                  className="
                    group flex w-full items-center gap-3
                    rounded-[14px] px-2.5 py-2 sm:py-[9px]
                    text-left text-error
                    hover:bg-red-50/90
                    active:bg-red-50
                    transition-colors duration-150
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-error/20 focus-visible:ring-offset-1
                  "
                >
                  <span
                    className="
                      flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px]
                      bg-gradient-to-b from-red-50 to-red-100/70
                      text-error
                      ring-1 ring-error/12
                      shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]
                      transition-transform duration-200
                      group-hover:rotate-[-6deg] group-hover:scale-[1.03]
                    "
                  >
                    <LogOut size={15} strokeWidth={1.95} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-medium tracking-[-0.01em]">
                      Logout
                    </span>
                    <span className="mt-0.5 block text-[11.5px] leading-snug text-error/65">
                      Sign out of AI Company Brain
                    </span>
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;
