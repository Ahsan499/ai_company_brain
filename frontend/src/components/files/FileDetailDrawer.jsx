import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckSquare,
  Download,
  FolderInput,
  FolderKanban,
  Pencil,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import Button from '../ui/Button';
import TaskComment from '../tasks/TaskComment';
import FileTypeIcon from './FileTypeIcon';
import { FILE_TYPE_META, formatFileDate } from './fileData';

const FileDetailDrawer = ({ open, file, onClose }) => {
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

  const meta = file ? FILE_TYPE_META[file.type] || FILE_TYPE_META.other : null;

  return (
    <AnimatePresence>
      {open && file && (
        <>
          <motion.button
            type="button"
            aria-label="Close file"
            className="fixed inset-0 z-[70] bg-heading/25 backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={file.name}
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
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <FileTypeIcon type={file.type} />
                <div className="min-w-0">
                  <h2 className="text-[17px] sm:text-[18px] font-bold text-heading tracking-tight leading-snug border-b border-dashed border-transparent hover:border-border/60 cursor-text truncate">
                    {file.name}
                  </h2>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className={`rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ring-1 ${meta.tone}`}>
                      {meta.label}
                    </span>
                    <span className="text-[12px] text-secondaryText tabular-nums">{file.sizeLabel}</span>
                  </div>
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

            <div className="flex-1 overflow-y-auto dashboard-scrollbar p-4 sm:p-5 space-y-5">
              <div className="flex h-40 sm:h-48 items-center justify-center rounded-[18px] border border-border/45 bg-gradient-to-br from-slate-50 to-white">
                <FileTypeIcon type={file.type} size="lg" />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Download, label: 'Download', primary: true },
                  { icon: Pencil, label: 'Rename' },
                  { icon: FolderInput, label: 'Move' },
                  { icon: Share2, label: 'Share' },
                  { icon: Trash2, label: 'Delete', danger: true },
                ].map((a) => (
                  <Button
                    key={a.label}
                    type="button"
                    variant={a.primary ? 'primary' : 'secondary'}
                    className={`h-9 rounded-xl gap-1.5 text-[12px] font-semibold ${
                      a.primary ? 'shadow-[0_4px_12px_rgba(37,99,235,0.25)]' : 'bg-white'
                    } ${a.danger ? 'text-error border-error/20 hover:bg-red-50' : ''}`}
                  >
                    <a.icon size={13} />
                    {a.label}
                  </Button>
                ))}
              </div>

              <section className="grid grid-cols-2 gap-3">
                <Meta label="Type" value={file.mimeLabel} />
                <Meta label="Size" value={file.sizeLabel} />
                <Meta label="Uploaded" value={formatFileDate(file.uploadedAt)} />
                <Meta label="Modified" value={formatFileDate(file.modifiedAt)} />
              </section>

              <section>
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400 mb-1.5">
                  Uploaded by
                </p>
                <Link
                  to={`/dashboard/users/${file.uploadedById}`}
                  className="inline-flex items-center gap-2.5 hover:opacity-90"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[11px] font-semibold">
                    {file.uploadedByInitials}
                  </span>
                  <span className="text-[13px] font-semibold text-heading">{file.uploadedByName}</span>
                </Link>
              </section>

              {(file.projectId || file.taskId) && (
                <section className="flex flex-wrap gap-2">
                  {file.projectId && (
                    <Link
                      to={`/dashboard/projects/${file.projectId}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-slate-50/90 px-2.5 py-1 text-[12px] font-semibold text-heading hover:border-primary/25 hover:text-primary"
                    >
                      <FolderKanban size={12} className="text-slate-400" />
                      {file.projectName}
                    </Link>
                  )}
                  {file.taskId && (
                    <Link
                      to={`/dashboard/tasks/${file.taskId}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-slate-50/90 px-2.5 py-1 text-[12px] font-semibold text-heading hover:border-primary/25 hover:text-primary"
                    >
                      <CheckSquare size={12} className="text-slate-400" />
                      {file.taskTitle}
                    </Link>
                  )}
                </section>
              )}

              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-2">
                  Version history
                </h3>
                <ul className="space-y-2">
                  {(file.versions || []).map((v) => (
                    <li
                      key={v.id}
                      className="flex items-center gap-2.5 rounded-[12px] border border-border/40 bg-slate-50/60 px-3 py-2"
                    >
                      <span className="rounded-md bg-white px-1.5 py-0.5 text-[10.5px] font-bold text-primary ring-1 ring-primary/10">
                        {v.label}
                      </span>
                      <span className="min-w-0 flex-1 text-[12px] text-secondaryText truncate">
                        uploaded by {v.userName}
                      </span>
                      <span className="text-[10.5px] font-medium text-slate-400 whitespace-nowrap">
                        {v.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-2">
                  Comments
                </h3>
                {(file.comments || []).length === 0 ? (
                  <p className="text-[12.5px] text-secondaryText py-1">No comments yet.</p>
                ) : (
                  <div className="space-y-3">
                    {file.comments.map((c) => (
                      <TaskComment key={c.id} comment={c} />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const Meta = ({ label, value }) => (
  <div className="rounded-[14px] border border-border/45 bg-slate-50/50 px-3 py-2.5">
    <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">{label}</p>
    <p className="mt-0.5 text-[12.5px] font-semibold text-heading">{value}</p>
  </div>
);

export default FileDetailDrawer;
