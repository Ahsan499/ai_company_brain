import { useMemo, useState } from 'react';
import { UserPlus } from 'lucide-react';
import Button from '../../ui/Button';
import SettingsSection from '../SettingsSection';
import PermissionMatrix from '../PermissionMatrix';
import { SETTINGS_ROLES } from '../settingsData';
import { useUsers } from '../../../hooks/useUsers';
import InviteUserModal from '../../users/InviteUserModal';

const RolesPermissions = () => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const { data: usersData } = useUsers({ perPage: 200, page: 1 });

  const roleRows = useMemo(() => {
    const users = usersData?.data ?? [];
    const countByLabel = users.reduce((acc, user) => {
      const key = String(user.role || 'Unknown');
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const rows = Object.entries(countByLabel).map(([label, count]) => ({
      id: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      description: 'Live role from users data',
      count,
    }));
    return rows.length ? rows : SETTINGS_ROLES.map((role) => ({ ...role, count: 0 }));
  }, [usersData]);

  return (
    <div className="space-y-5">
      <SettingsSection
        title="Roles & Permissions"
        description="Workspace roles and what each role can access."
        action={
          <Button
            type="button"
            variant="primary"
            className="h-10 rounded-xl gap-2"
            onClick={() => setInviteOpen(true)}
          >
            <UserPlus size={15} />
            Invite with Role
          </Button>
        }
      >
        <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Roles endpoint is not available yet; showing live role/member counts derived from current users.
        </p>
        <div className="overflow-hidden rounded-[16px] border border-border/50 mb-2">
          <ul className="divide-y divide-border/40 md:hidden">
            {roleRows.map((role) => (
              <li key={role.id} className="flex items-center justify-between gap-3 px-3.5 py-3">
                <div>
                  <p className="text-[13px] font-semibold text-heading">{role.label}</p>
                  <p className="text-[11.5px] text-secondaryText">{role.description}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-secondaryText">
                  {role.count}
                </span>
              </li>
            ))}
          </ul>

          <div className="hidden md:block overflow-x-auto dashboard-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/50 bg-slate-50/80">
                  {['Role', 'Description', 'Members'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roleRows.map((role) => (
                  <tr key={role.id} className="border-b border-border/35 last:border-0 hover:bg-slate-50/60">
                    <td className="px-4 py-3.5 text-[13px] font-semibold text-heading">{role.label}</td>
                    <td className="px-4 py-3.5 text-[12.5px] text-secondaryText">{role.description}</td>
                    <td className="px-4 py-3.5 text-[13px] tabular-nums font-medium text-heading">
                      {role.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Permission matrix"
        description="Read-only overview of capabilities by role."
      >
        <PermissionMatrix />
      </SettingsSection>

      <InviteUserModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
};

export default RolesPermissions;
