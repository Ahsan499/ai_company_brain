const TeamStatCard = ({ icon: Icon, label, value, tone }) => (
  <div className="rounded-[18px] border border-border/45 bg-white/90 p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
    <span
      className={`mb-3 flex h-9 w-9 items-center justify-center rounded-[11px] bg-gradient-to-br ring-1 ${tone}`}
    >
      {Icon ? <Icon size={15} strokeWidth={2} /> : null}
    </span>
    <p className="text-[22px] font-semibold text-heading tracking-tight tabular-nums leading-none">
      {value}
    </p>
    <p className="mt-1.5 text-[12px] font-medium text-secondaryText">{label}</p>
  </div>
);

export default TeamStatCard;
