import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Plus,
  Search,
  LayoutGrid,
  Columns3,
  Filter,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/dashboard/EmptyState';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectBoardColumn from '../../components/projects/ProjectBoardColumn';
import CreateProjectModal from '../../components/projects/CreateProjectModal';
import {
  PROJECT_STATUSES,
  PROJECT_PRIORITIES,
  PRIORITY_META,
  PROJECT_STATUS_META,
} from '../../components/projects/projectData';
import { useProjects } from '../../hooks/useProjects';
import { useOrganizations } from '../../hooks/useOrganizations';
import { useDepartments } from '../../hooks/useDepartments';

const PAGE_SIZE = 9;
const selectClass =
  'h-10 rounded-xl border border-border/60 bg-white px-3 text-[12.5px] font-medium text-heading focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12';

const ProjectsSkeleton = ({ view }) => {
  if (view === 'board') {
    return (
      <div className="overflow-x-auto dashboard-scrollbar -mx-1 px-1 pb-2">
        <div className="flex gap-3 sm:gap-4 min-w-min">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-[280px] sm:w-[300px] rounded-[20px] border border-border/45 bg-white/90 p-3.5 space-y-2.5"
            >
              <Skeleton className="h-5 w-28" rounded="rounded-full" />
              <Skeleton className="h-[120px] w-full" rounded="rounded-[14px]" />
              <Skeleton className="h-[120px] w-full" rounded="rounded-[14px]" />
            </div>
          ))}
        </div>
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

const groupProjectsByStatus = (list) =>
  PROJECT_STATUSES.map((statusKey) => ({
    status: statusKey,
    meta: PROJECT_STATUS_META[statusKey],
    items: list.filter((project) => project.status === statusKey),
  }));

