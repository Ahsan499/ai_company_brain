import {
  File,
  FileCode,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

const TYPE_CONFIG = {
  doc: {
    icon: FileText,
    wrap: 'from-[#EFF6FF] to-[#DBEAFE] text-sky-700',
  },
  image: {
    icon: ImageIcon,
    wrap: 'from-[#F5F3FF] to-[#DDD6FE] text-violet-700',
  },
  spreadsheet: {
    icon: FileSpreadsheet,
    wrap: 'from-[#ECFDF5] to-[#A7F3D0] text-emerald-700',
  },
  pdf: {
    icon: FileText,
    wrap: 'from-[#FEF2F2] to-[#FECACA] text-rose-700',
  },
  code: {
    icon: FileCode,
    wrap: 'from-[#FFFBEB] to-[#FDE68A] text-amber-700',
  },
  other: {
    icon: File,
    wrap: 'from-slate-50 to-slate-100 text-slate-600',
  },
};

const FileTypeIcon = ({ type = 'other', size = 'md', className = '' }) => {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.other;
  const Icon = cfg.icon;
  const box =
    size === 'lg'
      ? 'h-14 w-14 rounded-[16px]'
      : size === 'sm'
        ? 'h-8 w-8 rounded-lg'
        : size === 'xs'
          ? 'h-6 w-6 rounded-md'
          : 'h-10 w-10 rounded-xl';
  const iconSize = size === 'lg' ? 24 : size === 'sm' ? 14 : size === 'xs' ? 12 : 17;

  return (
    <span
      className={`
        inline-flex shrink-0 items-center justify-center
        bg-gradient-to-br ${cfg.wrap}
        ring-1 ring-black/5 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset]
        ${box} ${className}
      `}
    >
      <Icon size={iconSize} strokeWidth={2} />
    </span>
  );
};

export default FileTypeIcon;
