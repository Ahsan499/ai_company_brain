const AuditDiffView = ({ diffs = [] }) => {
  if (!diffs?.length) {
    return (
      <p className="text-[12.5px] text-secondaryText">No field changes recorded.</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-[14px] border border-border/50 bg-slate-50/80">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border/40">
            {['Field', 'Before', 'After'].map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {diffs.map((d) => (
            <tr key={d.field} className="border-b border-border/30 last:border-0">
              <td className="px-3 py-2.5 text-[12.5px] font-semibold text-heading capitalize">
                {d.field.replace(/_/g, ' ')}
              </td>
              <td className="px-3 py-2.5 text-[12.5px] text-secondaryText">
                <span className="rounded-md bg-rose-50/80 px-1.5 py-0.5 text-rose-700/90 ring-1 ring-rose-500/10 line-through decoration-rose-300/80">
                  {d.before}
                </span>
              </td>
              <td className="px-3 py-2.5 text-[12.5px] text-heading">
                <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-800 ring-1 ring-emerald-500/15">
                  {d.after}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditDiffView;
