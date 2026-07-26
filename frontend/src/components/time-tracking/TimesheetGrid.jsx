import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatHoursDecimal } from './timeEntryData';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TimesheetGrid = ({ rows = [], weekDates = [], onCellChange }) => {
  const dayTotals = weekDates.map((d) =>
    rows.reduce((acc, row) => acc + (row.days[d] || 0), 0)
  );
  const weekTotal = dayTotals.reduce((a, b) => a + b, 0);

  if (!rows.length) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-border/45 bg-white/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto dashboard-scrollbar">
        <table className="w-full min-w-[820px] text-left">
          <thead>
            <tr className="border-b border-border/50 bg-slate-50/80">
              <th className="px-4 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400 min-w-[220px]">
                Task / Project
              </th>
              {weekDates.map((d, i) => (
                <th
                  key={d}
                  className="px-2 py-3 text-center text-[10.5px] font-semibold uppercase tracking-[0.06em] text-slate-400 w-[72px]"
                >
                  <span className="block">{DAY_LABELS[i]}</span>
                  <span className="mt-0.5 block text-[10px] font-medium tabular-nums text-slate-400 normal-case tracking-normal">
                    {d.slice(8)}
                  </span>
                </th>
              ))}
              <th className="px-3 py-3 text-center text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400 w-[72px]">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <motion.tr
                key={row.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="border-b border-border/35 last:border-0 hover:bg-slate-50/60"
              >
                <td className="px-4 py-3">
                  <Link
                    to={`/dashboard/tasks/${row.taskId}`}
                    className="block text-[13px] font-semibold text-heading hover:text-primary truncate max-w-[260px]"
                  >
                    {row.taskTitle}
                  </Link>
                  <Link
                    to={`/dashboard/projects/${row.projectId}`}
                    className="mt-0.5 block text-[11.5px] text-secondaryText hover:text-primary truncate"
                  >
                    {row.projectName}
                  </Link>
                </td>
                {weekDates.map((d) => (
                  <td key={d} className="px-1.5 py-2 text-center">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={
                        row.days[d]
                          ? formatHoursDecimal(row.days[d])
                          : ''
                      }
                      onChange={(e) => {
                        const raw = e.target.value.trim();
                        const hours = raw === '' ? 0 : Number.parseFloat(raw);
                        if (Number.isNaN(hours)) return;
                        onCellChange?.(row.key, d, Math.round(hours * 60));
                      }}
                      placeholder="—"
                      className="
                        h-9 w-[64px] rounded-lg border border-transparent bg-transparent
                        text-center text-[12.5px] font-semibold tabular-nums text-heading
                        hover:border-border/60 hover:bg-white
                        focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12 focus:bg-white
                      "
                      aria-label={`${row.taskTitle} ${d}`}
                    />
                  </td>
                ))}
                <td className="px-3 py-3 text-center text-[13px] font-bold tabular-nums text-primary">
                  {formatHoursDecimal(row.rowTotal)}
                </td>
              </motion.tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50/90 border-t border-border/50">
              <td className="px-4 py-3 text-[12px] font-semibold text-secondaryText">Day totals</td>
              {dayTotals.map((mins, i) => (
                <td
                  key={weekDates[i]}
                  className="px-2 py-3 text-center text-[12.5px] font-semibold tabular-nums text-heading"
                >
                  {mins ? formatHoursDecimal(mins) : '—'}
                </td>
              ))}
              <td className="px-3 py-3 text-center text-[13px] font-bold tabular-nums text-heading">
                {formatHoursDecimal(weekTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TimesheetGrid;
