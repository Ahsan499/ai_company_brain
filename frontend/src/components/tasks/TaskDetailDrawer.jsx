import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  CalendarDays,
  Clock,
  Network,
  Paperclip,
  FolderKanban,
  UserRound,
  X,
  MessageSquare,
} from 'lucide-react';
import PriorityBadge from '../projects/PriorityBadge';
import TaskStatusBadge from './TaskStatusBadge';
import SubtaskChecklist from './SubtaskChecklist';
import TaskComment from './TaskComment';
import FileTypeIcon from '../files/FileTypeIcon';
import {
  TASK_STATUSES,
  TASK_STATUS_META,
  formatTaskDate,
} from './taskData';
import { PROJECT_PRIORITIES, PRIORITY_META } from '../projects/projectData';
import { formatHours, getTaskLoggedMinutes } from '../time-tracking/timeEntryData';
import { getFilesByTask } from '../files/fileData';

const TaskDetailDrawer = ({ open, task, onClose, onStatusChange, onPriorityChange, onToggleSubtask }) => {
  const linkedFiles = useMemo(
    () => (task ? getFilesByTask(task.id) : []),
    [task]
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && task && (
        <>
          <motion.button
            type="button"
            aria-label="Close task"
            className="fixed inset-0 z-[70] bg-heading/25 backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={task.title}
            initial={{ x: '100%', y: 0 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            className="
              fixed z-[80] flex flex-col
              inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[24px]
              sm:inset-y-0 sm:right-0 sm:left-auto sm:bottom-auto sm:max-h-none
              sm:w-full sm:max-w-[560px] sm:rounded-none
              bg-white/95 backdrop-blur-2xl
              border border-white/60 border-border/40
              sm:border-l sm:border-y-0 sm:border-r-0
              shadow-[0_-12px_48px_rgba(15,23,42,0.16)]
              sm:shadow-[-20px_0_60px_rgba(15,23,42,0.12)]
            "
          >
            <div className="mx-auto mt-2 mb-1 h-1 w-9 rounded-full bg-slate-200 sm:hidden" />

            <div className="flex items-start justify-between gap-3 border-b border-border/40 px-4 sm:px-5 py-3.5 shrink-0">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[11.5px] font-semibold text-secondaryText mb-2">
                  <Link
                    to={`/dashboard/projects/${task.projectId}`}
                    className="inline-flex items-center gap-1 hover:text-primary truncate"
                  >
                    <FolderKanban size={12} />
                    {task.projectName}
                  </Link>
                </div>
                <h2 className="text-[18px] sm:text-[20px] font-bold text-heading tracking-tight leading-snug border-b border-dashed border-transparent hover:border-border/60 cursor-text">
                  {task.title}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <label className="sr-only" htmlFor="task-status">
                    Status
                  </label>
                  <select
                    id="task-status"
                    value={task.status}
                    onChange={(e) => onStatusChange?.(task.id, e.target.value)}
                    className="h-8 rounded-lg border border-border/60 bg-white px-2 text-[12px] font-semibold text-heading focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {TASK_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {TASK_STATUS_META[s].label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={task.priority}
                    onChange={(e) => onPriorityChange?.(task.id, e.target.value)}
                    className="h-8 rounded-lg border border-border/60 bg-white px-2 text-[12px] font-semibold text-heading focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label="Priority"
                  >
                    {PROJECT_PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {PRIORITY_META[p].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="h-9 w-9 inline-flex items-center justify-center rounded-xl text-secondaryText hover:bg-slate-100 hover:text-heading"
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto dashboard-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-0">
                <div className="p-4 sm:p-5 space-y-5 border-b lg:border-b-0 lg:border-r border-border/40">
                  <section>
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-2">
                      Description
                    </h3>
                    <div className="rounded-[14px] border border-border/45 bg-slate-50/50 px-3.5 py-3 text-[13px] text-secondaryText leading-relaxed min-h-[72px]">
                      {task.description || 'No description.'}
                    </div>
                  </section>

                  <section className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400 mb-1.5">
                        Assignee
                      </p>
                      <Link
                        to={`/dashboard/users/${task.assigneeId}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-white px-2.5 py-1.5 hover:border-primary/25"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[9px] font-semibold">
                          {task.assigneeInitials}
                        </span>
                        <span className="text-[12.5px] font-semibold text-heading">
                          {task.assigneeName}
                        </span>
                      </Link>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400 mb-1.5">
                        Due date
                      </p>
                      <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-heading">
                        <CalendarDays size={13} className="text-slate-400" />
                        {formatTaskDate(task.dueDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-4">
                      <TaskStatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </section>

                  <section>
                    <SubtaskChecklist
                      subtasks={task.subtasks}
                      onToggle={(sid) => onToggleSubtask?.(task.id, sid)}
                    />
                  </section>

                  <section>
                    <div className="mb-2.5 flex items-center gap-2">
                      <MessageSquare size={14} className="text-primary" />
                      <h3 className="text-[13px] font-semibold text-heading">Comments</h3>
                    </div>
                    <div className="space-y-3">
                      {(task.comments || []).length === 0 ? (
                        <p className="text-[12.5px] text-secondaryText">No comments yet.</p>
                      ) : (
                        task.comments.map((c) => <TaskComment key={c.id} comment={c} />)
                      )}
                    </div>
                  </section>

                  <section>
                    <div className="mb-2 flex items-center gap-2">
                      <Paperclip size={14} className="text-slate-400" />
                      <h3 className="text-[13px] font-semibold text-heading">Attachments</h3>
                    </div>
                    {linkedFiles.length === 0 ? (
                      <p className="text-[12.5px] text-secondaryText">No attachments.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {linkedFiles.map((f) => (
                          <Link
                            key={f.id}
                            to={`/dashboard/files/${f.id}`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-white px-2.5 py-1.5 text-[12px] font-medium text-heading hover:border-primary/25 hover:bg-primary/[0.03] transition-colors"
                          >
                            <FileTypeIcon type={f.type} size="xs" />
                            <span className="max-w-[140px] truncate">{f.name}</span>
                            <span className="text-[10.5px] text-slate-400">{f.sizeLabel}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </section>
                </div>

                <aside className="p-4 sm:p-5 space-y-4 bg-slate-50/40">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Details
                  </h3>
                  <Meta
                    icon={CalendarDays}
                    label="Created"
                    value={formatTaskDate(task.createdAt)}
                  />
                  <Meta
                    icon={UserRound}
                    label="Created by"
                    value={task.createdByName}
                    to={`/dashboard/users/${task.createdById}`}
                  />
                  <Meta
                    icon={FolderKanban}
                    label="Project"
                    value={task.projectName}
                    to={`/dashboard/projects/${task.projectId}`}
                  />
                  <Meta
                    icon={Network}
                    label="Department"
                    value={task.departmentName}
                    to={`/dashboard/departments/${task.departmentId}`}
                  />
                  <Meta
                    icon={Building2}
                    label="Organization"
                    value={task.organizationName}
                    to={`/dashboard/organizations/${task.organizationId}`}
                  />
                  <Meta
                    icon={Clock}
                    label="Time logged"
                    value={formatHours(getTaskLoggedMinutes(task.id))}
                  />
                </aside>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const Meta = ({ icon: Icon, label, value, to }) => (
  <div>
    <p className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-slate-400 mb-1">
      {label}
    </p>
    <div className="flex items-start gap-2">
      <Icon size={13} className="mt-0.5 text-slate-400 shrink-0" />
      {to ? (
        <Link to={to} className="text-[12.5px] font-medium text-heading hover:text-primary break-words">
          {value}
        </Link>
      ) : (
        <p className="text-[12.5px] font-medium text-heading break-words">{value}</p>
      )}
    </div>
  </div>
);

export default TaskDetailDrawer;
