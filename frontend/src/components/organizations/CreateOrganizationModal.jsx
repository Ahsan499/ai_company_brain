import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useCreateOrganization } from '../../hooks/useOrganizations';
import { getApiErrorMessage, getApiFieldErrors } from '../../lib/api';

const INITIAL = {
  name: '',
  industry: '',
  size: '11–50',
  plan: 'growth',
  ownerEmail: '',
  website: '',
};

const CreateOrganizationForm = ({ onClose, onCreated }) => {
  const titleId = useId();
  const firstRef = useRef(null);
  const [form, setForm] = useState(INITIAL);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const createOrganization = useCreateOrganization();

  useEffect(() => {
    const t = window.setTimeout(() => firstRef.current?.focus(), 50);
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape' && !createOrganization.isPending) onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, createOrganization.isPending]);

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});
    try {
      const org = await createOrganization.mutateAsync({
        name: form.name,
        industry: form.industry || null,
        size: form.size,
        plan: form.plan,
        ownerEmail: form.ownerEmail || null,
        website: form.website || null,
      });
      onCreated?.(org);
      onClose?.();
    } catch (error) {
      setFieldErrors(getApiFieldErrors(error));
      setFormError(getApiErrorMessage(error, 'Could not create organization.'));
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      className="
        relative z-10 w-full sm:max-w-[520px]
        max-h-[92dvh] overflow-y-auto dashboard-scrollbar
        rounded-t-[24px] sm:rounded-[24px]
        border border-white/70 border-b-0 sm:border-b
        bg-white/95 backdrop-blur-2xl
        shadow-[0_24px_80px_rgba(15,23,42,0.2)]
        p-5 sm:p-6
        pb-[max(1.25rem,env(safe-area-inset-bottom))]
      "
    >
      <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-slate-200 sm:hidden" />

      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary ring-1 ring-primary/10">
            <Building2 size={18} strokeWidth={2} />
          </span>
          <div>
            <h2 id={titleId} className="text-[17px] font-semibold text-heading tracking-[-0.02em]">
              New Organization
            </h2>
            <p className="mt-0.5 text-[12.5px] text-secondaryText">
              Create a workspace for your company.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={createOrganization.isPending}
          className="h-9 w-9 inline-flex items-center justify-center rounded-xl text-secondaryText hover:bg-slate-100 hover:text-heading transition-colors"
          aria-label="Close"
        >
          <X size={17} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formError ? (
          <div role="alert" className="rounded-xl border border-error/20 bg-red-50 px-3.5 py-2.5 text-sm text-error">
            {formError}
          </div>
        ) : null}

        <Input
          ref={firstRef}
          label="Organization name"
          placeholder="e.g. NovaTech Solutions"
          value={form.name}
          onChange={set('name')}
          required
          error={fieldErrors.name}
          className="rounded-xl"
        />
        <Input
          label="Industry"
          placeholder="e.g. Software & SaaS"
          value={form.industry}
          onChange={set('industry')}
          error={fieldErrors.industry}
          className="rounded-xl"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Company size</label>
            <select
              value={form.size}
              onChange={set('size')}
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {['1–10', '11–50', '51–200', '201–500', '501–1000', '1000+'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Plan</label>
            <select
              value={form.plan}
              onChange={set('plan')}
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="scale">Scale</option>
              <option value="enterprise">Enterprise</option>
            </select>
            {fieldErrors.plan ? (
              <p className="mt-1.5 text-sm text-error">{fieldErrors.plan}</p>
            ) : null}
          </div>
        </div>
        <Input
          label="Owner email"
          type="email"
          placeholder="owner@company.com"
          value={form.ownerEmail}
          onChange={set('ownerEmail')}
          error={fieldErrors.ownerEmail || fieldErrors.owner_email}
          className="rounded-xl"
        />
        <Input
          label="Website"
          placeholder="company.com"
          value={form.website}
          onChange={set('website')}
          error={fieldErrors.website}
          className="rounded-xl"
        />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={createOrganization.isPending}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={createOrganization.isPending}
            className="rounded-xl shadow-[0_6px_16px_rgba(37,99,235,0.25)]"
          >
            Create Organization
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const CreateOrganizationModal = ({ open, onClose, onCreated }) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[85] flex items-end sm:items-center justify-center p-0 sm:p-6">
        <motion.button
          type="button"
          aria-label="Close dialog"
          className="absolute inset-0 bg-heading/25 backdrop-blur-[6px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <CreateOrganizationForm onClose={onClose} onCreated={onCreated} />
      </div>
    )}
  </AnimatePresence>
);

export default CreateOrganizationModal;
