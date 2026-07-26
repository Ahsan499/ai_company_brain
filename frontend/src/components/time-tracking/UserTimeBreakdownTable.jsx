import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatHoursDecimal } from './timeEntryData';

const UserTimeBreakdownTable = ({ rows = [] }) => {
  if (!rows.length) return null;

  return (
    <>
      <ul className="space-y-2.5 md:hidden">
        {rows.map((row, i) => (
          <motion.li
            key={row.userId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="rounded-[16px] border border-border/45 bg-white/90 p-3.5 shadow-sm"
          >
            <Link to={`/dashboard/users/${row.userId}`} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[11px] font-semibold">
                {row.initials}
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] font-semibold text-heading truncate">
                  {row.userName}
                </span>
                <span className="block text-[11.5px] text-secondaryText truncate">
                  {row.teamName || '—'} · {formatHoursDecimal(row.minutes)}h
                </span>
              </span>
            </Link>
            <div className="mt-2.5 flex gap-2 text-[11px] font-semibold">
              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-emerald-700 ring-1 ring-emerald-500/15">
                {formatHoursDecimal(row.billable)}h billable
              </span>
              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-slate-600 ring-1 ring-slate-300/50">
                {formatHoursDecimal(row.nonBillable)}h other
              </span>
            </div>
          </motion.li>
        ))}
      </ul>

      <div className="hidden md:block overflow-hidden rounded-[20px] border border-border/45 bg-white/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto dashboard-scrollbar">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-border/50 bg-slate-50/80">
                {['Person', 'Team', 'Total hours', 'Billable', 'Non-billable'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.userId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.025 }}
                  className="border-b border-border/35 last:border-0 hover:bg-slate-50/70"
                >
                  <td className="px-4 py-3.5">
                    <Link
                      to={`/dashboard/users/${row.userId}`}
                      className="inline-flex items-center gap-2.5 hover:opacity-90"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[10px] font-semibold">
                        {row.initials}
                      </span>
                      <span className="text-[13px] font-semibold text-heading">{row.userName}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-[12.5px] text-secondaryText">
                    {row.teamName || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] font-bold tabular-nums text-heading">
                    {formatHoursDecimal(row.minutes)}h
                  </td>
                  <td className="px-4 py-3.5 text-[12.5px] font-semibold tabular-nums text-emerald-700">
                    {formatHoursDecimal(row.billable)}h
                  </td>
                  <td className="px-4 py-3.5 text-[12.5px] font-semibold tabular-nums text-slate-500">
                    {formatHoursDecimal(row.nonBillable)}h
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserTimeBreakdownTable;
