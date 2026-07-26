import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Download,
  FolderInput,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import FileTypeIcon from './FileTypeIcon';
import { FILE_TYPE_META, formatFileDate } from './fileData';

const FileRow = ({ file, compact = false, onOpen, index = 0 }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointer = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, [menuOpen]);

  if (!file) return null;
  const meta = FILE_TYPE_META[file.type] || FILE_TYPE_META.other;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.02 }}
      className="group border-b border-border/35 last:border-0 hover:bg-slate-50/70 transition-colors"
    >
      <td className="px-3 py-3 min-w-[200px]">
        <button
          type="button"
          onClick={() => onOpen?.(file.id)}
          className="flex items-center gap-3 min-w-0 text-left w-full focus:outline-none"
        >
          <FileTypeIcon type={file.type} size="sm" />
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold text-heading truncate group-hover:text-primary transition-colors">
              {file.name}
            </span>
            {compact && file.projectName && (
              <span className="block text-[11px] text-secondaryText truncate">{file.projectName}</span>
            )}
          </span>
        </button>
      </td>
      {!compact && (
        <>
          <td className="px-3 py-3 hidden sm:table-cell">
            <span className={`rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ring-1 ${meta.tone}`}>
              {meta.label}
            </span>
          </td>
          <td className="px-3 py-3 text-[12.5px] text-secondaryText tabular-nums whitespace-nowrap">
            {file.sizeLabel}
          </td>
          <td className="px-3 py-3 hidden md:table-cell">
            {file.projectId ? (
              <Link
                to={`/dashboard/projects/${file.projectId}`}
                className="rounded-md bg-primary/5 px-1.5 py-0.5 text-[10.5px] font-semibold text-primary ring-1 ring-primary/10 hover:bg-primary/10"
                onClick={(e) => e.stopPropagation()}
              >
                {file.projectName}
              </Link>
            ) : (
              <span className="text-slate-300">—</span>
            )}
          </td>
          <td className="px-3 py-3 hidden lg:table-cell">
            <Link
              to={`/dashboard/users/${file.uploadedById}`}
              className="inline-flex items-center gap-2 hover:opacity-90"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[9px] font-semibold">
                {file.uploadedByInitials}
              </span>
              <span className="text-[12.5px] font-medium text-heading truncate max-w-[100px]">
                {file.uploadedByName}
              </span>
            </Link>
          </td>
          <td className="px-3 py-3 hidden xl:table-cell text-[12px] text-secondaryText whitespace-nowrap">
            {formatFileDate(file.uploadedAt)}
          </td>
        </>
      )}
      <td className="px-3 py-3 text-right relative" ref={menuRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-heading hover:shadow-sm"
          aria-label={`Actions for ${file.name}`}
          aria-expanded={menuOpen}
        >
          <MoreHorizontal size={16} />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.15 }}
              className="
                absolute right-3 top-full z-20 mt-1 w-40
                rounded-[14px] border border-border/50 bg-white/95 backdrop-blur-xl
                p-1 shadow-[0_12px_32px_rgba(15,23,42,0.12)]
              "
              role="menu"
            >
              {[
                { icon: Download, label: 'Download' },
                { icon: Pencil, label: 'Rename' },
                { icon: FolderInput, label: 'Move' },
                { icon: Trash2, label: 'Delete', danger: true },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-[12.5px] font-medium hover:bg-slate-50 ${
                    item.danger ? 'text-error' : 'text-heading'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <item.icon size={13} className={item.danger ? 'text-error' : 'text-slate-400'} />
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </td>
    </motion.tr>
  );
};

/** Mobile-friendly card row for list view */
export const FileMobileRow = ({ file, onOpen }) => {
  if (!file) return null;
  return (
    <button
      type="button"
      onClick={() => onOpen?.(file.id)}
      className="
        flex w-full items-center gap-3 rounded-[16px] border border-border/45
        bg-white/90 p-3.5 text-left shadow-sm
        hover:border-primary/20 transition-colors
      "
    >
      <FileTypeIcon type={file.type} size="sm" />
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold text-heading truncate">{file.name}</span>
        <span className="block text-[11.5px] text-secondaryText">
          {file.sizeLabel} · {formatFileDate(file.uploadedAt)}
        </span>
      </span>
    </button>
  );
};

export default FileRow;
