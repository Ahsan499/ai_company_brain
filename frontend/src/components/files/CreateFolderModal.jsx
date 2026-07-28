import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FolderPlus, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useFolders } from '../../hooks/useFiles';
import { getApiErrorMessage, getApiFieldErrors } from '../../lib/api';

const CreateFolderForm = ({ onClose, onSubmit, currentFolderId = null }) => {
  const titleId = useId();
  const firstRef = useRef(null);
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState(currentFolderId || '');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { data: foldersData } = useFolders({ parentId: 'all', perPage: 200 });
  const folders = foldersData?.data ?? [];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const run = async () => {
      setError('');
      setFieldErrors({});
      setSubmitting(true);
      try {
        await onSubmit?.({
          name: name.trim(),
          parent_id: parentId || null,
        });
        onClose?.();
      } catch (apiError) {
        setError(getApiErrorMessage(apiError, 'Could not create folder.'));
        setFieldErrors(getApiFieldErrors(apiError));
      } finally {
        setSubmitting(false);
      }
    };
    run();
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
        relative z-10 w-full sm:max-w-[480px]
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
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF7ED] to-[#FED7AA] text-amber-700 ring-1 ring-amber-500/10">
            <FolderPlus size={18} strokeWidth={2} />
          </span>
          <div>
            <h2 id={titleId} className="text-[17px] font-semibold text-heading tracking-[-0.02em]">
              New Folder
            </h2>
            <p className="mt-0.5 text-[12.5px] text-secondaryText">
              Create a folder in the library.
            </p>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <div role="alert" className="rounded-xl border border-error/20 bg-red-50 px-3 py-2 text-sm text-error">
            {error}
          </div>
        ) : null}
        <Input
          ref={firstRef}
          label="Folder name"
          placeholder="e.g. Q3 Assets"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-xl"
        />
        {fieldErrors.name ? <p className="text-xs text-error mt-1">{fieldErrors.name}</p> : null}
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Parent location</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Root</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={submitting || !name.trim()}
            className="rounded-xl shadow-[0_6px_16px_rgba(37,99,235,0.25)]"
          >
            {submitting ? 'Creating...' : 'Create Folder'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const CreateFolderModal = ({ open, onClose, onSubmit, currentFolderId = null }) => (
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
        <CreateFolderForm onClose={onClose} onSubmit={onSubmit} currentFolderId={currentFolderId} />
      </div>
    )}
  </AnimatePresence>
);

export default CreateFolderModal;
