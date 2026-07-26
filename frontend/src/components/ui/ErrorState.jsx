import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Inline error card with retry — used across wired module pages.
 */
const ErrorState = ({
  title = 'Something went wrong',
  message = 'We couldn’t load this data. Check your connection and try again.',
  onRetry,
  className = '',
}) => (
  <div
    role="alert"
    className={`
      rounded-[20px] border border-error/15 bg-white/90
      px-5 py-8 sm:px-8
      shadow-[0_2px_12px_rgba(15,23,42,0.04)]
      text-center
      ${className}
    `}
  >
    <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-error ring-1 ring-error/15">
      <AlertCircle size={20} strokeWidth={2} />
    </span>
    <h3 className="text-[15px] font-semibold text-heading tracking-tight">{title}</h3>
    <p className="mt-1.5 mx-auto max-w-md text-[13px] text-secondaryText leading-relaxed">
      {message}
    </p>
    {onRetry ? (
      <Button
        type="button"
        variant="secondary"
        onClick={onRetry}
        className="mt-5 rounded-xl gap-2 h-10 text-[13px] font-semibold"
      >
        <RefreshCw size={14} strokeWidth={2.1} />
        Retry
      </Button>
    ) : null}
  </div>
);

export default ErrorState;
