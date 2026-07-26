import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Network, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useOrganizations } from '../../hooks/useOrganizations';
import { useUsers } from '../../hooks/useUsers';
import { useCreateDepartment } from '../../hooks/useDepartments';
import { getApiErrorMessage, getApiFieldErrors } from '../../lib/api';

const CreateDepartmentForm = ({ onClose, onCreated }) => {
  const titleId = useId();
  const firstRef = useRef(null);
  const { data: orgsData } = useOrganizations({ perPage: 100, page: 1 });
  const organizations = orgsData?.data ?? [];
  const createDepartment = useCreateDepartment();

  const [form, setForm] = useState({
    name: '',
    organizationId: '',
    managerId: '',
    description: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');

  const { data: usersData } = useUsers({
    organizationId: form.organizationId || 'all',
    perPage: 100,
    page: 1,
  });
  const managers = usersData?.data ?? [];

  useEffect(() => {
    if (!form.organizationId && organizations[0]?.id) {
      setForm((prev) => ({ ...prev, organizationId: String(organizations[0].id) }));
    }
  }, [organizations, form.organizationId]);

  useEffect(() => {
    if (!form.managerId && managers[0]?.id) {
      setForm((prev) => ({ ...prev, managerId: String(managers[0].id) }));
    }
  }, [managers, form.managerId]);

  useEffect(() => {
    const t = window.setTimeout(() => firstRef.current?.focus(), 50);
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape' && !createDepartment.isPending) onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, createDepartment.isPending]);

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      if (key === 'organizationId') {
        return { ...prev, organizationId: value, managerId: '' };
      }
      return { ...prev, [key]: value };
    });
    setFieldErrors((prev) => {
      if (!prev[key] && !prev.organization_id && !prev.manager_id) return prev;
      const next = { ...prev };
      delete next[key];
      delete next.organization_id;
      delete next.organizationId;
      delete next.manager_id;
      delete next.managerId;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});
    try {
      const dept = await createDepartment.mutateAsync({
        name: form.name,
        organizationId: Number(form.organizationId),
        managerId: form.managerId ? Number(form.managerId) : null,
        description: form.description || null,
      });
      onCreated?.(dept);
      onClose?.();
    } catch (error) {
      setFieldErrors(getApiFieldErrors(error));
      setFormError(getApiErrorMessage(error, 'Could not create department.'));
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
            <Network size={18} strokeWidth={2} />
          </span>
          <div>
            <h2 id={titleId} className="text-[17px] font-semibold text-heading tracking-[-0.02em]">
              New Department
            </h2>
            <p className="mt-0.5 text-[12.5px] text-secondaryText">
              Create a department inside an organization.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={createDepartment.isPending}
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
          label="Department name"
          placeholder="e.g. Engineering"
          value={form.name}
          onChange={set('name')}
          required
          error={fieldErrors.name}
          className="rounded-xl"
        />
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Organization</label>
          <select
            value={form.organizationId}
            onChange={set('organizationId')}
            required
            className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {organizations.length === 0 ? (
              <option value="">Loading…</option>
            ) : (
              organizations.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))
            )}
          </select>
          {fieldErrors.organizationId || fieldErrors.organization_id ? (
            <p className="mt-1 text-[12px] text-error">
              {fieldErrors.organizationId || fieldErrors.organization_id}
            </p>
          ) : null}
        </div>
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Manager</label>
          <select
            value={form.managerId}
            onChange={set('managerId')}
            className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {managers.length === 0 ? (
              <option value="">No users in organization</option>
            ) : (
              managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))
            )}
          </select>
          {fieldErrors.managerId || fieldErrors.manager_id ? (
            <p className="mt-1 text-[12px] text-error">
              {fieldErrors.managerId || fieldErrors.manager_id}
            </p>
          ) : null}
        </div>
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            placeholder="What this department owns…"
            className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={createDepartment.isPending}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={createDepartment.isPending}
            className="rounded-xl shadow-[0_6px_16px_rgba(37,99,235,0.25)]"
          >
            {createDepartment.isPending ? 'Creating…' : 'Create Department'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const CreateDepartmentModal = ({ open, onClose, onCreated }) => (
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
        <CreateDepartmentForm onClose={onClose} onCreated={onCreated} />
      </div>
    )}
  </AnimatePresence>
);

export default CreateDepartmentModal;
