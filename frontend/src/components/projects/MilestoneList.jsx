import { CheckCircle2, Circle } from 'lucide-react';
import { formatProjectDate } from './projectData';

const MilestoneList = ({ milestones = [] }) => {
  if (!milestones.length) {
    return <p className="text-[13px] text-secondaryText px-1 py-3">No milestones yet.</p>;
  }

  return (
    <ul className="space-y-1">
      {milestones.map((m) => (
        <li
          key={m.id}
          className="flex items-start gap-3 rounded-[14px] px-3 py-2.5 hover:bg-slate-50/90 transition-colors"
        >
          {m.done ? (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" strokeWidth={2} />
          ) : (
            <Circle size={16} className="mt-0.5 shrink-0 text-slate-300" strokeWidth={2} />
          )}
          <div className="min-w-0 flex-1">
            <p
              className={`text-[13px] font-medium tracking-tight ${
                m.done ? 'text-secondaryText line-through' : 'text-heading'
              }`}
            >
              {m.title}
            </p>
            <p className="mt-0.5 text-[11.5px] text-slate-400">
              Due {formatProjectDate(m.dueDate)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MilestoneList;
