import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, ChevronRight, FolderKanban, Users2 } from 'lucide-react';
import ManagerBadge from './ManagerBadge';
import StatusBadge from '../users/StatusBadge';

const DepartmentTable = ({ departments = [] }) => {
  return (
    <>
      <ul className="space-y-2.5 md:hidden">
        {departments.map((dept, i) => (
          <motion.li
            key={dept.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link
              to={`/dashboard/departments/${dept.id}`}
              className="
                flex items-center gap-3 rounded-[16px] border border-border/45
                bg-white/90 p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]
                hover:border-primary/20 transition-colors
              "
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${dept.iconTone}`}
              >
                <Briefcase size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold text-heading truncate">{dept.name}</p>
                <p className="mt-0.5 text-[11.5px] text-secondaryText truncate">
                  {dept.organizationName} · {dept.memberIds.length} members
                </p>
                <div className="mt-1.5">
                  <StatusBadge status={dept.status === 'active' ? 'active' : 'suspended'} />
                </div>
              </div>
              <ChevronRight size={16} className="shrink-0 text-slate-300" />
            </Link>
          </motion.li>
        ))}
      </ul>

      <div className="hidden md:block overflow-hidden rounded-[20px] border border-border/45 bg-white/90 backdrop-blur-sm shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto dashboard-scrollbar">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-border/50 bg-slate-50/80">
                {['Department', 'Organization', 'Manager', 'Members', 'Projects', 'Status', ''].map(
                  (h) => (
                    <th
                      key={h || 'action'}
                      className="px-4 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, i) => (
                <motion.tr
                  key={dept.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.025 }}
                  className="group border-b border-border/35 last:border-0 hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <Link
                      to={`/dashboard/departments/${dept.id}`}
                      className="flex items-center gap-3 min-w-0"
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${dept.iconTone}`}
                      >
                        <Briefcase size={14} />
                      </span>
                      <span className="text-[13.5px] font-semibold text-heading tracking-tight truncate group-hover:text-primary transition-colors">
                        {dept.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      to={`/dashboard/organizations/${dept.organizationId}`}
                      className="text-[12.5px] font-medium text-heading hover:text-primary truncate block max-w-[180px]"
                    >
                      {dept.organizationName}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <ManagerBadge
                      managerId={dept.managerId}
                      name={dept.managerName}
                      initials={dept.managerInitials}
                      size="sm"
                      showLabel={false}
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-heading tabular-nums">
                      <Users2 size={13} className="text-slate-400" />
                      {dept.memberIds.length}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-heading tabular-nums">
                      <FolderKanban size={13} className="text-slate-400" />
                      {dept.projectCount}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={dept.status === 'active' ? 'active' : 'suspended'} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      to={`/dashboard/departments/${dept.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white hover:text-primary hover:shadow-sm"
                      aria-label={`Open ${dept.name}`}
                    >
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DepartmentTable;
