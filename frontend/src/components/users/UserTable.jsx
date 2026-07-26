import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import UserRow from './UserRow';
import RoleBadge from './RoleBadge';
import StatusBadge from './StatusBadge';

/**
 * Desktop table + mobile stacked rows for users list.
 */
const UserTable = ({
  users = [],
  selectedIds = [],
  onToggle,
  onToggleAll,
}) => {
  const allSelected = users.length > 0 && users.every((u) => selectedIds.includes(u.id));
  const someSelected = users.some((u) => selectedIds.includes(u.id)) && !allSelected;

  return (
    <>
      {/* Mobile list */}
      <ul className="space-y-2 md:hidden">
        {users.map((user, i) => {
          const selected = selectedIds.includes(user.id);
          return (
            <motion.li
              key={user.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.025 }}
              className={`
                rounded-[16px] border bg-white/90 p-3.5
                shadow-[0_2px_10px_rgba(15,23,42,0.04)]
                ${selected ? 'border-primary/25 bg-primary/[0.03]' : 'border-border/45'}
              `}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => onToggle?.(user.id)}
                  className="mt-2.5 h-4 w-4 rounded accent-primary"
                  aria-label={`Select ${user.name}`}
                />
                <Link to={`/dashboard/users/${user.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[11px] font-semibold">
                    {user.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold text-heading truncate">{user.name}</p>
                    <p className="text-[11.5px] text-secondaryText truncate">{user.email}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <RoleBadge role={user.role} />
                      <StatusBadge status={user.status} />
                    </div>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-slate-300" />
                </Link>
              </div>
            </motion.li>
          );
        })}
      </ul>

      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-[20px] border border-border/45 bg-white/90 backdrop-blur-sm shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto dashboard-scrollbar">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-border/50 bg-slate-50/80">
                <th className="px-3 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={onToggleAll}
                    aria-label="Select all users"
                    className="h-4 w-4 rounded border-gray-300 accent-primary cursor-pointer"
                  />
                </th>
                {['User', 'Email', 'Role', 'Department', 'Organization', 'Status', 'Last active', ''].map(
                  (h) => (
                    <th
                      key={h || 'actions'}
                      className={`
                        px-3 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400
                        ${h === 'Email' ? 'hidden sm:table-cell' : ''}
                        ${h === 'Department' ? 'hidden md:table-cell' : ''}
                        ${h === 'Organization' ? 'hidden lg:table-cell' : ''}
                        ${h === 'Last active' ? 'hidden xl:table-cell' : ''}
                      `}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  selected={selectedIds.includes(user.id)}
                  onToggle={onToggle}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserTable;
