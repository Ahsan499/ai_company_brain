import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMeetingsForDate, REFERENCE_TODAY } from './meetingData';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function startOfMonth(year, month) {
  return new Date(year, month, 1);
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function toISODate(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

const MeetingCalendarGrid = ({
  meetings = [],
  monthDate,
  onMonthChange,
  selectedDate,
  onSelectDate,
}) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const cells = useMemo(() => {
    const first = startOfMonth(year, month);
    const startPad = first.getDay();
    const total = daysInMonth(year, month);
    const result = [];
    for (let i = 0; i < startPad; i += 1) result.push(null);
    for (let d = 1; d <= total; d += 1) result.push(d);
    while (result.length % 7 !== 0) result.push(null);
    return result;
  }, [year, month]);

  const monthLabel = monthDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const shiftMonth = (delta) => {
    const next = new Date(year, month + delta, 1);
    onMonthChange?.(next);
  };

  return (
    <div className="rounded-[20px] border border-border/45 bg-white/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)] overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border/40 px-4 py-3.5">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-secondaryText hover:bg-slate-50 hover:text-heading"
          aria-label="Previous month"
        >
          <ChevronLeft size={17} />
        </button>
        <h2 className="text-[14px] font-semibold text-heading tracking-tight">{monthLabel}</h2>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-secondaryText hover:bg-slate-50 hover:text-heading"
          aria-label="Next month"
        >
          <ChevronRight size={17} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border/30 p-px">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="bg-slate-50/90 px-1 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400"
          >
            {d}
          </div>
        ))}
        {cells.map((day, idx) => {
          if (day == null) {
            return <div key={`e-${idx}`} className="min-h-[72px] bg-slate-50/40" />;
          }
          const iso = toISODate(year, month, day);
          const dayMeetings = getMeetingsForDate(meetings, iso);
          const isToday = iso === REFERENCE_TODAY;
          const isSelected = iso === selectedDate;
          const dots = dayMeetings.slice(0, 3);

          return (
            <motion.button
              key={iso}
              type="button"
              whileHover={{ scale: 1.01 }}
              onClick={() => onSelectDate?.(iso)}
              className={`
                min-h-[72px] bg-white px-1.5 py-1.5 text-left transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/25
                ${isSelected ? 'bg-primary/[0.06] ring-1 ring-inset ring-primary/25' : 'hover:bg-slate-50/80'}
              `}
            >
              <span
                className={`
                  inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold tabular-nums
                  ${
                    isToday
                      ? 'bg-primary text-white'
                      : isSelected
                        ? 'text-primary'
                        : 'text-heading'
                  }
                `}
              >
                {day}
              </span>
              <div className="mt-1.5 flex flex-wrap gap-0.5">
                {dots.map((m) => (
                  <span
                    key={m.id}
                    title={m.title}
                    className={`h-1.5 w-1.5 rounded-full ${
                      m.status === 'cancelled'
                        ? 'bg-rose-400'
                        : m.status === 'completed'
                          ? 'bg-slate-400'
                          : m.status === 'ongoing'
                            ? 'bg-emerald-500'
                            : 'bg-primary'
                    }`}
                  />
                ))}
                {dayMeetings.length > 3 && (
                  <span className="text-[9px] font-semibold text-slate-400">
                    +{dayMeetings.length - 3}
                  </span>
                )}
              </div>
              {dayMeetings[0] && (
                <p className="mt-1 hidden lg:block text-[10px] font-medium text-secondaryText truncate">
                  {dayMeetings[0].title}
                </p>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MeetingCalendarGrid;
