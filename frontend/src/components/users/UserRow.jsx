import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Pencil, UserX, Trash2 } from 'lucide-react';
import RoleBadge from './RoleBadge';
import StatusBadge from './StatusBadge';

const UserRow = ({
  user,
  selected = false,
  onToggle,
  showCheckbox = true,
  teamLeadId = null,
}) => {
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

  return (
    <tr
      className={`
        group border-b border-border/35 last:border-0
        transition-colors duration-150
        ${selected ? 'bg-primary/[0.04]' : 'hover:bg-slate-50/80'}
      `}
    >
      {showCheckbox && (
        <td className="px-3 py-3 w-12">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggle?.(user.id)}
            aria-label={`Select ${user.name}`}
            className="h-4 w-4 rounded border-gray-300 accent-primary cursor-pointer"
          />
        </td>
      )}
      <td className="px-3 py-3 min-w-[200px]">
        <Link
          to={`/dashboard/users/${user.id}`}
          className="flex items-center gap-3 min-w-0 focus:outline-none"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[11px] font-semibold ring-2 ring-white shadow-sm">
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-heading tracking-tight truncate group-hover:text-primary transition-colors inline-flex items-center gap-1.5">
              <span className="truncate">{user.name}</span>
              {teamLeadId === user.id && (
                <span className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 text-[9.5px] font-semibold text-primary ring-1 ring-primary/12">
                  Team Lead
                </span>
              )}
            </p>
            <p className="text-[11.5px] text-secondaryText truncate sm:hidden">{user.email}</p>
          </div>
        </Link>
      </td>
      <td className="px-3 py-3 hidden sm:table-cell">
        <span className="text-[12.5px] text-secondaryText truncate block max-w-[200px]">
          {user.email}
        </span>
      </td>
      <td className="px-3 py-3">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-3 py-3 hidden md:table-cell text-[12.5px] text-secondaryText">
        {user.department}
      </td>
      <td className="px-3 py-3 hidden lg:table-cell">
        <Link
          to={`/dashboard/organizations/${user.organizationId}`}
          className="text-[12.5px] font-medium text-heading hover:text-primary transition-colors truncate block max-w-[160px]"
        >
          {user.organizationName}
        </Link>
      </td>
      <td className="px-3 py-3">
        <StatusBadge status={user.status} />
      </td>
      <td className="px-3 py-3 hidden xl:table-cell text-[12px] text-secondaryText whitespace-nowrap tabular-nums">
        {user.lastActive}
      </td>
      <td className="px-3 py-3 text-right relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="
            inline-flex h-8 w-8 items-center justify-center rounded-lg
            text-slate-400 hover:bg-white hover:text-heading hover:shadow-sm
            transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
          "
          aria-label={`Actions for ${user.name}`}
          aria-expanded={menuOpen}
        >
          <MoreHorizontal size={16} />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 2, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="
                absolute right-3 top-full z-20 mt-1 w-44
                rounded-[14px] border border-border/50 bg-white/95 backdrop-blur-xl
                p-1 shadow-[0_12px_32px_rgba(15,23,42,0.12)]
              "
              role="menu"
            >
              <Link
                to={`/dashboard/users/${user.id}`}
                role="menuitem"
                className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-[12.5px] font-medium text-heading hover:bg-slate-50"
                onClick={() => setMenuOpen(false)}
              >
                <Pencil size={13} className="text-slate-400" />
                Edit
              </Link>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-[12.5px] font-medium text-heading hover:bg-slate-50"
                onClick={() => setMenuOpen(false)}
              >
                <UserX size={13} className="text-amber-500" />
                Deactivate
              </button>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-[12.5px] font-medium text-error hover:bg-red-50"
                onClick={() => setMenuOpen(false)}
              >
                <Trash2 size={13} />
                Remove
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </td>
    </tr>
  );
};

export default UserRow;
