import { motion } from 'framer-motion';
import { Users2, MapPin, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ORGANIZATION_PLANS, formatOrgDate } from './organizationData';

const StatusDot = ({ status }) => (
  <span
    className={`
      inline-flex items-center gap-1.5 rounded-full px-2 py-0.5
      text-[10.5px] font-semibold capitalize tracking-tight ring-1
      ${
        status === 'active'
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-500/15'
          : 'bg-slate-100 text-slate-500 ring-slate-300/50'
      }
    `}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        status === 'active' ? 'bg-success' : 'bg-slate-400'
      }`}
    />
    {status}
  </span>
);

const OrganizationCard = ({ org, index = 0 }) => {
  const plan = ORGANIZATION_PLANS[org.plan] || ORGANIZATION_PLANS.starter;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/dashboard/organizations/${org.id}`}
        className="
          group relative flex h-full flex-col
          rounded-[20px] border border-border/45 bg-white/90 backdrop-blur-sm
          p-4 sm:p-5
          shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_4px_16px_rgba(15,23,42,0.04)]
          transition-all duration-200
          hover:-translate-y-0.5
          hover:border-primary/20
          hover:shadow-[0_12px_32px_rgba(37,99,235,0.1)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
        "
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`
              flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl
              bg-gradient-to-br ${org.gradient} text-white text-[13px] font-semibold
              shadow-[0_6px_16px_rgba(37,99,235,0.25)]
              ring-2 ring-white
            `}
          >
            {org.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15px] font-semibold text-heading tracking-[-0.02em] truncate group-hover:text-primary transition-colors">
                {org.name}
              </h3>
              <ArrowUpRight
                size={15}
                className="shrink-0 text-slate-300 opacity-0 -translate-y-0.5 transition-all group-hover:opacity-100 group-hover:text-primary"
              />
            </div>
            <p className="mt-0.5 text-[12px] text-secondaryText truncate">{org.industry}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${plan.tone}`}>
            {plan.label}
          </span>
          <StatusDot status={org.status} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/40 pt-3.5">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-secondaryText">
            <Users2 size={13} strokeWidth={2} className="text-slate-400" />
            {org.memberCount.toLocaleString()} members
          </span>
          <span className="inline-flex items-center gap-1 text-[11.5px] text-slate-400 truncate max-w-[45%]">
            <MapPin size={12} strokeWidth={2} className="shrink-0" />
            <span className="truncate">{org.location}</span>
          </span>
        </div>

        <p className="mt-2 text-[11px] text-slate-400">
          Created {formatOrgDate(org.createdAt)}
        </p>
      </Link>
    </motion.div>
  );
};

export default OrganizationCard;
