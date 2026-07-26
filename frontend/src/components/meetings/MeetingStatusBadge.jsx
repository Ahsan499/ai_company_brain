import { MEETING_STATUS_META } from './meetingData';

const MeetingStatusBadge = ({ status }) => {
  const meta = MEETING_STATUS_META[status] || MEETING_STATUS_META.upcoming;
  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ring-1 ${meta.tone}`}
    >
      {meta.label}
    </span>
  );
};

export default MeetingStatusBadge;
