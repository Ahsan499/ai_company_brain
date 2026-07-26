import { motion } from 'framer-motion';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import DashboardPanel, { PanelHeader } from '../dashboard/DashboardPanel';
import EmptyState from '../dashboard/EmptyState';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  return (
    <div className="rounded-xl border border-white/10 bg-heading/95 backdrop-blur-md px-3.5 py-2.5 text-white shadow-xl">
      <p className="text-[11px] font-medium text-white/70">{row.name}</p>
      <p className="text-sm font-semibold mt-0.5 tabular-nums">{row.value}</p>
    </div>
  );
};

const StatusDistributionChart = ({
  title = 'Distribution',
  subtitle = '',
  data = [],
  delay = 0,
}) => {
  const isEmpty = !data?.length || data.every((d) => !d.value);
  const total = data.reduce((acc, d) => acc + (d.value || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="h-full"
    >
      <DashboardPanel className="h-full min-h-[340px] flex flex-col" hoverLift={false}>
        <PanelHeader title={title} subtitle={subtitle} />

        {isEmpty ? (
          <EmptyState
            icon={PieIcon}
            title="Nothing to chart"
            description="Distribution will appear when data matches filters."
            className="flex-1"
          />
        ) : (
          <div className="flex flex-1 flex-col sm:flex-row items-center gap-4 min-h-[230px]">
            <div className="w-full sm:w-[55%] h-[200px] sm:h-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={3}
                    strokeWidth={0}
                    animationDuration={900}
                  >
                    {data.map((entry) => (
                      <Cell key={entry.key || entry.name} fill={entry.color || '#2563EB'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="w-full sm:flex-1 space-y-2 px-1">
              {data.map((d) => {
                const pct = total ? Math.round((d.value / total) * 100) : 0;
                return (
                  <li key={d.key || d.name} className="flex items-center justify-between gap-2 text-[12.5px]">
                    <span className="inline-flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ background: d.color || '#2563EB' }}
                      />
                      <span className="font-medium text-heading truncate">{d.name}</span>
                    </span>
                    <span className="tabular-nums text-secondaryText shrink-0">
                      {d.value} · {pct}%
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </DashboardPanel>
    </motion.div>
  );
};

export default StatusDistributionChart;
