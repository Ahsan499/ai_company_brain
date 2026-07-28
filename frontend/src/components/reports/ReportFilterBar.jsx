import { Download, Filter } from 'lucide-react';
import Button from '../ui/Button';

const selectClass =
  'h-10 rounded-xl border border-border/60 bg-white px-3 text-[12.5px] font-medium text-heading focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12';

const ReportFilterBar = ({
  preset,
  onPresetChange,
  organizationId,
  onOrganizationChange,
  departmentId,
  onDepartmentChange,
  customAfter,
  customBefore,
  onCustomAfter,
  onCustomBefore,
  organizations = [],
  departments = [],
  onExport,
}) => {
  return (
    <div
      className="
        flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between
        rounded-[20px] border border-border/45 bg-white/90 p-3.5 sm:p-4
        shadow-[0_2px_12px_rgba(15,23,42,0.04)]
      "
    >
      <div className="flex flex-wrap items-end gap-2.5 sm:gap-3">
        <span className="mb-2 hidden sm:inline-flex text-slate-400">
          <Filter size={15} strokeWidth={2} />
        </span>

        <label className="flex flex-col gap-1 min-w-[130px]">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            Period
          </span>
          <select
            className={selectClass}
            value={preset}
            onChange={(e) => onPresetChange?.(e.target.value)}
          >
            <option value="this-week">This week</option>
            <option value="this-month">This month</option>
            <option value="this-quarter">This quarter</option>
            <option value="custom">Custom</option>
          </select>
        </label>

        {preset === 'custom' && (
          <>
            <label className="flex flex-col gap-1">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                From
              </span>
              <input
                type="date"
                className={selectClass}
                value={customAfter}
                onChange={(e) => onCustomAfter?.(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                To
              </span>
              <input
                type="date"
                className={selectClass}
                value={customBefore}
                onChange={(e) => onCustomBefore?.(e.target.value)}
              />
            </label>
          </>
        )}

        <label className="flex flex-col gap-1 min-w-[160px]">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            Organization
          </span>
          <select
            className={selectClass}
            value={organizationId}
            onChange={(e) => {
              onOrganizationChange?.(e.target.value);
              onDepartmentChange?.('all');
            }}
          >
            <option value="all">All organizations</option>
            {organizations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 min-w-[150px]">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            Department
          </span>
          <select
            className={selectClass}
            value={departmentId}
            onChange={(e) => onDepartmentChange?.(e.target.value)}
          >
            <option value="all">All departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="h-10 rounded-xl bg-white gap-2 shrink-0"
        onClick={onExport}
      >
        <Download size={15} />
        Export
      </Button>
    </div>
  );
};

export default ReportFilterBar;
