import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UsersRound, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useOrganizations } from '../../hooks/useOrganizations';
import { useDepartments } from '../../hooks/useDepartments';
import { useUsers } from '../../hooks/useUsers';
import { useCreateTeam } from '../../hooks/useTeams';
import { getApiErrorMessage, getApiFieldErrors } from '../../lib/api';

const CreateTeamForm = ({ onClose, onCreated }) => {
  const titleId = useId();
  const firstRef = useRef(null);
  const createTeam = useCreateTeam();
  const { data: orgsData } = useOrganizations({ perPage: 100, page: 1 });
  const organizations = orgsData?.data ?? [];

  const [form, setForm] = useState({
    name: '',
    organizationId: '',
    departmentId: '',
    leadId: '',
    description: '',
    memberIds: [],
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');

  const { data: deptsData } = useDepartments({
    organizationId: form.organizationId || 'all',
    perPage: 100,
    page: 1,
  });
  const { data: usersData } = useUsers({
    organizationId: form.organizationId || 'all',
    perPage: 100,
    page: 1,
  });

  const orgDepartments = deptsData?.data ?? [];
  const orgUsers = usersData?.data ?? [];

  useEffect(() => {
    if (!form.organizationId && organizations[0]?.id) {
      setForm((prev) => ({ ...prev, organizationId: String(organizations[0].id) }));
    }
  }, [organizations, form.organizationId]);

  useEffect(() => {
    if (!form.organizationId) return;
    setForm((prev) => {
      let next = prev;
      if (!prev.departmentId && orgDepartments[0]) {
        next = { ...next, departmentId: String(orgDepartments[0].id) };
      }
      if (!prev.leadId && orgUsers[0]) {
        next = {
          ...next,
          leadId: String(orgUsers[0].id),
          memberIds: next.memberIds?.length
            ? next.memberIds
            : [orgUsers[0].id],
        };
      }
      return next;
    });
  }, [form.organizationId, orgDepartments, orgUsers]);

  useEffect(() => {
    const t = window.setTimeout(() => firstRef.current?.focus(), 50);
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape' && !createTeam.isPending) onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, createTeam.isPending]);

  const clearFieldError = (key) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      if (key === 'organizationId') {
        return {
          ...prev,
          organizationId: value,
          departmentId: '',
          leadId: '',
          memberIds: [],
        };
      }
      if (key === 'leadId') {
        const memberIds = prev.memberIds.map(String).includes(String(value))
          ? prev.memberIds
          : [...prev.memberIds, value].filter(Boolean);
        return { ...prev, leadId: value, memberIds };
      }
      return { ...prev, [key]: value };
    });
    clearFieldError(key);
  };

  const toggleMember = (userId) => {
    const id = String(userId);
    setForm((prev) => {
      if (id === String(prev.leadId)) return prev;
      const has = prev.memberIds.map(String).includes(id);
      return {
        ...prev,
        memberIds: has
          ? prev.memberIds.filter((x) => String(x) !== id)
          : [...prev.memberIds, userId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});
    try {
      const team = await createTeam.mutateAsync({
        name: form.name,
        organizationId: Number(form.organizationId),
        departmentId: Number(form.departmentId),
        leadId: form.leadId ? Number(form.leadId) : null,
        description: form.description || null,
        memberIds: form.memberIds.map(Number).filter(Boolean),
      });
      onCreated?.(team);
      onClose?.();
    } catch (error) {
      setFieldErrors(getApiFieldErrors(error));
      setFormError(getApiErrorMessage(error, 'Could not create team.'));
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
        relative z-10 w-full sm:max-w-[560px]
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
            <UsersRound size={18} strokeWidth={2} />
          </span>
          <div>
            <h2 id={titleId} className="text-[17px] font-semibold text-heading tracking-[-0.02em]">
              New Team
            </h2>
            <p className="mt-0.5 text-[12.5px] text-secondaryText">
              Create a squad inside a department.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={createTeam.isPending}
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
          label="Team name"
          placeholder="e.g. Backend"
          value={form.name}
          onChange={set('name')}
          required
          error={fieldErrors.name}
          className="rounded-xl"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Department</label>
            <select
              value={form.departmentId}
              onChange={set('departmentId')}
              required
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {orgDepartments.length === 0 ? (
                <option value="">No departments</option>
              ) : (
                orgDepartments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))
              )}
            </select>
            {fieldErrors.departmentId || fieldErrors.department_id ? (
              <p className="mt-1 text-[12px] text-error">
                {fieldErrors.departmentId || fieldErrors.department_id}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Team lead</label>
          <select
            value={form.leadId}
            onChange={set('leadId')}
            className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {orgUsers.length === 0 ? (
              <option value="">No users</option>
            ) : (
              orgUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                  {u.role ? ` · ${u.role}` : ''}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Initial members</label>
          <div className="max-h-36 overflow-y-auto dashboard-scrollbar rounded-xl border border-border/60 bg-slate-50/50 p-2 space-y-1">
            {orgUsers.length === 0 ? (
              <p className="px-2 py-1.5 text-[12px] text-secondaryText">No users in this organization.</p>
            ) : (
              orgUsers.map((u) => {
                const checked = form.memberIds.map(String).includes(String(u.id));
                const isLead = String(u.id) === String(form.leadId);
                return (
                  <label
                    key={u.id}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isLead}
                      onChange={() => toggleMember(u.id)}
                      className="h-3.5 w-3.5 rounded accent-primary"
                    />
                    <span className="text-[12.5px] font-medium text-heading">{u.name}</span>
                    {isLead && (
                      <span className="text-[10px] font-semibold text-primary">Lead</span>
                    )}
                  </label>
                );
              })
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            placeholder="What this squad owns…"
            className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={createTeam.isPending}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={createTeam.isPending || !form.departmentId}
            className="rounded-xl shadow-[0_6px_16px_rgba(37,99,235,0.25)]"
          >
            {createTeam.isPending ? 'Creating…' : 'Create Team'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const CreateTeamModal = ({ open, onClose, onCreated }) => (
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
        <CreateTeamForm onClose={onClose} onCreated={onCreated} />
      </div>
    )}
  </AnimatePresence>
);

export default CreateTeamModal;
