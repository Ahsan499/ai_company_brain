import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, LayoutGrid, List, Plus, Search, UsersRound } from 'lucide-react';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/dashboard/EmptyState';
import TeamCard from '../../components/teams/TeamCard';
import TeamTable from '../../components/teams/TeamTable';
import CreateTeamModal from '../../components/teams/CreateTeamModal';
import { TEAMS, filterTeams } from '../../components/teams/teamData';
import { ORGANIZATIONS } from '../../components/organizations/organizationData';
import { DEPARTMENTS } from '../../components/departments/departmentData';

const PAGE_SIZE = 6;
const selectClass =
  'h-10 rounded-xl border border-border/60 bg-white px-3 text-[12.5px] font-medium text-heading focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12';

const Teams = () => {
  const [query, setQuery] = useState('');
  const [organizationId, setOrganizationId] = useState('all');
  const [departmentId, setDepartmentId] = useState('all');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const departmentOptions = useMemo(() => {
    if (organizationId === 'all') return DEPARTMENTS;
    return DEPARTMENTS.filter((d) => d.organizationId === organizationId);
  }, [organizationId]);

  const filtered = useMemo(
    () => filterTeams(TEAMS, { query, organizationId, departmentId }),
    [query, organizationId, departmentId]
  );

  const pageItems = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = pageItems.length < filtered.length;

  const resetFilters = () => {
    setQuery('');
    setOrganizationId('all');
    setDepartmentId('all');
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
              <UsersRound size={17} strokeWidth={2} />
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-primary/12">
              {TEAMS.length} teams
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-heading tracking-tight leading-tight">
            Teams
          </h1>
          <p className="mt-1.5 max-w-lg text-[13px] sm:text-[14px] text-secondaryText leading-relaxed">
            Squads inside departments — reusable crews assigned across projects.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => setCreateOpen(true)}
          className="h-11 rounded-xl gap-2 text-[13px] font-semibold shadow-[0_6px_16px_rgba(37,99,235,0.28)]"
        >
          <Plus size={16} strokeWidth={2.25} />
          New Team
        </Button>
      </motion.section>

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
            placeholder="Search teams..."
            className="
              w-full h-10 rounded-xl border border-border/60 bg-white/90
              pl-10 pr-3 text-[13px] text-heading placeholder:text-slate-400
              focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12
            "
            aria-label="Search teams"
          />
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
            aria-label="Filter by organization"
          >
            <option value="all">All organizations</option>
            {ORGANIZATIONS.map((o) => (
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
            aria-label="Filter by department"
          >
            <option value="all">All departments</option>
            {departmentOptions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
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

      {filtered.length === 0 ? (
        <div className="rounded-[20px] border border-border/45 bg-white/85 py-6 shadow-sm">
          <EmptyState
            icon={UsersRound}
            title="No teams found"
            description="Try another keyword or clear filters to see all teams."
            action={
              <Button type="button" variant="secondary" onClick={resetFilters} className="rounded-xl">
                Clear filters
              </Button>
            }
          />
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
          {pageItems.map((team, i) => (
            <TeamCard key={team.id} team={team} index={i} />
          ))}
        </div>
      ) : (
        <TeamTable teams={pageItems} />
      )}

      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12.5px] text-secondaryText">
            Showing{' '}
            <span className="font-semibold text-heading tabular-nums">{pageItems.length}</span>
            {' '}of{' '}
            <span className="font-semibold text-heading tabular-nums">{filtered.length}</span>
            {' '}teams
          </p>
          {hasMore && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl h-10 text-[13px] font-semibold bg-white/90"
            >
              Load more
            </Button>
          )}
        </div>
      )}

      <CreateTeamModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
};

export default Teams;
