import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { UsersRound } from 'lucide-react';
import DashboardPanel, { PanelHeader } from '../dashboard/DashboardPanel';
import EmptyState from '../dashboard/EmptyState';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  return (
    <div className="rounded-xl border border-white/10 bg-heading/95 backdrop-blur-md px-3.5 py-2.5 text-white shadow-xl">
      <p className="text-[11px] font-medium text-white/70">{row?.fullName || row?.name}</p>
      <p className="text-sm font-semibold mt-0.5 tabular-nums">
        {payload[0].value} tasks completed
      </p>
    </div>
  );
};

const TeamComparisonChart = ({ data = [], delay = 0 }) => {
  const chartData = data.slice(0, 8).map((d) => ({
    name: d.name.length > 14 ? `${d.name.slice(0, 12)}…` : d.name,
    fullName: d.name,
    completed: d.tasksCompleted,
    fill: d.color || '#2563EB',
  }));
  const isEmpty = !chartData.length || chartData.every((d) => !d.completed);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="h-full"
    >
      <DashboardPanel className="h-full min-h-[340px] flex flex-col" hoverLift={false}>
        <PanelHeader
          title="Team comparison"
          subtitle="Tasks completed per team"
        />

        {isEmpty ? (
          <EmptyState
            icon={UsersRound}
            title="No team completions"
            description="Completed work by team members will chart here."
            className="flex-1"
          />
        ) : (
          <div className="flex-1 w-full min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 4, right: 12, left: 4, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 6" stroke="#F1F5F9" horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={96}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37,99,235,0.04)' }} />
                <Bar
                  dataKey="completed"
                  radius={[0, 8, 8, 0]}
                  maxBarSize={22}
                  animationDuration={900}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.fullName} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </DashboardPanel>
    </motion.div>
  );
};

export default TeamComparisonChart;
