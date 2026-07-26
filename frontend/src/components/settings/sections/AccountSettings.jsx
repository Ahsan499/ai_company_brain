import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Check } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import SettingsSection from '../SettingsSection';
import DangerZoneCard from '../DangerZoneCard';
import { getUserById } from '../../users/userData';
import { JOB_TITLES, LANGUAGES, TIMEZONES } from '../settingsData';

const selectClass =
  'block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary hover:border-gray-400';

const AccountSettings = () => {
  const user = getUserById('usr-ahsan');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    jobTitle: 'Super Administrator',
    timezone: TIMEZONES[0],
    language: 'en',
  });
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <SettingsSection
        title="Account"
        description="Manage your personal profile and preferences."
        action={
          <Button type="button" variant="primary" className="h-10 rounded-xl gap-2" onClick={handleSave}>
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.span
                  key="ok"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-1.5"
                >
                  <Check size={15} />
                  Saved
                </motion.span>
              ) : (
                <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Save Changes
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        }
      >
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center mb-6 pb-6 border-b border-border/40">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[22px] font-semibold ring-4 ring-primary/10 shadow-md">
              {user?.initials || 'AT'}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-md ring-1 ring-border/60 hover:bg-slate-50"
              aria-label="Upload photo"
            >
              <Camera size={14} />
            </button>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-heading">{user?.name}</p>
            <p className="text-[12.5px] text-secondaryText">{user?.role} · {user?.organizationName}</p>
            <p className="mt-2 text-[11.5px] text-slate-400">JPG or PNG · max 2MB (UI only)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full name" value={form.name} onChange={set('name')} />
          <Input label="Email" type="email" value={form.email} onChange={set('email')} />
          <Input label="Phone" value={form.phone} onChange={set('phone')} />
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Job title</label>
            <select className={selectClass} value={form.jobTitle} onChange={set('jobTitle')}>
              {JOB_TITLES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Timezone</label>
            <select className={selectClass} value={form.timezone} onChange={set('timezone')}>
              {TIMEZONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Language</label>
            <select className={selectClass} value={form.language} onChange={set('language')}>
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </SettingsSection>

      <DangerZoneCard
        title="Delete account"
        description="Permanently remove your account and personal data from this workspace. This cannot be undone."
        actionLabel="Delete Account"
        onAction={() => setDeleteOpen(true)}
      />

      <AnimatePresence>
        {deleteOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close"
              className="fixed inset-0 z-[70] bg-heading/25 backdrop-blur-[4px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="
                fixed left-1/2 top-1/2 z-[80] w-[min(420px,92vw)] -translate-x-1/2 -translate-y-1/2
                rounded-[20px] border border-border/50 bg-white p-5 shadow-2xl
              "
            >
              <h3 className="text-[16px] font-bold text-heading">Delete account?</h3>
              <p className="mt-2 text-[13px] text-secondaryText leading-relaxed">
                Demo only — no account will be deleted. Confirm closes this dialog.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <Button type="button" variant="secondary" className="rounded-xl" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="rounded-xl bg-error text-white hover:bg-rose-600"
                  onClick={() => setDeleteOpen(false)}
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountSettings;
