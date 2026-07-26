import { motion } from 'framer-motion';

const ToggleRow = ({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) => (
  <div
    className="
      flex items-start justify-between gap-4 py-3.5
      border-b border-border/40 last:border-0 last:pb-0 first:pt-0
    "
  >
    <div className="min-w-0">
      <label htmlFor={id} className="text-[13.5px] font-semibold text-heading cursor-pointer">
        {label}
      </label>
      {description && (
        <p className="mt-0.5 text-[12.5px] text-secondaryText leading-relaxed">
          {description}
        </p>
      )}
    </div>

    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`
        relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
        disabled:opacity-50
        ${checked ? 'bg-primary' : 'bg-slate-200'}
      `}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm"
        style={{ x: checked ? 20 : 0 }}
        animate={{ x: checked ? 20 : 0 }}
      />
    </button>
  </div>
);

export default ToggleRow;
