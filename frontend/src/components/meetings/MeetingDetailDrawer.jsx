import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  ExternalLink,
  FolderKanban,
  MapPin,
  Repeat,
  UserRound,
  UsersRound,
  Video,
  X,
} from 'lucide-react';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import MeetingStatusBadge from './MeetingStatusBadge';
import AttendeeList from './AttendeeList';
import AgendaChecklist from './AgendaChecklist';
import {
  formatDuration,
  formatMeetingDate,
  formatMeetingTime,
} from './meetingData';
import {
  useMeeting,
  useMeetingAttendees,
  useMeetingAgendaItems,
  useUpdateRsvp,
  useUpdateAgendaItem,
  useCreateAgendaItem,
  useDeleteAgendaItem,
} from '../../hooks/useMeetings';
import { useAuth } from '../../context/AuthContext';

const DrawerSkeleton = () => (
  <div className="p-5 space-y-4">
    <Skeleton className="h-6 w-48" />
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-20 w-full rounded-xl" />
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-32 w-full rounded-xl" />
  </div>
);

const MeetingDetailDrawer = ({ open, meetingId, onClose }) => {
  const { user: currentUser } = useAuth();
  const { data: meeting, isLoading } = useMeeting(meetingId, { enabled: open && Boolean(meetingId) });
  const { data: attendees } = useMeetingAttendees(open && meetingId ? meetingId : null);
  const { data: agendaItems } = useMeetingAgendaItems(open && meetingId ? meetingId : null);
  const updateRsvp = useUpdateRsvp();
  const updateAgendaItem = useUpdateAgendaItem();
  const createAgendaItem = useCreateAgendaItem();
  const deleteAgendaItem = useDeleteAgendaItem();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const time = meeting
    ? formatMeetingTime(meeting.startTime, meeting.durationMinutes)
    : null;

  const onToggleAgenda = (itemId) => {
    if (!meeting) return;
    const item = (agendaItems ?? meeting.agenda ?? []).find((a) => a.id === itemId);
    if (!item) return;
    updateAgendaItem.mutate({
      meetingId: meeting.id,
      agendaItemId: itemId,
      done: !item.done,
    });
  };

  const onAddAgendaItem = (title) => {
    if (!meeting) return;
    createAgendaItem.mutate({ meetingId: meeting.id, title });
  };

  const onDeleteAgendaItem = (itemId) => {
    if (!meeting) return;
    deleteAgendaItem.mutate({ meetingId: meeting.id, agendaItemId: itemId });
  };

  const onRsvpChange = (attendeeUserId, rsvpStatus) => {
    if (!meeting) return;
    updateRsvp.mutate({ meetingId: meeting.id, userId: attendeeUserId, rsvpStatus });
  };

  const resolvedAttendees = attendees ?? meeting?.attendees ?? [];

  return (
    <AnimatePresence>
      {open && meetingId && (
        <>
          <motion.button
            type="button"
            aria-label="Close meeting"
            className="fixed inset-0 z-[70] bg-heading/25 backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={meeting?.title ?? 'Meeting'}
            initial={{ x: '100%', y: 0 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            className="
              fixed z-[80] flex flex-col
              inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[24px]
              sm:inset-y-0 sm:right-0 sm:left-auto sm:bottom-auto sm:max-h-none
              sm:w-full sm:max-w-[560px] sm:rounded-none
              bg-white/95 backdrop-blur-2xl
              border border-white/60 border-border/40
              sm:border-l sm:border-y-0 sm:border-r-0
              shadow-[0_-12px_48px_rgba(15,23,42,0.16)]
              sm:shadow-[-20px_0_60px_rgba(15,23,42,0.12)]
            "
          >
            <div className="mx-auto mt-2 mb-1 h-1 w-9 rounded-full bg-slate-200 sm:hidden" />

            {isLoading || !meeting ? (
              <DrawerSkeleton />
            ) : (
              <>
                <div className="flex items-start justify-between gap-3 border-b border-border/40 px-4 sm:px-5 py-3.5 shrink-0">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <MeetingStatusBadge status={meeting.status} />
                      <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-secondaryText">
                        {meeting.type === 'video' ? (
                          <Video size={12} className="text-primary" />
                        ) : (
                          <MapPin size={12} className="text-amber-600" />
                        )}
                        {meeting.type === 'video' ? 'Video call' : 'In person'}
                      </span>
                    </div>
                    <h2 className="text-[18px] sm:text-[20px] font-bold text-heading tracking-tight leading-snug border-b border-dashed border-transparent hover:border-border/60 cursor-text">
                      {meeting.title}
                    </h2>
                    <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-secondaryText">
                      <span className="inline-flex items-center gap-1 font-medium text-heading/80">
                        <CalendarDays size={12} className="text-slate-400" />
                        {formatMeetingDate(meeting.date)}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        {time.range} ({formatDuration(meeting.durationMinutes)})
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-xl text-secondaryText hover:bg-slate-100 hover:text-heading"
                    aria-label="Close"
                  >
                    <X size={17} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto dashboard-scrollbar">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_180px] gap-0">
                    <div className="p-4 sm:p-5 space-y-5 border-b lg:border-b-0 lg:border-r border-border/40">
                      <section>
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-2">
                          Agenda overview
                        </h3>
                        <div className="rounded-[14px] border border-border/45 bg-slate-50/50 px-3.5 py-3 text-[13px] text-secondaryText leading-relaxed min-h-[64px]">
                          {meeting.description || 'No description.'}
                        </div>
                      </section>

                      <section className="flex flex-wrap gap-2">
                        {meeting.projectId && (
                          <Link
                            to={`/dashboard/projects/${meeting.projectId}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-slate-50/90 px-2.5 py-1 text-[12px] font-semibold text-heading hover:border-primary/25 hover:text-primary"
                          >
                            <FolderKanban size={12} className="text-slate-400" />
                            {meeting.projectName}
                          </Link>
                        )}
                        {meeting.teamId && (
                          <Link
                            to={`/dashboard/teams/${meeting.teamId}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-slate-50/90 px-2.5 py-1 text-[12px] font-semibold text-heading hover:border-primary/25 hover:text-primary"
                          >
                            <UsersRound size={12} className="text-slate-400" />
                            {meeting.teamName}
                          </Link>
                        )}
                      </section>

                      <section>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400 mb-1.5">
                          Organizer
                        </p>
                        <Link
                          to={`/dashboard/users/${meeting.organizerId}`}
                          className="inline-flex items-center gap-2.5 hover:opacity-90"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[11px] font-semibold ring-2 ring-white shadow-sm">
                            {meeting.organizerInitials}
                          </span>
                          <span className="text-[13px] font-semibold text-heading">
                            {meeting.organizerName}
                          </span>
                        </Link>
                      </section>

                      <section>
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-2">
                          Attendees
                        </h3>
                        <AttendeeList
                          attendees={resolvedAttendees}
                          currentUserId={currentUser?.id}
                          onRsvpChange={onRsvpChange}
                        />
                      </section>

                      <section>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400 mb-1.5">
                          Location
                        </p>
                        <p className="text-[13px] font-medium text-heading">{meeting.location}</p>
                        {meeting.type === 'video' && meeting.joinUrl && (
                          <Button
                            type="button"
                            variant="primary"
                            className="mt-3 h-10 rounded-xl gap-2 text-[13px] font-semibold shadow-[0_6px_16px_rgba(37,99,235,0.25)]"
                            onClick={() => window.open(meeting.joinUrl, '_blank', 'noopener')}
                          >
                            <Video size={15} />
                            Join Meeting
                            <ExternalLink size={13} className="opacity-80" />
                          </Button>
                        )}
                      </section>

                      <section>
                        <AgendaChecklist
                          items={agendaItems ?? meeting.agenda ?? []}
                          onToggle={onToggleAgenda}
                          onAdd={onAddAgendaItem}
                          onDelete={onDeleteAgendaItem}
                        />
                      </section>

                      {meeting.status === 'completed' && meeting.notes && (
                        <section>
                          <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-2">
                            Meeting notes
                          </h3>
                          <div className="rounded-[14px] border border-border/45 bg-emerald-50/40 px-3.5 py-3 text-[13px] text-secondaryText leading-relaxed">
                            {meeting.notes}
                          </div>
                        </section>
                      )}
                    </div>

                    <aside className="p-4 sm:p-5 space-y-4 bg-slate-50/40">
                      <div>
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                          Created by
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-heading">
                          <UserRound size={12} className="text-slate-400" />
                          {meeting.createdByName}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                          Created
                        </p>
                        <p className="mt-1 text-[12.5px] font-medium text-heading">
                          {formatMeetingDate(meeting.createdAt)}
                        </p>
                      </div>
                      {meeting.recurring && (
                        <div>
                          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                            Recurring
                          </p>
                          <p className="mt-1 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-heading">
                            <Repeat size={12} className="text-slate-400" />
                            {meeting.recurring}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                          Duration
                        </p>
                        <p className="mt-1 text-[12.5px] font-medium text-heading">
                          {formatDuration(meeting.durationMinutes)}
                        </p>
                      </div>
                    </aside>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MeetingDetailDrawer;
