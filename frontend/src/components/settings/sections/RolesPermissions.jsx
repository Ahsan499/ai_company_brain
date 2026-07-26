import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import SettingsSection from '../SettingsSection';
import PermissionMatrix from '../PermissionMatrix';
import { USERS } from '../../users/userData';
import { ROLE_COUNT_MAP, SETTINGS_ROLES } from '../settingsData';

const RolesPermissions = () => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('employee');

  const counts = useMemo(() => {
    const map = Object.fromEntries(SETTINGS_ROLES.map((r) => [r.id, 0]));
    USERS.forEach((u) => {
      const key = ROLE_COUNT_MAP[u.role];
      if (key && map[key] != null) map[key] += 1;
    });
    return map;
  }, []);

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
        <div className="overflow-hidden rounded-[16px] border border-border/50 mb-2">
          <ul className="divide-y divide-border/40 md:hidden">
            {SETTINGS_ROLES.map((role) => (
              <li key={role.id} className="flex items-center justify-between gap-3 px-3.5 py-3">
                <div>
                  <p className="text-[13px] font-semibold text-heading">{role.label}</p>
                  <p className="text-[11.5px] text-secondaryText">{role.description}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-secondaryText">
                  {counts[role.id]}
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
                {SETTINGS_ROLES.map((role) => (
                  <tr key={role.id} className="border-b border-border/35 last:border-0 hover:bg-slate-50/60">
                    <td className="px-4 py-3.5 text-[13px] font-semibold text-heading">{role.label}</td>
                    <td className="px-4 py-3.5 text-[12.5px] text-secondaryText">{role.description}</td>
                    <td className="px-4 py-3.5 text-[13px] tabular-nums font-medium text-heading">
                      {counts[role.id]}
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

      <AnimatePresence>
        {inviteOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close"
              className="fixed inset-0 z-[70] bg-heading/25 backdrop-blur-[4px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInviteOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="
                fixed left-1/2 top-1/2 z-[80] w-[min(420px,92vw)] -translate-x-1/2 -translate-y-1/2
                rounded-[20px] border border-border/50 bg-white p-5 shadow-2xl space-y-4
              "
            >
              <h3 className="text-[16px] font-bold text-heading">Invite with role</h3>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
              />
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Role</label>
                <select
                  className="block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                >
                  {SETTINGS_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="secondary" className="rounded-xl" onClick={() => setInviteOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="rounded-xl"
                  onClick={() => {
                    setEmail('');
                    setInviteOpen(false);
                  }}
                >
                  Send invite
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RolesPermissions;
