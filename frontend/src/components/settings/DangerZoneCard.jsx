import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

const DangerZoneCard = ({
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => (
  <div
    className={`
      rounded-[18px] border border-error/25 bg-rose-50/40 p-4 sm:p-5
      shadow-[0_2px_12px_rgba(239,68,68,0.04)]
      ${className}
    `}
  >
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-error/10 text-error ring-1 ring-error/15">
          <AlertTriangle size={17} strokeWidth={2} />
        </span>
        <div>
          <h3 className="text-[14px] font-semibold text-heading">{title}</h3>
          <p className="mt-1 text-[12.5px] text-secondaryText leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </div>
      <Button
        type="button"
        className="
          h-10 rounded-xl shrink-0
          bg-error text-white hover:bg-rose-600
          focus:ring-error border-transparent
        "
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </div>
  </div>
);

export default DangerZoneCard;
