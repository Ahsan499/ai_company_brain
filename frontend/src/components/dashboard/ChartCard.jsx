import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DashboardPanel, { PanelHeader } from './DashboardPanel';
import EmptyState from './EmptyState';
import { BarChart3 } from 'lucide-react';

const DEFAULT_DATA = [
  { day: 'Mon', value: 42 },
  { day: 'Tue', value: 58 },
  { day: 'Wed', value: 51 },
  { day: 'Thu', value: 72 },
  { day: 'Fri', value: 68 },
  { day: 'Sat', value: 45 },
  { day: 'Sun', value: 80 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-heading/95 backdrop-blur-md px-3.5 py-2.5 text-white shadow-xl">
      <p className="text-[11px] font-medium text-white/70">{label}</p>
      <p className="text-sm font-semibold mt-0.5 tabular-nums">{payload[0].value} pts</p>
    </div>
  );
};

const ChartCard = ({
  title = 'Weekly Productivity',
  data = DEFAULT_DATA,
  delay = 0,
}) => {
  const isEmpty = !data?.length;

  return (
    <DashboardPanel delay={delay} className="h-full min-h-[340px] flex flex-col" hoverLift={false}>
      <PanelHeader
        title={title}
        subtitle="Last 7 days performance"
        action={
          !isEmpty && (
            <span className="hidden sm:inline-flex rounded-full bg-primary/8 text-primary text-[11px] font-semibold px-3 py-1 ring-1 ring-primary/10">
              +14% vs last week
            </span>
          )
        }
      />

      {isEmpty ? (
        <EmptyState
          icon={BarChart3}
          title="No productivity data"
          description="Charts will appear once workspace activity is recorded."
          className="flex-1"
        />
      ) : (
        <div className="flex-1 w-full min-h-[230px] -ml-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 4, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="productivityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.22} />
                  <stop offset="55%" stopColor="#2563EB" stopOpacity={0.06} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="productivityStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                dy={6}
              />
              <YAxis
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
                dataKey="value"
                stroke="url(#productivityStroke)"
                strokeWidth={2.5}
                fill="url(#productivityFill)"
                animationDuration={1100}
                activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: '#2563EB' }}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardPanel>
  );
};

export default ChartCard;
