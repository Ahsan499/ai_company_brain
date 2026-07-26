import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, FolderKanban, MapPin, UsersRound, Video } from 'lucide-react';
import MemberAvatarStack from '../projects/MemberAvatarStack';
import MeetingStatusBadge from './MeetingStatusBadge';
import {
  formatDuration,
  formatMeetingDate,
  formatMeetingTime,
} from './meetingData';

const MeetingCard = ({ meeting, index = 0, onOpen }) => {
  if (!meeting) return null;
  const time = formatMeetingTime(meeting.startTime, meeting.durationMinutes);
  const stackMembers = meeting.attendees.map((a) => ({
    userId: a.userId,
    name: a.name,
    initials: a.initials,
  }));

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035, duration: 0.32 }}
      whileHover={{ y: -2 }}
      onClick={() => onOpen?.(meeting.id)}
      className="
        group flex h-full w-full flex-col text-left
        rounded-[20px] border border-border/45 bg-white/90 backdrop-blur-sm
        p-4 sm:p-5
        shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_4px_16px_rgba(15,23,42,0.04)]
        transition-all duration-200
        hover:border-primary/20
        hover:shadow-[0_12px_32px_rgba(37,99,235,0.1)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
      "
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`
            flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]
            ${
              meeting.type === 'video'
                ? 'bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary'
                : 'bg-gradient-to-br from-[#FFF7ED] to-[#FED7AA] text-amber-700'
            }
          `}
        >
          {meeting.type === 'video' ? <Video size={16} /> : <MapPin size={16} />}
        </span>
        <MeetingStatusBadge status={meeting.status} />
      </div>

      <h3
        className={`mt-3 text-[14.5px] font-semibold tracking-tight leading-snug line-clamp-2 group-hover:text-primary transition-colors ${
          meeting.status === 'cancelled' ? 'line-through text-secondaryText' : 'text-heading'
        }`}
      >
        {meeting.title}
      </h3>

      <p className="mt-2 text-[12px] text-secondaryText">
        {formatMeetingDate(meeting.date)}
      </p>
      <p className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-medium text-heading/80">
        <Clock size={11} className="text-slate-400" />
        {time.range} · {formatDuration(meeting.durationMinutes)}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {meeting.projectId && (
          <Link
            to={`/dashboard/projects/${meeting.projectId}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-md bg-primary/5 px-1.5 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/10"
          >
            <FolderKanban size={10} />
            {meeting.projectName}
          </Link>
        )}
        {meeting.teamId && (
          <Link
            to={`/dashboard/teams/${meeting.teamId}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-secondaryText ring-1 ring-slate-200/70"
          >
            <UsersRound size={10} />
            {meeting.teamName}
          </Link>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[9px] font-semibold">
            {meeting.organizerInitials}
          </span>
          <span className="text-[11.5px] font-medium text-secondaryText truncate max-w-[90px]">
            {meeting.organizerName}
          </span>
        </span>
        <MemberAvatarStack members={stackMembers} max={3} size="sm" />
      </div>
    </motion.button>
  );
};

export default MeetingCard;
