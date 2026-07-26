import React from 'react';
import { motion } from 'framer-motion';
import DashboardPanel, { PanelHeader } from './DashboardPanel';
import EmptyState from './EmptyState';
import { FolderKanban } from 'lucide-react';

const DEFAULT_PROJECTS = [
  { name: 'AI Company Brain', progress: 82, color: 'from-[#2563EB] to-[#60A5FA]' },
  { name: 'CRM', progress: 65, color: 'from-[#8B5CF6] to-[#A78BFA]' },
  { name: 'HR Portal', progress: 48, color: 'from-[#10B981] to-[#34D399]' },
  { name: 'Mobile App', progress: 35, color: 'from-[#F59E0B] to-[#FBBF24]' },
];

const ProgressCard = ({
  title = 'Project Progress',
  projects = DEFAULT_PROJECTS,
  delay = 0,
}) => {
  const isEmpty = !projects?.length;

  return (
    <DashboardPanel delay={delay} className="h-full" hoverLift={false}>
      <PanelHeader title={title} subtitle="Active initiatives" />

      {isEmpty ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create a project to start tracking progress here."
        />
      ) : (
        <ul className="space-y-5">
          {projects.map((project, i) => (
            <li key={project.name} className="group">
              <div className="flex items-center justify-between mb-2 gap-3">
                <span className="text-[13px] sm:text-sm font-medium text-heading truncate">
                  {project.name}
                </span>
                <span className="text-[13px] font-semibold text-heading tabular-nums shrink-0">
                  {project.progress}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100/90 overflow-hidden ring-1 ring-inset ring-slate-200/60">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${project.color} shadow-[0_0_12px_rgba(37,99,235,0.15)]`}
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ delay: delay + 0.2 + i * 0.08, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  );
};

export default ProgressCard;
