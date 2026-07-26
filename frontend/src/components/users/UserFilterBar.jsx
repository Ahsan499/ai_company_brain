import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { USER_ROLES, USER_STATUSES, DEPARTMENTS } from './userData';

const selectClass =
  'h-10 rounded-xl border border-border/60 bg-white px-3 text-[12.5px] font-medium text-heading focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12';

const UserFilterBar = ({
  query,
  onQueryChange,
  role,
  onRoleChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
  organizationId,
  onOrganizationChange,
  organizations = [],
  view,
  onViewChange,
}) => {
  return (
    <div
      className="
        flex flex-col gap-3
        rounded-[20px] border border-border/45 bg-white/85 backdrop-blur-md
        p-3 sm:p-3.5
        shadow-[0_2px_12px_rgba(15,23,42,0.04)]
      "
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-xl">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange?.(e.target.value)}
            placeholder="Search by name or email..."
            className="
              w-full h-10 rounded-xl border border-border/60 bg-white/90
              pl-10 pr-3 text-[13px] text-heading placeholder:text-slate-400
              focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12
              transition-all
            "
            aria-label="Search users"
          />
        </div>

        <div
          className="inline-flex self-start rounded-xl border border-border/60 bg-slate-50/80 p-0.5"
          role="group"
          aria-label="View mode"
        >
          <button
            type="button"
            onClick={() => onViewChange?.('table')}
            aria-pressed={view === 'table'}
            className={`
              inline-flex h-9 w-9 items-center justify-center rounded-[10px] transition-all
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
              ${
                view === 'table'
                  ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                  : 'text-slate-400 hover:text-heading'
              }
            `}
            aria-label="Table view"
          >
            <List size={15} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => onViewChange?.('grid')}
            aria-pressed={view === 'grid'}
            className={`
              inline-flex h-9 w-9 items-center justify-center rounded-[10px] transition-all
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
              ${
                view === 'grid'
                  ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                  : 'text-slate-400 hover:text-heading'
              }
            `}
            aria-label="Grid view"
          >
            <LayoutGrid size={15} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400 px-1">
          <SlidersHorizontal size={12} />
          Filters
        </span>
        <select
          value={role}
          onChange={(e) => onRoleChange?.(e.target.value)}
          className={selectClass}
          aria-label="Filter by role"
        >
          <option value="all">All roles</option>
          {USER_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={department}
          onChange={(e) => onDepartmentChange?.(e.target.value)}
          className={selectClass}
          aria-label="Filter by department"
        >
          <option value="all">All departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => onStatusChange?.(e.target.value)}
          className={selectClass}
          aria-label="Filter by status"
        >
          <option value="all">All status</option>
          {USER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={organizationId}
          onChange={(e) => onOrganizationChange?.(e.target.value)}
          className={`${selectClass} max-w-[200px]`}
          aria-label="Filter by organization"
        >
          <option value="all">All organizations</option>
          {organizations.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UserFilterBar;
