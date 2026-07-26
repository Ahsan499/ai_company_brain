import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FileTypeIcon from './FileTypeIcon';
import { FILE_TYPE_META, formatFileDate } from './fileData';

const FileCard = ({ file, index = 0, onOpen }) => {
  if (!file) return null;
  const meta = FILE_TYPE_META[file.type] || FILE_TYPE_META.other;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      whileHover={{ y: -2 }}
      onClick={() => onOpen?.(file.id)}
      className="
        group flex h-full w-full flex-col text-left
        rounded-[20px] border border-border/45 bg-white/90
        p-4
        shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_4px_16px_rgba(15,23,42,0.04)]
        transition-all duration-200
        hover:border-primary/20 hover:shadow-[0_12px_32px_rgba(37,99,235,0.1)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
      "
    >
      <div className="flex items-start justify-between gap-2">
        <FileTypeIcon type={file.type} />
        <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${meta.tone}`}>
          {meta.label}
        </span>
      </div>
      <p className="mt-3 text-[13.5px] font-semibold text-heading tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
        {file.name}
      </p>
      <p className="mt-1 text-[11.5px] text-secondaryText tabular-nums">
        {file.sizeLabel} · {formatFileDate(file.uploadedAt)}
      </p>
      {file.projectName && (
        <Link
          to={`/dashboard/projects/${file.projectId}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-2 inline-block rounded-md bg-primary/5 px-1.5 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/10 truncate max-w-full"
        >
          {file.projectName}
        </Link>
      )}
      <div className="mt-3 flex items-center gap-2 border-t border-border/40 pt-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[8px] font-semibold">
          {file.uploadedByInitials}
        </span>
        <span className="text-[11px] text-secondaryText truncate">{file.uploadedByName}</span>
      </div>
    </motion.button>
  );
};

export default FileCard;
