import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, FolderKanban, Layers, Users2 } from 'lucide-react';
import TeamLeadBadge from './TeamLeadBadge';
import { getProjectById } from '../projects/projectData';

const TeamCard = ({ team, index = 0 }) => {
  if (!team) return null;

  const activeProjects = team.projectIds.filter((id) => {
    const p = getProjectById(id);
    return p && p.status === 'active';
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
    >
      <Link
        to={`/dashboard/teams/${team.id}`}
        className="
          group relative flex h-full flex-col
          rounded-[20px] border border-border/45 bg-white/90 backdrop-blur-sm
          p-4 sm:p-5
          shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_4px_16px_rgba(15,23,42,0.04)]
          transition-all duration-200
          hover:border-primary/20
          hover:shadow-[0_12px_32px_rgba(37,99,235,0.1)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
        "
      >
        <div className="flex items-start gap-3.5">
          <span
            className={`
              flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]
              bg-gradient-to-br ${team.iconTone}
              ring-1 ring-black/5 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset]
            `}
          >
            <Layers size={17} strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15px] font-semibold text-heading tracking-[-0.02em] truncate group-hover:text-primary transition-colors">
                {team.name}
              </h3>
              <ArrowUpRight
                size={15}
                className="shrink-0 text-slate-300 opacity-0 transition-all group-hover:opacity-100 group-hover:text-primary"
              />
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <span
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1"
                style={{
                  color: team.color,
                  backgroundColor: `${team.color}12`,
                  borderColor: `${team.color}30`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
                Squad
              </span>
              <span className="rounded-md bg-primary/5 px-1.5 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/10 truncate max-w-[110px]">
                {team.departmentName}
              </span>
              <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-secondaryText ring-1 ring-slate-200/70 truncate max-w-[120px]">
                {team.organizationName}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <TeamLeadBadge
            leadId={team.leadId}
            name={team.leadName}
            initials={team.leadInitials}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-border/40 pt-3">
          <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-secondaryText">
            <Users2 size={12} className="text-slate-400" />
            {team.memberIds.length} members
          </span>
          <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-secondaryText">
            <FolderKanban size={12} className="text-slate-400" />
            {activeProjects} active
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default TeamCard;
