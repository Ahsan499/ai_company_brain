import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import DashboardPanel, { PanelHeader } from '../dashboard/DashboardPanel';
import EmptyState from '../dashboard/EmptyState';

const CustomTooltip = ({ active, payload, label, unit = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-heading/95 backdrop-blur-md px-3.5 py-2.5 text-white shadow-xl">
      <p className="text-[11px] font-medium text-white/70 truncate max-w-[180px]">{label}</p>
      <p className="text-sm font-semibold mt-0.5 tabular-nums">
        {payload[0].value}
        {unit}
      </p>
    </div>
  );
};

/**
 * Generic vertical bar chart in ChartCard / DashboardPanel shell.
 * data: [{ name, value }]
 */
const MetricBarChart = ({
  title,
  subtitle,
  data = [],
  valueKey = 'value',
  unit = '',
  delay = 0,
  layout = 'vertical',
}) => {
  const chartData = data.slice(0, 10).map((d) => ({
    name: (d.name || '').length > 16 ? `${d.name.slice(0, 14)}…` : d.name,
    fullName: d.name,
    value: d[valueKey] ?? d.value ?? d.count ?? 0,
  }));
  const isEmpty = !chartData.length || chartData.every((d) => !d.value);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="h-full"
    >
      <DashboardPanel className="h-full min-h-[320px] flex flex-col" hoverLift={false}>
        <PanelHeader title={title} subtitle={subtitle} />

        {isEmpty ? (
          <EmptyState
            icon={BarChart3}
            title="No chart data"
            description="Values will appear when filters match."
            className="flex-1"
          />
        ) : (
          <div className="flex-1 w-full min-h-[220px] -ml-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout={layout === 'horizontal' ? 'vertical' : 'horizontal'}
                margin={{
                  top: 8,
                  right: 8,
                  left: layout === 'horizontal' ? 8 : -16,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 6" stroke="#F1F5F9" vertical={false} />
                {layout === 'horizontal' ? (
                  <>
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
                      width={100}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                    />
                  </>
                ) : (
                  <>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 500 }}
                      interval={0}
                      angle={-18}
                      textAnchor="end"
                      height={56}
                    />
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                    />
                  </>
                )}
                <Tooltip
                  content={<CustomTooltip unit={unit} />}
                  cursor={{ fill: 'rgba(37,99,235,0.04)' }}
                />
                <Bar
                  dataKey="value"
                  fill="#2563EB"
                  radius={[8, 8, 4, 4]}
                  maxBarSize={36}
                  animationDuration={900}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </DashboardPanel>
    </motion.div>
  );
};

export default MetricBarChart;
