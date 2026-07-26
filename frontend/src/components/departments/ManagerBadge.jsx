import { Link } from 'react-router-dom';

const ManagerBadge = ({
  managerId,
  name,
  initials,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  if (!managerId && !name) return null;

  const avatar =
    size === 'sm' ? 'h-7 w-7 text-[9px]' : size === 'lg' ? 'h-10 w-10 text-[12px]' : 'h-8 w-8 text-[10px]';

  const content = (
    <span className={`inline-flex items-center gap-2 min-w-0 ${className}`}>
      <span
        className={`
          flex shrink-0 items-center justify-center rounded-full
          bg-gradient-to-br from-primary to-[#1D4ED8] text-white font-semibold
          ring-2 ring-white shadow-sm ${avatar}
        `}
      >
        {initials || (name ? name.slice(0, 2).toUpperCase() : '?')}
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] font-semibold text-heading tracking-tight truncate leading-tight">
          {name}
        </span>
        {showLabel && (
          <span className="block text-[10.5px] font-medium text-secondaryText">Manager</span>
        )}
      </span>
    </span>
  );

  if (!managerId) return content;

  return (
    <Link
      to={`/dashboard/users/${managerId}`}
      className="rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 hover:opacity-90 transition-opacity"
      onClick={(e) => e.stopPropagation()}
    >
      {content}
    </Link>
  );
};

export default ManagerBadge;
