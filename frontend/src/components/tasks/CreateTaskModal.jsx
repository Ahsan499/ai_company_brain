import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckSquare, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { PROJECT_PRIORITIES, PRIORITY_META } from '../projects/projectData';
import { useProjects } from '../../hooks/useProjects';
import { useUsers } from '../../hooks/useUsers';
import { useCreateTask } from '../../hooks/useTasks';
import { getApiErrorMessage, getApiFieldErrors } from '../../lib/api';

const INITIAL = {
  title: '',
  projectId: '',
  assigneeId: '',
  priority: 'medium',
  dueDate: '',
  description: '',
};

const CreateTaskForm = ({ onClose, onCreated }) => {
  const titleId = useId();
  const firstRef = useRef(null);
  const createTask = useCreateTask();
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState(INITIAL);
  const { data: projectsData } = useProjects({ perPage: 100, page: 1 });
  const projects = projectsData?.data ?? [];
  const selectedProjectId = form.projectId || (projects[0]?.id ? String(projects[0].id) : '');

  const project = useMemo(
    () => projects.find((p) => String(p.id) === String(selectedProjectId)),
    [projects, selectedProjectId]
  );

  const { data: usersData } = useUsers({
    organizationId: project?.organizationId || 'all',
    perPage: 100,
    page: 1,
  });

  const assignees = useMemo(() => {
    return usersData?.data ?? [];
  }, [usersData]);
  const selectedAssigneeId = form.assigneeId || (assignees[0]?.id ? String(assignees[0].id) : '');

  useEffect(() => {
    const t = window.setTimeout(() => firstRef.current?.focus(), 50);
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape' && !createTask.isPending) onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, createTask.isPending]);

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      if (key === 'projectId') {
        return { ...prev, projectId: value, assigneeId: '' };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project) return;
    setFieldErrors({});
    setFormError('');
    try {
      const created = await createTask.mutateAsync({
        title: form.title,
        projectId: Number(selectedProjectId),
        assigneeId: selectedAssigneeId ? Number(selectedAssigneeId) : null,
        priority: form.priority,
        dueDate: form.dueDate || null,
        description: form.description || null,
        status: 'todo',
        organizationId: Number(project.organizationId),
        departmentId: Number(project.departmentId),
      });
      onCreated?.(created);
      onClose?.();
    } catch (error) {
      setFieldErrors(getApiFieldErrors(error));
      setFormError(getApiErrorMessage(error, 'Could not create task.'));
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
            <CheckSquare size={18} strokeWidth={2} />
          </span>
          <div>
            <h2 id={titleId} className="text-[17px] font-semibold text-heading tracking-[-0.02em]">
              New Task
            </h2>
            <p className="mt-0.5 text-[12.5px] text-secondaryText">
              Create a task linked to a project workspace.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={createTask.isPending}
          className="h-9 w-9 inline-flex items-center justify-center rounded-xl text-secondaryText hover:bg-slate-100 hover:text-heading"
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
          label="Title"
          placeholder="e.g. Implement rate limiter"
          value={form.title}
          onChange={set('title')}
          required
          error={fieldErrors.title}
          className="rounded-xl"
        />
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Project</label>
          <select
            value={selectedProjectId}
            onChange={set('projectId')}
            required
            className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {projects.length === 0 ? (
              <option value="">Loading…</option>
            ) : (
              projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))
            )}
          </select>
          {(fieldErrors.projectId || fieldErrors.project_id) ? (
            <p className="mt-1 text-[12px] text-error">{fieldErrors.projectId || fieldErrors.project_id}</p>
          ) : null}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Assignee</label>
            <select
              value={selectedAssigneeId}
              onChange={set('assigneeId')}
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Unassigned</option>
              {assignees.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
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
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            placeholder="What needs to be done…"
            className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={createTask.isPending}
            className="rounded-xl shadow-[0_6px_16px_rgba(37,99,235,0.25)]"
          >
            {createTask.isPending ? 'Creating…' : 'Create Task'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const CreateTaskModal = ({ open, onClose, onCreated }) => (
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
        <CreateTaskForm onClose={onClose} onCreated={onCreated} />
      </div>
    )}
  </AnimatePresence>
);

export default CreateTaskModal;
