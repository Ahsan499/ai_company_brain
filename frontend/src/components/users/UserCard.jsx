import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Mail } from 'lucide-react';
import RoleBadge from './RoleBadge';
import StatusBadge from './StatusBadge';

const UserCard = ({ user, index = 0, selected = false, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`
        relative rounded-[18px] border bg-white/90 backdrop-blur-sm p-4
        shadow-[0_2px_12px_rgba(15,23,42,0.04)]
        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(37,99,235,0.08)]
        ${selected ? 'border-primary/30 ring-1 ring-primary/15' : 'border-border/45 hover:border-primary/20'}
      `}
    >
      <div className="absolute top-3.5 right-3.5">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle?.(user.id)}
          aria-label={`Select ${user.name}`}
          className="h-4 w-4 rounded border-gray-300 accent-primary cursor-pointer"
        />
      </div>

      <Link to={`/dashboard/users/${user.id}`} className="block pr-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[12px] font-semibold ring-2 ring-white shadow-sm">
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-heading tracking-tight truncate">
              {user.name}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-secondaryText truncate">
              <Mail size={11} className="shrink-0" />
              {user.email}
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        <RoleBadge role={user.role} />
        <StatusBadge status={user.status} />
      </div>

      <div className="mt-3.5 space-y-1.5 border-t border-border/40 pt-3 text-[12px] text-secondaryText">
        <p className="truncate">{user.department} · {user.team}</p>
        <Link
          to={`/dashboard/organizations/${user.organizationId}`}
          className="inline-flex items-center gap-1.5 font-medium text-heading hover:text-primary transition-colors truncate max-w-full"
        >
          <Building2 size={12} className="shrink-0 text-slate-400" />
          <span className="truncate">{user.organizationName}</span>
        </Link>
        <p className="text-[11px] text-slate-400">Last active {user.lastActive}</p>
      </div>
    </motion.div>
  );
};

export default UserCard;
