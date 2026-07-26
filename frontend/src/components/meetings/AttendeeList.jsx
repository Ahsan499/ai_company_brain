import { Link } from 'react-router-dom';
import { RSVP_META } from './meetingData';

const AttendeeList = ({ attendees = [] }) => {
  if (!attendees.length) {
    return <p className="text-[12.5px] text-secondaryText py-2">No attendees.</p>;
  }

  return (
    <ul className="space-y-2">
      {attendees.map((a) => {
        const rsvp = RSVP_META[a.rsvpStatus] || RSVP_META.pending;
        return (
          <li key={a.userId} className="flex items-center gap-3">
            <Link
              to={`/dashboard/users/${a.userId}`}
              className="flex min-w-0 flex-1 items-center gap-2.5 hover:opacity-90"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[10px] font-semibold ring-2 ring-white shadow-sm">
                {a.initials}
              </span>
              <span className="text-[13px] font-medium text-heading truncate">{a.name}</span>
            </Link>
            <span
              className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${rsvp.tone}`}
            >
              {rsvp.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default AttendeeList;
