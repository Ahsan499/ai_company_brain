import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import DashboardPanel, { PanelHeader } from '../dashboard/DashboardPanel';
import EmptyState from '../dashboard/EmptyState';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-heading/95 backdrop-blur-md px-3.5 py-2.5 text-white shadow-xl">
      <p className="text-[11px] font-medium text-white/70">Week of {label}</p>
      <p className="text-sm font-semibold mt-0.5 tabular-nums">
        {payload[0].value} completed
      </p>
    </div>
  );
};

const TaskTrendChart = ({ data = [], delay = 0 }) => {
  const isEmpty = !data?.length || data.every((d) => !d.completed);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="h-full"
    >
      <DashboardPanel className="h-full min-h-[340px] flex flex-col" hoverLift={false}>
        <PanelHeader
          title="Task completion trend"
          subtitle="Done tasks by due week · last 8 weeks"
          action={
            !isEmpty && (
              <span className="hidden sm:inline-flex rounded-full bg-primary/8 text-primary text-[11px] font-semibold px-3 py-1 ring-1 ring-primary/10">
                Derived from tasks
              </span>
            )
          }
        />

        {isEmpty ? (
          <EmptyState
            icon={TrendingUp}
            title="No completion data"
            description="Completed tasks in range will plot here."
            className="flex-1"
          />
        ) : (
          <div className="flex-1 w-full min-h-[230px] -ml-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 4, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="reportTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.22} />
                    <stop offset="55%" stopColor="#2563EB" stopOpacity={0.06} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                  dy={6}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fill="url(#reportTrendFill)"
                  animationDuration={1100}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: '#2563EB' }}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </DashboardPanel>
    </motion.div>
  );
};

export default TaskTrendChart;
