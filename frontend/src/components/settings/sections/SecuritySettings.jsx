import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import PasswordStrength from '../../auth/PasswordStrength';
import SettingsSection from '../SettingsSection';
import ToggleRow from '../ToggleRow';
import SessionRow from '../SessionRow';
import { ACTIVE_SESSIONS } from '../settingsData';

const strengthFromPassword = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score += 1;
  if (/[A-Z]/.test(pwd)) score += 1;
  if (/[a-z]/.test(pwd) && /\d/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  return { segmentsFilled: score, label: labels[Math.max(0, score - 1)] || 'Weak' };
};

const SecuritySettings = () => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessions, setSessions] = useState(ACTIVE_SESSIONS);
  const [toast, setToast] = useState('');

  const strength = useMemo(() => strengthFromPassword(next), [next]);

  const flash = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 2000);
  };

  return (
    <div className="space-y-5">
      <SettingsSection
        title="Security"
        description="Password, two-factor authentication, and active sessions."
      >
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Password change is currently UI-only until a backend password endpoint is added.
        </p>
        <h3 className="text-[14px] font-semibold text-heading mb-3">Change password</h3>
        <div className="grid grid-cols-1 gap-4 max-w-lg">
          <Input
            label="Current password"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <Input
            label="New password"
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          <Input
            label="Confirm new password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          {next && (
            <PasswordStrength
              segmentsFilled={strength.segmentsFilled}
              label={strength.label}
            />
          )}
          <Button
            type="button"
            variant="primary"
            className="h-10 rounded-xl w-fit"
            onClick={() => {
              setCurrent('');
              setNext('');
              setConfirm('');
              flash('Password updated (demo)');
            }}
          >
            Update password
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40">
          <h3 className="text-[14px] font-semibold text-heading mb-1">Two-factor authentication</h3>
          <ToggleRow
            id="two-factor"
            label="Require 2FA on login"
            description="Use an authenticator app for an extra verification step"
            checked={twoFactor}
            onChange={setTwoFactor}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Active sessions"
        description="Devices currently signed in to your account."
      >
        <div className="space-y-2.5">
          {sessions.map((s) => (
            <SessionRow
              key={s.id}
              session={s}
              onRevoke={(id) => {
                setSessions((prev) => prev.filter((x) => x.id !== id));
                flash('Session revoked (demo)');
              }}
            />
          ))}
          {sessions.length === 0 && (
            <p className="text-[13px] text-secondaryText py-2">No other sessions.</p>
          )}
        </div>
      </SettingsSection>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 inline-flex items-center gap-2 rounded-2xl bg-heading px-4 py-2.5 text-[13px] font-medium text-white shadow-xl"
          >
            <Check size={14} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecuritySettings;
