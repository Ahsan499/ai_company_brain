import { UserRound } from 'lucide-react';

const AboutCard = ({ bio }) => (
  <div className="rounded-[20px] border border-border/45 bg-white/90 p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
    <h3 className="text-[14px] font-semibold text-heading tracking-tight inline-flex items-center gap-2">
      <UserRound size={15} className="text-primary" />
      About
    </h3>
    <p className="mt-3 text-[13.5px] text-secondaryText leading-relaxed">
      {bio}
    </p>
  </div>
);

export default AboutCard;
