import { Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import { CURRENT_PLAN } from './settingsData';

const PlanCard = ({ plan = CURRENT_PLAN, onUpgrade }) => (
  <div
    className="
      relative overflow-hidden rounded-[18px] border border-primary/20
      bg-gradient-to-br from-[#EFF6FF] via-white to-[#F8FAFC] p-5
      shadow-[0_4px_20px_rgba(37,99,235,0.08)]
    "
  >
    <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
    <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 ring-primary/15">
          <Sparkles size={12} />
          Current plan
        </span>
        <h3 className="mt-3 text-[22px] font-bold text-heading tracking-tight">
          {plan.name}
        </h3>
        <p className="mt-1 text-[14px] text-secondaryText">
          <span className="text-[28px] font-bold text-heading tabular-nums">{plan.price}</span>
          {' '}
          {plan.cadence}
        </p>
        <p className="mt-2 text-[12.5px] text-secondaryText">
          Renews {plan.renewalDate} · {plan.seatsUsed}/{plan.seats} seats used
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {plan.features.map((f) => (
            <li
              key={f}
              className="rounded-md bg-white/80 px-2 py-0.5 text-[11px] font-medium text-heading ring-1 ring-border/50"
            >
              {f}
            </li>
          ))}
        </ul>
      </div>
      <Button
        type="button"
        variant="primary"
        className="h-10 rounded-xl shrink-0"
        onClick={onUpgrade}
      >
        Upgrade Plan
      </Button>
    </div>
  </div>
);

export default PlanCard;
