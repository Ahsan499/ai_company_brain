import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Video, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { PROJECTS } from '../projects/projectData';
import { TEAMS } from '../teams/teamData';
import { USERS } from '../users/userData';

const INITIAL = {
  title: '',
  date: '',
  time: '10:00',
  duration: '45',
  projectId: '',
  teamId: '',
  type: 'video',
  agenda: '',
  attendeeIds: [],
};

const CreateMeetingForm = ({ onClose }) => {
  const titleId = useId();
  const firstRef = useRef(null);
  const [form, setForm] = useState(() => ({
    ...INITIAL,
    projectId: PROJECTS[0]?.id || '',
    attendeeIds: USERS[0] ? [USERS[0].id] : [],
  }));

  useEffect(() => {
    const t = window.setTimeout(() => firstRef.current?.focus(), 50);
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const filteredTeams = useMemo(() => {
    if (!form.projectId) return TEAMS;
    const project = PROJECTS.find((p) => p.id === form.projectId);
    if (!project) return TEAMS;
    return TEAMS.filter((t) => t.organizationId === project.organizationId);
  }, [form.projectId]);

  const toggleAttendee = (userId) => {
    setForm((prev) => {
      const has = prev.attendeeIds.includes(userId);
      return {
        ...prev,
        attendeeIds: has
          ? prev.attendeeIds.filter((id) => id !== userId)
          : [...prev.attendeeIds, userId],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose?.();
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
            <Video size={18} strokeWidth={2} />
          </span>
          <div>
            <h2 id={titleId} className="text-[17px] font-semibold text-heading tracking-[-0.02em]">
              New Meeting
            </h2>
            <p className="mt-0.5 text-[12.5px] text-secondaryText">
              Schedule a sync for a project or team.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-9 w-9 inline-flex items-center justify-center rounded-xl text-secondaryText hover:bg-slate-100 hover:text-heading transition-colors"
          aria-label="Close"
        >
          <X size={17} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          ref={firstRef}
          label="Title"
          placeholder="e.g. Product Sync"
          value={form.title}
          onChange={set('title')}
          required
          className="rounded-xl"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={set('date')}
              required
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Time</label>
            <input
              type="time"
              value={form.time}
              onChange={set('time')}
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Duration (min)</label>
            <input
              type="number"
              min="15"
              step="15"
              value={form.duration}
              onChange={set('duration')}
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Project</label>
            <select
              value={form.projectId}
              onChange={set('projectId')}
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">None</option>
              {PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Team</label>
            <select
              value={form.teamId}
              onChange={set('teamId')}
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">None</option>
              {filteredTeams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Meeting type</label>
          <select
            value={form.type}
            onChange={set('type')}
            className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="video">Video call</option>
            <option value="in-person">In person</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Attendees</label>
          <div className="max-h-32 overflow-y-auto dashboard-scrollbar rounded-xl border border-border/60 bg-slate-50/50 p-2 space-y-1">
            {USERS.slice(0, 12).map((u) => {
              const checked = form.attendeeIds.includes(u.id);
              return (
                <label
                  key={u.id}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAttendee(u.id)}
                    className="h-3.5 w-3.5 rounded accent-primary"
                  />
                  <span className="text-[12.5px] font-medium text-heading">{u.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Agenda</label>
          <textarea
            value={form.agenda}
            onChange={set('agenda')}
            rows={3}
            placeholder="Topics to cover…"
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
            className="rounded-xl shadow-[0_6px_16px_rgba(37,99,235,0.25)]"
          >
            Create Meeting
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const CreateMeetingModal = ({ open, onClose }) => (
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
        <CreateMeetingForm onClose={onClose} />
      </div>
    )}
  </AnimatePresence>
);

export default CreateMeetingModal;
