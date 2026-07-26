const ROLE_TONE = {
  Owner: 'bg-primary/10 text-primary ring-primary/15',
  Admin: 'bg-violet-50 text-violet-700 ring-violet-500/15',
  Manager: 'bg-amber-50 text-amber-700 ring-amber-500/15',
  Member: 'bg-slate-100 text-slate-600 ring-slate-300/50',
};

const STATUS_TONE = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-500/15',
  invited: 'bg-blue-50 text-primary ring-primary/15',
  inactive: 'bg-slate-100 text-slate-500 ring-slate-300/50',
};

const MemberRow = ({ member, compact = false }) => {
  if (!member) return null;

  return (
    <div
      className={`
        flex items-center gap-3
        ${compact ? 'py-2.5' : 'px-3.5 py-3 rounded-[14px] border border-transparent hover:border-border/40 hover:bg-white/90'}
        transition-colors duration-150
      `}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[11px] font-semibold ring-2 ring-white shadow-sm">
        {member.initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-heading tracking-tight truncate">
          {member.name}
        </p>
        <p className="text-[11.5px] text-secondaryText truncate">{member.email}</p>
      </div>
      <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
        <span
          className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${
            ROLE_TONE[member.role] || ROLE_TONE.Member
          }`}
        >
          {member.role}
        </span>
        <span className="text-[11px] text-secondaryText">{member.department}</span>
      </div>
      <span
        className={`
          shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ring-1
          ${STATUS_TONE[member.status] || STATUS_TONE.inactive}
        `}
      >
        {member.status}
      </span>
    </div>
  );
};

export default MemberRow;
