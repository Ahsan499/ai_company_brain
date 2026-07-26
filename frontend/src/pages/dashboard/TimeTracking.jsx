import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Plus, Timer } from 'lucide-react';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/dashboard/EmptyState';
import TimerWidget from '../../components/time-tracking/TimerWidget';
import TimesheetGrid from '../../components/time-tracking/TimesheetGrid';
import TimeEntryRow from '../../components/time-tracking/TimeEntryRow';
import AddTimeEntryModal from '../../components/time-tracking/AddTimeEntryModal';
import {
  CURRENT_USER_ID,
  REFERENCE_TODAY,
  TIME_ENTRIES,
  buildTimesheetRows,
  formatHours,
  getWeekDates,
  getWeekStart,
  sumMinutes,
} from '../../components/time-tracking/timeEntryData';

const TimeTracking = () => {
  const [entries, setEntries] = useState(TIME_ENTRIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [cellOverrides, setCellOverrides] = useState({});

  const weekStart = getWeekStart(REFERENCE_TODAY);
  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);

  const myEntries = useMemo(
    () =>
      entries
        .filter((e) => e.userId === CURRENT_USER_ID)
        .sort((a, b) => `${b.date}${b.id}`.localeCompare(`${a.date}${a.id}`)),
    [entries]
  );

  const recent = myEntries.slice(0, 12);

  const baseRows = useMemo(
    () => buildTimesheetRows(entries, CURRENT_USER_ID, weekDates),
    [entries, weekDates]
  );

  const timesheetRows = useMemo(
    () =>
      baseRows.map((row) => {
        const days = { ...row.days };
        weekDates.forEach((d) => {
          const key = `${row.key}:${d}`;
          if (key in cellOverrides) days[d] = cellOverrides[key];
        });
        return {
          ...row,
          days,
          rowTotal: weekDates.reduce((acc, d) => acc + (days[d] || 0), 0),
        };
      }),
    [baseRows, cellOverrides, weekDates]
  );

  const weekMinutes = useMemo(
    () => sumMinutes(myEntries.filter((e) => weekDates.includes(e.date))),
    [myEntries, weekDates]
  );

  const onCellChange = (rowKey, date, minutes) => {
    setCellOverrides((prev) => ({ ...prev, [`${rowKey}:${date}`]: minutes }));
  };

  const onDelete = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
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
              <Timer size={17} strokeWidth={2} />
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-primary/12">
              {formatHours(weekMinutes)} this week
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-heading tracking-tight leading-tight">
            Time Tracking
          </h1>
          <p className="mt-1.5 max-w-lg text-[13px] sm:text-[14px] text-secondaryText leading-relaxed">
            Track hours against tasks — timer, weekly timesheet, and recent entries.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/dashboard/time-tracking/reports">
            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-xl gap-2 text-[13px] font-semibold bg-white"
            >
              <BarChart3 size={15} />
              Reports
            </Button>
          </Link>
          <Button
            type="button"
            variant="primary"
            onClick={() => setModalOpen(true)}
            className="h-11 rounded-xl gap-2 text-[13px] font-semibold shadow-[0_6px_16px_rgba(37,99,235,0.28)]"
          >
            <Plus size={16} strokeWidth={2.25} />
            Add Manual Entry
          </Button>
        </div>
      </motion.section>

      <TimerWidget />

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2 px-0.5">
          <div>
            <h2 className="text-[15px] font-semibold text-heading tracking-tight">This week</h2>
            <p className="text-[12px] text-secondaryText">
              {weekDates[0]} → {weekDates[6]} · editable cells (UI only)
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-secondaryText">
            <Clock size={12} />
            {formatHours(weekMinutes)}
          </span>
        </div>

        {timesheetRows.length === 0 ? (
          <div className="rounded-[20px] border border-border/45 bg-white/85 py-6">
            <EmptyState
              icon={Timer}
              title="No time logged this week"
              description="Start the timer or add a manual entry to fill your timesheet."
              action={
                <Button
                  type="button"
                  variant="primary"
                  className="rounded-xl"
                  onClick={() => setModalOpen(true)}
                >
                  Add Manual Entry
                </Button>
              }
            />
          </div>
        ) : (
          <TimesheetGrid
            rows={timesheetRows}
            weekDates={weekDates}
            onCellChange={onCellChange}
          />
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-[15px] font-semibold text-heading tracking-tight px-0.5">
          Recent entries
        </h2>
        {recent.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
            <EmptyState
              icon={Clock}
              title="No entries yet"
              description="Your logged time will appear here."
            />
          </div>
        ) : (
          <ul className="space-y-2.5">
            {recent.map((entry, i) => (
              <TimeEntryRow
                key={entry.id}
                entry={entry}
                index={i}
                onEdit={() => setModalOpen(true)}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </section>

      <AddTimeEntryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default TimeTracking;
