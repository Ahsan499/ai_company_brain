import { Link } from 'react-router-dom';

/**
 * Stacked overlapping avatars with overflow count.
 * Reusable for Projects, Teams, Meetings.
 */
const MemberAvatarStack = ({
  members = [],
  max = 4,
  size = 'md',
  linkToUsers = true,
  className = '',
}) => {
  const visible = members.slice(0, max);
  const overflow = Math.max(0, members.length - max);
  const dim =
    size === 'sm' ? 'h-7 w-7 text-[9px]' : size === 'lg' ? 'h-9 w-9 text-[11px]' : 'h-8 w-8 text-[10px]';

  const Avatar = ({ initials, name }) => (
    <span
      title={name}
      className={`
        relative inline-flex items-center justify-center rounded-full
        bg-gradient-to-br from-primary to-[#1D4ED8] text-white font-semibold
        ring-2 ring-white shadow-sm ${dim}
      `}
    >
      {initials}
    </span>
  );

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex -space-x-2">
        {visible.map((m) =>
          linkToUsers && m.userId ? (
            <Link
              key={m.userId}
              to={`/dashboard/users/${m.userId}`}
              className="relative hover:z-10 focus:z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-full"
              onClick={(e) => e.stopPropagation()}
              title={m.name}
            >
              <Avatar initials={m.initials} name={m.name} />
            </Link>
          ) : (
            <span key={m.userId || m.initials} className="relative">
              <Avatar initials={m.initials} name={m.name} />
            </span>
          )
        )}
        {overflow > 0 && (
          <span
            className={`
              relative inline-flex items-center justify-center rounded-full
              bg-slate-100 text-slate-600 font-semibold ring-2 ring-white
              ${dim}
            `}
          >
            +{overflow}
          </span>
        )}
      </div>
    </div>
  );
};

export default MemberAvatarStack;
