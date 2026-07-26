import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Filter,
  List,
  Plus,
  Search,
  UserRound,
  Video,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/dashboard/EmptyState';
import MeetingRow from '../../components/meetings/MeetingRow';
import MeetingCalendarGrid from '../../components/meetings/MeetingCalendarGrid';
import MeetingDetailDrawer from '../../components/meetings/MeetingDetailDrawer';
import CreateMeetingModal from '../../components/meetings/CreateMeetingModal';
import {
  MEETINGS,
  REFERENCE_TODAY,
  filterMeetings,
  getMeetingById,
  getMeetingsForDate,
  groupMeetingsByBucket,
} from '../../components/meetings/meetingData';
import { PROJECTS } from '../../components/projects/projectData';
import { TEAMS } from '../../components/teams/teamData';
import { USERS } from '../../components/users/userData';

const selectClass =
  'h-10 rounded-xl border border-border/60 bg-white px-3 text-[12.5px] font-medium text-heading focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12';

const Meetings = () => {
  const navigate = useNavigate();
  const { id: routeMeetingId } = useParams();

  const [items, setItems] = useState(MEETINGS);
  const [query, setQuery] = useState('');
  const [projectId, setProjectId] = useState('all');
  const [teamId, setTeamId] = useState('all');
  const [organizerId, setOrganizerId] = useState('all');
  const [dateAfter, setDateAfter] = useState('');
  const [dateBefore, setDateBefore] = useState('');
  const [myMeetingsOnly, setMyMeetingsOnly] = useState(false);
  const [view, setView] = useState('list');
  const [createOpen, setCreateOpen] = useState(false);
  const [monthDate, setMonthDate] = useState(() => new Date(2026, 6, 1));
  const [selectedDate, setSelectedDate] = useState(REFERENCE_TODAY);

  const filtered = useMemo(
    () =>
      filterMeetings(items, {
        query,
        projectId,
        teamId,
        organizerId,
        myMeetingsOnly,
        dateAfter,
        dateBefore,
      }),
    [items, query, projectId, teamId, organizerId, myMeetingsOnly, dateAfter, dateBefore]
  );

  const buckets = useMemo(() => groupMeetingsByBucket(filtered), [filtered]);
  const selectedDayMeetings = useMemo(
    () => getMeetingsForDate(filtered, selectedDate),
    [filtered, selectedDate]
  );

  const openMeeting = useCallback(
    (meetingId) => {
      navigate(`/dashboard/meetings/${meetingId}`);
    },
    [navigate]
  );

  const closeMeeting = useCallback(() => {
    navigate('/dashboard/meetings');
  }, [navigate]);

  const activeMeeting = useMemo(() => {
    if (!routeMeetingId) return null;
    return items.find((m) => m.id === routeMeetingId) || getMeetingById(routeMeetingId);
  }, [routeMeetingId, items]);

  useEffect(() => {
    if (routeMeetingId && !activeMeeting) {
      navigate('/dashboard/meetings', { replace: true });
    }
  }, [routeMeetingId, activeMeeting, navigate]);

  const onToggleAgenda = (meetingId, agendaId) => {
    setItems((prev) =>
      prev.map((m) =>
        m.id === meetingId
          ? {
              ...m,
              agenda: m.agenda.map((a) =>
                a.id === agendaId ? { ...a, done: !a.done } : a
              ),
            }
          : m
      )
    );
  };

  const resetFilters = () => {
    setQuery('');
    setProjectId('all');
    setTeamId('all');
    setOrganizerId('all');
    setDateAfter('');
    setDateBefore('');
    setMyMeetingsOnly(false);
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
              <Video size={17} strokeWidth={2} />
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-primary/12">
              {items.length} meetings
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-heading tracking-tight leading-tight">
            Meetings
          </h1>
          <p className="mt-1.5 max-w-lg text-[13px] sm:text-[14px] text-secondaryText leading-relaxed">
            Schedule and track syncs across projects and squads.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => setCreateOpen(true)}
          className="h-11 rounded-xl gap-2 text-[13px] font-semibold shadow-[0_6px_16px_rgba(37,99,235,0.28)]"
        >
          <Plus size={16} strokeWidth={2.25} />
          New Meeting
        </Button>
      </motion.section>

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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search meetings..."
              className="
                w-full h-10 rounded-xl border border-border/60 bg-white/90
                pl-10 pr-3 text-[13px] text-heading placeholder:text-slate-400
                focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12
              "
              aria-label="Search meetings"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMyMeetingsOnly((v) => !v)}
              aria-pressed={myMeetingsOnly}
              className={`
                inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-[12.5px] font-semibold border transition-all
                ${
                  myMeetingsOnly
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'bg-white border-border/60 text-secondaryText hover:text-heading'
                }
              `}
            >
              <UserRound size={14} />
              My Meetings
            </button>

            <div className="inline-flex rounded-xl border border-border/60 bg-slate-50/80 p-0.5" role="group">
              <button
                type="button"
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
                className={`inline-flex h-9 items-center gap-1.5 rounded-[10px] px-2.5 text-[12px] font-semibold ${
                  view === 'list'
                    ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                    : 'text-slate-400 hover:text-heading'
                }`}
              >
                <List size={14} />
                List
              </button>
              <button
                type="button"
                onClick={() => setView('calendar')}
                aria-pressed={view === 'calendar'}
                className={`inline-flex h-9 items-center gap-1.5 rounded-[10px] px-2.5 text-[12px] font-semibold ${
                  view === 'calendar'
                    ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                    : 'text-slate-400 hover:text-heading'
                }`}
              >
                <CalendarDays size={14} />
                Calendar
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400 px-1">
            <Filter size={12} />
            Filters
          </span>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className={`${selectClass} max-w-[200px]`}
          >
            <option value="all">All projects</option>
            {PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className={`${selectClass} max-w-[160px]`}
          >
            <option value="all">All teams</option>
            {TEAMS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <select
            value={organizerId}
            onChange={(e) => setOrganizerId(e.target.value)}
            className={`${selectClass} max-w-[160px]`}
          >
            <option value="all">All organizers</option>
            {USERS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateAfter}
            onChange={(e) => setDateAfter(e.target.value)}
            className={selectClass}
            aria-label="From date"
            title="From date"
          />
          <input
            type="date"
            value={dateBefore}
            onChange={(e) => setDateBefore(e.target.value)}
            className={selectClass}
            aria-label="To date"
            title="To date"
          />
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="rounded-[20px] border border-border/45 bg-white/85 py-6 shadow-sm">
          <EmptyState
            icon={Video}
            title="No meetings found"
            description="Try another filter or clear filters to see all meetings."
            action={
              <Button type="button" variant="secondary" onClick={resetFilters} className="rounded-xl">
                Clear filters
              </Button>
            }
          />
        </div>
      ) : view === 'calendar' ? (
        <div className="space-y-4">
          <div className="hidden md:block">
            <MeetingCalendarGrid
              meetings={filtered}
              monthDate={monthDate}
              onMonthChange={setMonthDate}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
          <div className="md:hidden rounded-[16px] border border-border/45 bg-amber-50/50 px-3.5 py-2.5 text-[12px] text-amber-800">
            Calendar grid is available on larger screens — browse by day below.
          </div>
          <div className="rounded-[20px] border border-border/45 bg-white/90 p-3.5 sm:p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[14px] font-semibold text-heading">
                {selectedDate === REFERENCE_TODAY ? 'Today' : selectedDate}
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`${selectClass} md:hidden`}
                aria-label="Pick a day"
              />
            </div>
            {selectedDayMeetings.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No meetings this day"
                description="Pick another date on the calendar."
              />
            ) : (
              <div className="space-y-2.5">
                {selectedDayMeetings.map((m) => (
                  <MeetingRow key={m.id} meeting={m} onOpen={openMeeting} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {buckets.map((bucket) =>
            bucket.items.length === 0 ? null : (
              <section key={bucket.id}>
                <div className="mb-2.5 flex items-center gap-2 px-0.5">
                  <h2 className="text-[13px] font-semibold text-heading tracking-tight">
                    {bucket.label}
                  </h2>
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 tabular-nums">
                    {bucket.items.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {bucket.items.map((m) => (
                    <MeetingRow key={m.id} meeting={m} onOpen={openMeeting} />
                  ))}
                </div>
              </section>
            )
          )}
        </div>
      )}

      <MeetingDetailDrawer
        open={Boolean(routeMeetingId && activeMeeting)}
        meeting={activeMeeting}
        onClose={closeMeeting}
        onToggleAgenda={onToggleAgenda}
      />

      <CreateMeetingModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
};

export default Meetings;
