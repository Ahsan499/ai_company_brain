import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Check, ImagePlus } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import SettingsSection from '../SettingsSection';
import DangerZoneCard from '../DangerZoneCard';
import { getOrganizationById } from '../../organizations/organizationData';
import { ORG_INDUSTRIES, ORG_SIZES } from '../settingsData';

const selectClass =
  'block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary hover:border-gray-400';

const OrganizationSettings = () => {
  const org = getOrganizationById('org-nova');
  const [form, setForm] = useState({
    name: org?.name || '',
    industry: org?.industry || ORG_INDUSTRIES[0],
    size: org?.size || ORG_SIZES[2],
    website: org?.website || '',
  });
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="space-y-5">
      <SettingsSection
        title="Organization"
        description="Workspace identity and company profile for NovaTech Solutions."
        action={
          <Button
            type="button"
            variant="primary"
            className="h-10 rounded-xl"
            onClick={() => {
              setSaved(true);
              window.setTimeout(() => setSaved(false), 2000);
            }}
          >
            {saved ? (
              <span className="inline-flex items-center gap-1.5">
                <Check size={15} /> Saved
              </span>
            ) : (
              'Save Changes'
            )}
          </Button>
        }
      >
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center mb-6 pb-6 border-b border-border/40">
          <button
            type="button"
            className="
              group relative flex h-20 w-20 items-center justify-center overflow-hidden
              rounded-[18px] bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8]
              text-white text-[20px] font-bold shadow-md ring-1 ring-primary/20
            "
            aria-label="Upload organization logo"
          >
            {org?.initials || 'NT'}
            <span className="absolute inset-0 flex items-center justify-center bg-heading/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <ImagePlus size={18} />
            </span>
          </button>
          <div>
            <p className="text-[14px] font-semibold text-heading inline-flex items-center gap-2">
              <Building2 size={15} className="text-primary" />
              {org?.name}
            </p>
            <p className="mt-1 text-[12.5px] text-secondaryText">
              Plan: {org?.plan} · {org?.memberCount} members
            </p>
            <p className="mt-2 text-[11.5px] text-slate-400">Square logo · PNG preferred (UI only)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Organization name" value={form.name} onChange={set('name')} />
          <Input label="Website" value={form.website} onChange={set('website')} />
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Industry</label>
            <select className={selectClass} value={form.industry} onChange={set('industry')}>
              {ORG_INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Company size</label>
            <select className={selectClass} value={form.size} onChange={set('size')}>
              {ORG_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </SettingsSection>

      <DangerZoneCard
        title="Delete organization"
        description="Remove this organization and all associated projects, teams, and files. Irreversible."
        actionLabel="Delete Organization"
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
              <h3 className="text-[16px] font-bold text-heading">Delete organization?</h3>
              <p className="mt-2 text-[13px] text-secondaryText leading-relaxed">
                Demo only — organization will not be deleted.
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
                  Confirm delete
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrganizationSettings;
