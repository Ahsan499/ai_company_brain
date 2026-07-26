import { Clock, Mail, MapPin, Phone } from 'lucide-react';

const Row = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-slate-200/70">
      <Icon size={14} strokeWidth={1.9} />
    </span>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400">{label}</p>
      <div className="mt-0.5 text-[13px] font-medium text-heading break-all">{children}</div>
    </div>
  </div>
);

const ContactInfoCard = ({ user, timezone }) => {
  if (!user) return null;

  return (
    <div className="rounded-[20px] border border-border/45 bg-white/90 p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <h3 className="text-[14px] font-semibold text-heading tracking-tight mb-4">Contact</h3>
      <div className="space-y-3.5">
        <Row icon={Mail} label="Email">
          <a href={`mailto:${user.email}`} className="hover:text-primary">
            {user.email}
          </a>
        </Row>
        {user.phone && (
          <Row icon={Phone} label="Phone">
            {user.phone}
          </Row>
        )}
        {user.location && (
          <Row icon={MapPin} label="Location">
            {user.location}
          </Row>
        )}
        <Row icon={Clock} label="Timezone">
          {timezone}
        </Row>
      </div>
    </div>
  );
};

export default ContactInfoCard;
