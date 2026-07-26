import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Network, Plus, Search, LayoutGrid, List, Filter, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/dashboard/EmptyState';
import DepartmentCard from '../../components/departments/DepartmentCard';
import DepartmentTable from '../../components/departments/DepartmentTable';
import CreateDepartmentModal from '../../components/departments/CreateDepartmentModal';
import { useDepartments } from '../../hooks/useDepartments';
import { useOrganizations } from '../../hooks/useOrganizations';
import { useUsers } from '../../hooks/useUsers';

const PAGE_SIZE = 6;
const selectClass =
  'h-10 rounded-xl border border-border/60 bg-white px-3 text-[12.5px] font-medium text-heading focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12';

const DepartmentsSkeleton = ({ view }) => {
  if (view === 'table') {
    return (
      <div className="rounded-[20px] border border-border/45 bg-white/90 p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-[200px] w-full" rounded="rounded-[20px]" />
      ))}
    </div>
  );
};

const Departments = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [organizationId, setOrganizationId] = useState('all');
  const [managerId, setManagerId] = useState('all');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(t);
  }, [query]);

  const { data, isLoading, isFetching, isError, error, refetch } = useDepartments({
    search: debouncedQuery,
    organizationId,
    managerId,
    page,
    perPage: PAGE_SIZE,
  });

  const { data: orgsData } = useOrganizations({ perPage: 100, page: 1 });
  const { data: usersData } = useUsers({ perPage: 100, page: 1 });

  const departments = data?.data ?? [];
  const meta = data?.meta ?? { currentPage: 1, lastPage: 1, total: 0 };
  const organizations = orgsData?.data ?? [];
  const managers = usersData?.data ?? [];
  const showEmpty = !isLoading && !isError && departments.length === 0;

  const resetFilters = () => {
    setQuery('');
    setDebouncedQuery('');
    setOrganizationId('all');
    setManagerId('all');
    setPage(1);
  };

  const onFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary shadow-sm ring-1 ring-primary/10">
              <Network size={17} strokeWidth={2} />
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-primary/12">
              {meta.total ?? '—'} departments
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-heading tracking-tight leading-tight">
            Departments
          </h1>
          <p className="mt-1.5 max-w-lg text-[13px] sm:text-[14px] text-secondaryText leading-relaxed">
            Structure teams by department across every organization workspace.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => setCreateOpen(true)}
          className="h-11 rounded-xl gap-2 text-[13px] font-semibold shadow-[0_6px_16px_rgba(37,99,235,0.28)]"
        >
          <Plus size={16} strokeWidth={2.25} />
          New Department
        </Button>
      </motion.section>

      {successMsg ? (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-50 px-3.5 py-2.5 text-[13px] font-medium text-emerald-800"
        >
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
        className="
          flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between
          rounded-[20px] border border-border/45 bg-white/85 backdrop-blur-md
          p-3 sm:p-3.5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]
        "
      >
        <div className="relative flex-1 max-w-xl">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search departments..."
            className="
              w-full h-10 rounded-xl border border-border/60 bg-white/90
              pl-10 pr-3 text-[13px] text-heading placeholder:text-slate-400
              focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12
            "
            aria-label="Search departments"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400 px-1">
            <Filter size={12} />
            Filters
          </span>
          <select
            value={organizationId}
            onChange={onFilterChange(setOrganizationId)}
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
          <select
            value={managerId}
            onChange={onFilterChange(setManagerId)}
            className={`${selectClass} max-w-[180px]`}
            aria-label="Filter by manager"
          >
            <option value="all">All managers</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <div className="inline-flex rounded-xl border border-border/60 bg-slate-50/80 p-0.5" role="group">
            <button
              type="button"
              onClick={() => setView('grid')}
              aria-pressed={view === 'grid'}
              aria-label="Grid view"
              className={`inline-flex h-9 w-9 items-center justify-center rounded-[10px] ${
                view === 'grid'
                  ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                  : 'text-slate-400 hover:text-heading'
              }`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => setView('table')}
              aria-pressed={view === 'table'}
              aria-label="Table view"
              className={`inline-flex h-9 w-9 items-center justify-center rounded-[10px] ${
                view === 'table'
                  ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                  : 'text-slate-400 hover:text-heading'
              }`}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </motion.div>

      {isError ? (
        <ErrorState
          title="Couldn’t load departments"
          message={error?.response?.data?.message || error?.message || 'Please try again.'}
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <DepartmentsSkeleton view={view} />
      ) : showEmpty ? (
        <div className="rounded-[20px] border border-border/45 bg-white/85 py-6 shadow-sm">
          <EmptyState
            icon={Network}
            title="No departments found"
            description="Try another keyword or clear filters to see all departments."
            action={
              <Button type="button" variant="secondary" onClick={resetFilters} className="rounded-xl">
                Clear filters
              </Button>
            }
          />
        </div>
      ) : view === 'grid' ? (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4 ${
            isFetching ? 'opacity-80' : ''
          }`}
        >
          {departments.map((dept, i) => (
            <DepartmentCard key={dept.id} dept={dept} index={i} />
          ))}
        </div>
      ) : (
        <div className={isFetching ? 'opacity-80' : ''}>
          <DepartmentTable departments={departments} />
        </div>
      )}

      {!isLoading && !isError && departments.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12.5px] text-secondaryText">
            Page{' '}
            <span className="font-semibold text-heading tabular-nums">{meta.currentPage}</span>
            {' '}of{' '}
            <span className="font-semibold text-heading tabular-nums">{meta.lastPage}</span>
            {' · '}
            <span className="font-semibold text-heading tabular-nums">{meta.total}</span>
            {' '}departments
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={meta.currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-10 rounded-xl text-[13px] font-semibold bg-white/90 disabled:opacity-40"
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={meta.currentPage >= meta.lastPage}
              onClick={() => setPage((p) => p + 1)}
              className="h-10 rounded-xl text-[13px] font-semibold bg-white/90 disabled:opacity-40"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <CreateDepartmentModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(dept) => {
          setSuccessMsg(`“${dept?.name || 'Department'}” created successfully.`);
          setPage(1);
          window.setTimeout(() => setSuccessMsg(''), 4000);
        }}
      />
    </div>
  );
};

export default Departments;
