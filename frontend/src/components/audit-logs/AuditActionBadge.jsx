import {
  KeyRound,
  LogIn,
  Pencil,
  PlusCircle,
  Trash2,
  UserMinus,
  UserPlus,
} from 'lucide-react';
import { AUDIT_ACTION_META } from './auditLogData';

const ICONS = {
  create: PlusCircle,
  update: Pencil,
  delete: Trash2,
  login: LogIn,
  permission_change: KeyRound,
  invite: UserPlus,
  remove: UserMinus,
};

const AuditActionBadge = ({ action, showLabel = true, size = 'md' }) => {
  const meta = AUDIT_ACTION_META[action] || AUDIT_ACTION_META.update;
  const Icon = ICONS[action] || Pencil;
  const iconSize = size === 'sm' ? 12 : 14;
  const pad = size === 'sm' ? 'px-1.5 py-0.5 gap-1' : 'px-2 py-1 gap-1.5';

  return (
    <span
      className={`
        inline-flex items-center rounded-full text-[10.5px] font-semibold
        tracking-tight ring-1 whitespace-nowrap ${pad} ${meta.tone}
      `}
    >
      <Icon size={iconSize} strokeWidth={2.2} />
      {showLabel && meta.label}
    </span>
  );
};

export const AuditActionIcon = ({ action, className = '' }) => {
  const meta = AUDIT_ACTION_META[action] || AUDIT_ACTION_META.update;
  const Icon = ICONS[action] || Pencil;
  return (
    <span
      className={`
        inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] ring-1
        ${meta.iconTone} ${className}
      `}
    >
      <Icon size={15} strokeWidth={2} />
    </span>
  );
};

export default AuditActionBadge;
