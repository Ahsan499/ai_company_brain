import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Plus,
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  CheckCircle2,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/dashboard/EmptyState';
import OrganizationCard from '../../components/organizations/OrganizationCard';
import OrganizationTable from '../../components/organizations/OrganizationTable';
import CreateOrganizationModal from '../../components/organizations/CreateOrganizationModal';
import { useOrganizations } from '../../hooks/useOrganizations';

const PAGE_SIZE = 6;

const OrganizationsSkeleton = ({ view }) => {
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

const Organizations = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [plan, setPlan] = useState('all');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(t);
  }, [query]);

  const { data, isLoading, isFetching, isError, error, refetch } = useOrganizations({
    search: debouncedQuery,
    status,
    plan,
    page,
    perPage: PAGE_SIZE,
  });

  const organizations = data?.data ?? [];
  const meta = data?.meta ?? { currentPage: 1, lastPage: 1, total: 0 };
  const showEmpty = !isLoading && !isError && organizations.length === 0;

  const resetFilters = () => {
    setQuery('');
    setDebouncedQuery('');
    setStatus('all');
    setPlan('all');
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
              <Building2 size={17} strokeWidth={2} />
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-primary/12">
              {meta.total ?? '—'} workspaces
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-heading tracking-tight leading-tight">
            Organizations
          </h1>
          <p className="mt-1.5 max-w-lg text-[13px] sm:text-[14px] text-secondaryText leading-relaxed">
            Manage company workspaces, plans, and membership across your enterprise.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => setCreateOpen(true)}
          className="h-11 rounded-xl gap-2 text-[13px] font-semibold shadow-[0_6px_16px_rgba(37,99,235,0.28)]"
        >
          <Plus size={16} strokeWidth={2.25} />
          New Organization
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
          p-3 sm:p-3.5
          shadow-[0_2px_12px_rgba(15,23,42,0.04)]
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
            placeholder="Search organizations, industry, owner..."
            className="
              w-full h-10 rounded-xl border border-border/60 bg-white/90
              pl-10 pr-3 text-[13px] text-heading placeholder:text-slate-400
              focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12
              transition-all
            "
            aria-label="Search organizations"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400 px-1">
            <SlidersHorizontal size={12} />
            Filters
          </span>
          <select
            value={status}
            onChange={onFilterChange(setStatus)}
            className="h-10 rounded-xl border border-border/60 bg-white px-3 text-[12.5px] font-medium text-heading focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12"
            aria-label="Filter by status"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={plan}
            onChange={onFilterChange(setPlan)}
            className="h-10 rounded-xl border border-border/60 bg-white px-3 text-[12.5px] font-medium text-heading focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12"
            aria-label="Filter by plan"
          >
            <option value="all">All plans</option>
            <option value="starter">Starter</option>
            <option value="growth">Growth</option>
            <option value="scale">Scale</option>
            <option value="enterprise">Enterprise</option>
          </select>

          <div
            className="inline-flex rounded-xl border border-border/60 bg-slate-50/80 p-0.5"
            role="group"
            aria-label="View mode"
          >
            <button
              type="button"
              onClick={() => setView('grid')}
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
            <button
              type="button"
              onClick={() => setView('table')}
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
          </div>
        </div>
      </motion.div>

      {isError ? (
        <ErrorState
          title="Couldn’t load organizations"
          message={error?.response?.data?.message || error?.message || 'Please try again.'}
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <OrganizationsSkeleton view={view} />
      ) : showEmpty ? (
        <div className="rounded-[20px] border border-border/45 bg-white/85 py-6 shadow-sm">
          <EmptyState
            icon={Building2}
            title="No organizations found"
            description="Try another keyword or clear your filters to see all workspaces."
            action={
              <Button type="button" variant="secondary" onClick={resetFilters} className="rounded-xl">
                Clear filters
              </Button>
            }
          />
        </div>
      ) : view === 'grid' ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4 ${isFetching ? 'opacity-80' : ''}`}>
          {organizations.map((org, i) => (
            <OrganizationCard key={org.id} org={org} index={i} />
          ))}
        </div>
      ) : (
        <div className={isFetching ? 'opacity-80' : ''}>
          <OrganizationTable organizations={organizations} />
        </div>
      )}

      {!isLoading && !isError && organizations.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <p className="text-[12.5px] text-secondaryText">
            Page{' '}
            <span className="font-semibold text-heading tabular-nums">{meta.currentPage}</span>
            {' '}of{' '}
            <span className="font-semibold text-heading tabular-nums">{meta.lastPage}</span>
            {' · '}
            <span className="font-semibold text-heading tabular-nums">{meta.total}</span>
            {' '}organizations
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

      <CreateOrganizationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(org) => {
          setSuccessMsg(`“${org?.name || 'Organization'}” created successfully.`);
          setPage(1);
          window.setTimeout(() => setSuccessMsg(''), 4000);
        }}
      />
    </div>
  );
};

export default Organizations;
