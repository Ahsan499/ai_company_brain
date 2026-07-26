import { Check, X } from 'lucide-react';
import { PERMISSIONS, PERMISSION_MATRIX, SETTINGS_ROLES } from './settingsData';

const Cell = ({ on }) =>
  on ? (
    <Check size={15} className="mx-auto text-emerald-600" strokeWidth={2.5} />
  ) : (
    <X size={15} className="mx-auto text-slate-300" strokeWidth={2.2} />
  );

const PermissionMatrix = () => (
  <>
    {/* Mobile card list */}
    <ul className="space-y-3 lg:hidden">
      {PERMISSIONS.map((perm) => (
        <li
          key={perm.id}
          className="rounded-[16px] border border-border/45 bg-slate-50/50 p-3.5"
        >
          <p className="text-[13px] font-semibold text-heading mb-2.5">{perm.label}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {SETTINGS_ROLES.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-white px-2 py-1.5 ring-1 ring-border/40"
              >
                <span className="text-[10.5px] font-medium text-secondaryText truncate">
                  {role.label}
                </span>
                <Cell on={Boolean(PERMISSION_MATRIX[perm.id]?.[role.id])} />
              </div>
            ))}
          </div>
        </li>
      ))}
    </ul>

    {/* Desktop matrix */}
    <div className="hidden lg:block overflow-x-auto dashboard-scrollbar -mx-1">
      <table className="w-full min-w-[720px] text-left border-collapse">
        <thead>
          <tr className="border-b border-border/50">
            <th className="px-3 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400 sticky left-0 bg-white/95">
              Permission
            </th>
            {SETTINGS_ROLES.map((role) => (
              <th
                key={role.id}
                className="px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400 max-w-[72px]"
              >
                <span className="block leading-tight">{role.label}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERMISSIONS.map((perm) => (
            <tr key={perm.id} className="border-b border-border/35 last:border-0 hover:bg-slate-50/60">
              <td className="px-3 py-3 text-[12.5px] font-semibold text-heading sticky left-0 bg-white/95">
                {perm.label}
              </td>
              {SETTINGS_ROLES.map((role) => (
                <td key={role.id} className="px-2 py-3 text-center">
                  <Cell on={Boolean(PERMISSION_MATRIX[perm.id]?.[role.id])} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

export default PermissionMatrix;
