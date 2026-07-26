import { ROLE_META } from './userData';

const RoleBadge = ({ role, className = '' }) => {
  const meta = ROLE_META[role] || ROLE_META.Employee;
  return (
    <span
      className={`
        inline-flex items-center rounded-md px-1.5 py-0.5
        text-[10.5px] font-semibold tracking-tight ring-1 whitespace-nowrap
        ${meta.tone} ${className}
      `}
    >
      {role}
    </span>
  );
};

export default RoleBadge;
