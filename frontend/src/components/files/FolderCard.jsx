import { motion } from 'framer-motion';
import { Folder } from 'lucide-react';

const FolderCard = ({ folder, index = 0, onOpen }) => {
  if (!folder) return null;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      whileHover={{ y: -2 }}
      onClick={() => onOpen?.(folder.id)}
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
      <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#FFF7ED] to-[#FED7AA] text-amber-700 ring-1 ring-amber-500/10">
        <Folder size={18} strokeWidth={2} />
      </span>
      <p className="mt-3 text-[14px] font-semibold text-heading tracking-tight truncate group-hover:text-primary transition-colors">
        {folder.name}
      </p>
      <p className="mt-0.5 text-[11.5px] text-secondaryText truncate">
        Folder · {folder.createdByName}
      </p>
    </motion.button>
  );
};

export const FolderRow = ({ folder, onOpen }) => {
  if (!folder) return null;
  return (
    <button
      type="button"
      onClick={() => onOpen?.(folder.id)}
      className="
        flex w-full items-center gap-3 rounded-[14px] border border-border/45
        bg-white/90 px-3.5 py-3 text-left
        hover:border-primary/20 hover:bg-slate-50/80 transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
      "
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFF7ED] to-[#FED7AA] text-amber-700">
        <Folder size={15} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-semibold text-heading truncate">{folder.name}</span>
        <span className="block text-[11.5px] text-secondaryText">Folder</span>
      </span>
    </button>
  );
};

export default FolderCard;
