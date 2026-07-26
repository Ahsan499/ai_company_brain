import { Award } from 'lucide-react';

const SkillTags = ({ skills = [] }) => {
  if (!skills.length) return null;

  return (
    <div className="rounded-[20px] border border-border/45 bg-white/90 p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <h3 className="text-[14px] font-semibold text-heading tracking-tight inline-flex items-center gap-2 mb-3">
        <Award size={15} className="text-primary" />
        Skills
      </h3>
      <ul className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li
            key={skill}
            className="
              rounded-full bg-primary/8 px-3 py-1.5
              text-[12px] font-semibold text-primary
              ring-1 ring-primary/12
            "
          >
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillTags;
