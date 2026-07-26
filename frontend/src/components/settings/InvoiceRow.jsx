import { Download } from 'lucide-react';
import Button from '../ui/Button';

const STATUS = {
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-500/15',
  failed: 'bg-rose-50 text-rose-700 ring-rose-500/15',
  pending: 'bg-amber-50 text-amber-800 ring-amber-500/20',
};

const InvoiceRow = ({ invoice, onDownload }) => {
  if (!invoice) return null;
  const tone = STATUS[invoice.status] || STATUS.pending;

  return (
    <div
      className="
        flex flex-col sm:flex-row sm:items-center gap-3
        rounded-[14px] border border-border/40 bg-white px-3.5 py-3
        hover:border-primary/15 transition-colors
      "
    >
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-heading truncate">{invoice.label}</p>
        <p className="mt-0.5 text-[12px] text-secondaryText tabular-nums">{invoice.date}</p>
      </div>
      <span className={`w-fit rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ring-1 ${tone}`}>
        {invoice.status}
      </span>
      <span className="text-[13.5px] font-semibold text-heading tabular-nums sm:w-24 sm:text-right">
        {invoice.amount}
      </span>
      <Button
        type="button"
        variant="ghost"
        className="h-9 rounded-xl gap-1.5 text-[12.5px] shrink-0"
        onClick={() => onDownload?.(invoice.id)}
      >
        <Download size={14} />
        Download
      </Button>
    </div>
  );
};

export default InvoiceRow;
