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

const MeetingRow = ({
  meeting,
  compact = false,
  onOpen,
}) => {
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
      layout
      onClick={() => onOpen?.(meeting.id)}
      className={`
        group w-full text-left
        flex flex-col sm:flex-row sm:items-center gap-3
        rounded-[16px] border border-border/45 bg-white/90
        px-3.5 py-3.5 sm:px-4
        shadow-[0_2px_10px_rgba(15,23,42,0.03)]
        transition-all duration-200
        hover:border-primary/20 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
        ${compact ? 'sm:py-3' : ''}
      `}
      whileHover={{ y: -1 }}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <span
          className={`
            mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
            ${
              meeting.type === 'video'
                ? 'bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary'
                : 'bg-gradient-to-br from-[#FFF7ED] to-[#FED7AA] text-amber-700'
            }
            ring-1 ring-black/5
          `}
        >
          {meeting.type === 'video' ? (
            <Video size={16} strokeWidth={2} />
          ) : (
            <MapPin size={16} strokeWidth={2} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={`text-[13.5px] font-semibold tracking-tight truncate group-hover:text-primary transition-colors ${
                meeting.status === 'cancelled' ? 'text-secondaryText line-through' : 'text-heading'
              }`}
            >
              {meeting.title}
            </p>
            <MeetingStatusBadge status={meeting.status} />
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-secondaryText">
            <span className="font-medium text-heading/80">{formatMeetingDate(meeting.date)}</span>
            <span className="text-slate-300">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={11} className="text-slate-400" />
              {time.range}
            </span>
            <span className="text-slate-300">·</span>
            <span>{formatDuration(meeting.durationMinutes)}</span>
          </p>
          {!compact && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {meeting.projectId && (
                <Link
                  to={`/dashboard/projects/${meeting.projectId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 rounded-md bg-primary/5 px-1.5 py-0.5 text-[10.5px] font-semibold text-primary ring-1 ring-primary/10 hover:bg-primary/10"
                >
                  <FolderKanban size={10} />
                  {meeting.projectName}
                </Link>
              )}
              {meeting.teamId && (
                <Link
                  to={`/dashboard/teams/${meeting.teamId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-secondaryText ring-1 ring-slate-200/70 hover:text-heading"
                >
                  <UsersRound size={10} />
                  {meeting.teamName}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:pl-2 shrink-0">
        <Link
          to={`/dashboard/users/${meeting.organizerId}`}
          onClick={(e) => e.stopPropagation()}
          className="hidden sm:inline-flex items-center gap-2 hover:opacity-90"
          title={meeting.organizerName}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[10px] font-semibold ring-2 ring-white shadow-sm">
            {meeting.organizerInitials}
          </span>
        </Link>
        <MemberAvatarStack members={stackMembers} max={4} size="sm" />
      </div>
    </motion.button>
  );
};

export default MeetingRow;
