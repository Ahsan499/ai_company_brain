import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, FolderKanban, Users2, ArrowUpRight } from 'lucide-react';
import ManagerBadge from './ManagerBadge';
import StatusBadge from '../users/StatusBadge';

const DepartmentCard = ({ dept, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/dashboard/departments/${dept.id}`}
        className="
          group relative flex h-full flex-col
          rounded-[20px] border border-border/45 bg-white/90 backdrop-blur-sm
          p-4 sm:p-5
          shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_4px_16px_rgba(15,23,42,0.04)]
          transition-all duration-200
          hover:-translate-y-0.5 hover:border-primary/20
          hover:shadow-[0_12px_32px_rgba(37,99,235,0.1)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
        "
      >
        <div className="flex items-start gap-3.5">
          <span
            className={`
              flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]
              bg-gradient-to-br ${dept.iconTone}
              ring-1 ring-black/5 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset]
            `}
          >
            <Briefcase size={17} strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15px] font-semibold text-heading tracking-[-0.02em] truncate group-hover:text-primary transition-colors">
                {dept.name}
              </h3>
              <ArrowUpRight
                size={15}
                className="shrink-0 text-slate-300 opacity-0 transition-all group-hover:opacity-100 group-hover:text-primary"
              />
            </div>
            <p className="mt-0.5 text-[12px] text-secondaryText truncate">{dept.organizationName}</p>
          </div>
        </div>

        <div className="mt-4">
          <ManagerBadge
            managerId={dept.managerId}
            name={dept.managerName}
            initials={dept.managerInitials}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge status={dept.status === 'active' ? 'active' : 'suspended'} />
          <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-secondaryText">
            <Users2 size={12} className="text-slate-400" />
            {dept.memberIds.length} members
          </span>
          <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-secondaryText">
            <FolderKanban size={12} className="text-slate-400" />
            {dept.projectCount} projects
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default DepartmentCard;