const Projects = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [organizationId, setOrganizationId] = useState('all');
  const [departmentId, setDepartmentId] = useState('all');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(t);
  }, [query]);

  const { data, isLoading, isFetching, isError, error, refetch } = useProjects({
    search: debouncedQuery,
    organizationId,
    departmentId,
    status,
    priority,
    page,
    perPage: PAGE_SIZE,
  });

  const { data: orgsData } = useOrganizations({ perPage: 100, page: 1 });
  const { data: deptsData } = useDepartments({
    organizationId,
    perPage: 100,
    page: 1,
  });

  const projects = data?.data ?? [];
  const meta = data?.meta ?? { currentPage: 1, lastPage: 1, total: 0 };
  const organizations = orgsData?.data ?? [];
  const deptOptions = deptsData?.data ?? [];
  const boardColumns = useMemo(() => groupProjectsByStatus(projects), [projects]);
  const showEmpty = !isLoading && !isError && projects.length === 0;

  const resetFilters = () => {
    setQuery('');
    setDebouncedQuery('');
    setOrganizationId('all');
    setDepartmentId('all');
    setStatus('all');
    setPriority('all');
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
              <FolderKanban size={17} strokeWidth={2} />
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-primary/12">
              {meta.total ?? '—'} projects
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-heading tracking-tight leading-tight">
            Projects
          </h1>
          <p className="mt-1.5 max-w-lg text-[13px] sm:text-[14px] text-secondaryText leading-relaxed">
            Track delivery workspaces across organizations, departments, and teams.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => setCreateOpen(true)}
          className="h-11 rounded-xl gap-2 text-[13px] font-semibold shadow-[0_6px_16px_rgba(37,99,235,0.28)]"
        >
          <Plus size={16} strokeWidth={2.25} />
          New Project
        </Button>
      </motion.section>

      {successMsg ? (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-50 px-3.5 py-2.5 text-[13px] font-medium text-emerald-800"
        >
          {successMsg}
        </div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
        className="
          flex flex-col gap-3
          rounded-[20px] border border-border/45 bg-white/85 backdrop-blur-md
          p-3 sm:p-3.5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]
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
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search projects..."
              className="
                w-full h-10 rounded-xl border border-border/60 bg-white/90
                pl-10 pr-3 text-[13px] text-heading placeholder:text-slate-400
                focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12
              "
              aria-label="Search projects"
            />
          </div>

          <div className="inline-flex self-start rounded-xl border border-border/60 bg-slate-50/80 p-0.5" role="group">
            <button
              type="button"
              onClick={() => setView('grid')}
              aria-pressed={view === 'grid'}
              aria-label="Grid view"
              className={`inline-flex h-9 items-center gap-1.5 rounded-[10px] px-2.5 text-[12px] font-semibold ${
                view === 'grid'
                  ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                  : 'text-slate-400 hover:text-heading'
              }`}
            >
              <LayoutGrid size={14} />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setView('board')}
              aria-pressed={view === 'board'}
              aria-label="Board view"
              className={`inline-flex h-9 items-center gap-1.5 rounded-[10px] px-2.5 text-[12px] font-semibold ${
                view === 'board'
                  ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                  : 'text-slate-400 hover:text-heading'
              }`}
            >
              <Columns3 size={14} />
              Board
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400 px-1">
            <Filter size={12} />
            Filters
          </span>
          <select
            value={organizationId}
            onChange={(e) => {
              setOrganizationId(e.target.value);
              setDepartmentId('all');
              setPage(1);
            }}
            className={`${selectClass} max-w-[200px]`}
          >
            <option value="all">All organizations</option>
            {organizations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
          <select
            value={departmentId}
            onChange={(e) => {
              setDepartmentId(e.target.value);
              setPage(1);
            }}
            className={`${selectClass} max-w-[180px]`}
          >
            <option value="all">All departments</option>
            {deptOptions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="all">All status</option>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {PROJECT_STATUS_META[s].label}
              </option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="all">All priority</option>
            {PROJECT_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_META[p].label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {isError ? (
        <ErrorState
          title="Couldn’t load projects"
          message={error?.response?.data?.message || error?.message || 'Please try again.'}
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <ProjectsSkeleton view={view} />
      ) : showEmpty ? (
        <div className="rounded-[20px] border border-border/45 bg-white/85 py-6 shadow-sm">
          <EmptyState
            icon={FolderKanban}
            title="No projects found"
            description="Try another keyword or clear filters to see all workspaces."
            action={
              <Button type="button" variant="secondary" onClick={resetFilters} className="rounded-xl">
                Clear filters
              </Button>
            }
          />
        </div>
      ) : view === 'board' ? (
        <div className="overflow-x-auto dashboard-scrollbar -mx-1 px-1 pb-2">
          <div className={`flex gap-3 sm:gap-4 min-w-min ${isFetching ? 'opacity-80' : ''}`}>
            {boardColumns.map((col, i) => (
              <ProjectBoardColumn
                key={col.status}
                status={col.status}
                meta={col.meta}
                projects={col.items}
                index={i}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4 ${isFetching ? 'opacity-80' : ''}`}>
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </>
      )}

      {!isLoading && !isError && projects.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12.5px] text-secondaryText">
            Page{' '}
            <span className="font-semibold text-heading tabular-nums">{meta.currentPage}</span>
            {' '}of{' '}
            <span className="font-semibold text-heading tabular-nums">{meta.lastPage}</span>
            {' · '}
            <span className="font-semibold text-heading tabular-nums">{meta.total}</span>
            {' '}projects
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={meta.currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl h-10 text-[13px] font-semibold bg-white/90 disabled:opacity-40"
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={meta.currentPage >= meta.lastPage}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl h-10 text-[13px] font-semibold bg-white/90 disabled:opacity-40"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <CreateProjectModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(project) => {
          setSuccessMsg(`“${project?.name || 'Project'}” created successfully.`);
          setPage(1);
          window.setTimeout(() => setSuccessMsg(''), 4000);
        }}
      />
    </div>
  );
};

export default Projects;
