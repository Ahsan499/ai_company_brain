import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FolderKanban, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { PROJECT_PRIORITIES, PRIORITY_META } from './projectData';
import { useOrganizations } from '../../hooks/useOrganizations';
import { useDepartments } from '../../hooks/useDepartments';
import { useUsers } from '../../hooks/useUsers';
import { useCreateProject } from '../../hooks/useProjects';
import { getApiErrorMessage, getApiFieldErrors } from '../../lib/api';

const INITIAL = {
  name: '',
  organizationId: '',
  departmentId: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  memberIds: [],
};

const CreateProjectForm = ({ onClose, onCreated }) => {
  const titleId = useId();
  const firstRef = useRef(null);
  const createProject = useCreateProject();
  const { data: orgsData } = useOrganizations({ perPage: 100, page: 1 });
  const organizations = orgsData?.data ?? [];
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState(INITIAL);
  const selectedOrganizationId = form.organizationId || (organizations[0]?.id ? String(organizations[0].id) : '');

  const { data: deptsData } = useDepartments({
    organizationId: selectedOrganizationId || 'all',
    perPage: 100,
    page: 1,
  });
  const deptOptions = deptsData?.data ?? [];
  const selectedDepartmentId = form.departmentId || (deptOptions[0]?.id ? String(deptOptions[0].id) : '');

  const { data: usersData } = useUsers({
    organizationId: selectedOrganizationId || 'all',
    perPage: 100,
    page: 1,
  });
  const memberOptions = useMemo(() => (usersData?.data ?? []).slice(0, 25), [usersData]);

  useEffect(() => {
    const t = window.setTimeout(() => firstRef.current?.focus(), 50);
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape' && !createProject.isPending) onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, createProject.isPending]);

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      if (key === 'organizationId') {
        return { ...prev, organizationId: value, departmentId: '', memberIds: [] };
      }
      return { ...prev, [key]: value };
    });
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const toggleMember = (id) => {
    setForm((prev) => ({
      ...prev,
      memberIds: prev.memberIds.includes(id)
        ? prev.memberIds.filter((x) => x !== id)
        : [...prev.memberIds, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});
    createProject
      .mutateAsync({
        name: form.name,
        organizationId: Number(selectedOrganizationId),
        departmentId: Number(selectedDepartmentId),
        description: form.description || null,
        priority: form.priority,
        dueDate: form.dueDate || null,
        memberIds: form.memberIds.map(Number).filter(Boolean),
      })
      .then((project) => {
        onCreated?.(project);
        onClose?.();
      })
      .catch((error) => {
        setFieldErrors(getApiFieldErrors(error));
        setFormError(getApiErrorMessage(error, 'Could not create project.'));
      });
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
            <FolderKanban size={18} strokeWidth={2} />
          </span>
          <div>
            <h2 id={titleId} className="text-[17px] font-semibold text-heading tracking-[-0.02em]">
              New Project
            </h2>
            <p className="mt-0.5 text-[12.5px] text-secondaryText">
              Create a workspace linked to an organization & department.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={createProject.isPending}
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
          label="Project name"
          placeholder="e.g. API Gateway v2"
          value={form.name}
          onChange={set('name')}
          required
          error={fieldErrors.name}
          className="rounded-xl"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Organization</label>
            <select
              value={selectedOrganizationId}
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
            {(fieldErrors.organizationId || fieldErrors.organization_id) ? (
              <p className="mt-1 text-[12px] text-error">{fieldErrors.organizationId || fieldErrors.organization_id}</p>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Department</label>
            <select
              value={selectedDepartmentId}
              onChange={set('departmentId')}
              required
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {deptOptions.length === 0 && <option value="">No departments</option>}
              {deptOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {(fieldErrors.departmentId || fieldErrors.department_id) ? (
              <p className="mt-1 text-[12px] text-error">{fieldErrors.departmentId || fieldErrors.department_id}</p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Priority</label>
            <select
              value={form.priority}
              onChange={set('priority')}
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {PROJECT_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_META[p].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Due date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={set('dueDate')}
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            placeholder="What this project delivers…"
            className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-heading mb-2">Initial members</p>
          <div className="max-h-36 overflow-y-auto dashboard-scrollbar space-y-1 rounded-[14px] border border-border/50 p-2">
            {memberOptions.map((u) => (
              <label
                key={u.id}
                className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.memberIds.includes(u.id)}
                  onChange={() => toggleMember(u.id)}
                  className="h-4 w-4 rounded accent-primary"
                />
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[9px] font-semibold">
                  {u.initials}
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-medium text-heading truncate">
                    {u.name}
                  </span>
                  <span className="block text-[11px] text-secondaryText truncate">{u.role}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={createProject.isPending}
            className="rounded-xl shadow-[0_6px_16px_rgba(37,99,235,0.25)]"
          >
            {createProject.isPending ? 'Creating…' : 'Create Project'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const CreateProjectModal = ({ open, onClose, onCreated }) => (
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
        <CreateProjectForm onClose={onClose} onCreated={onCreated} />
      </div>
    )}
  </AnimatePresence>
);

export default CreateProjectModal;
