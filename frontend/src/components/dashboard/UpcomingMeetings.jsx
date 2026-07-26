import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, CalendarDays } from 'lucide-react';
import DashboardPanel, { PanelHeader } from './DashboardPanel';
import EmptyState from './EmptyState';
import { getDashboardTodayMeetings } from '../meetings/meetingData';

const UpcomingMeetings = ({ meetings, delay = 0 }) => {
  const resolved = useMemo(
    () => meetings ?? getDashboardTodayMeetings(),
    [meetings]
  );
  const isEmpty = !resolved?.length;

  return (
    <DashboardPanel delay={delay} className="h-full" hoverLift={false}>
      <PanelHeader
        title="Upcoming Meetings"
        subtitle="Today's schedule"
        action={
          !isEmpty && (
            <Link
              to="/dashboard/meetings"
              className="text-[13px] font-semibold text-primary hover:text-blue-700 transition-colors focus:outline-none focus-visible:underline"
            >
              Calendar
            </Link>
          )
        }
      />

      {isEmpty ? (
        <EmptyState
          icon={CalendarDays}
          title="No meetings today"
          description="Your calendar is clear. Schedule a meeting when you’re ready."
        />
      ) : (
        <ul className="space-y-2.5">
          {resolved.map((meeting, i) => (
            <motion.li
              key={meeting.id || meeting.title}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.08 + i * 0.04 }}
              className="
                rounded-2xl border border-border/50 bg-slate-50/70
                px-3.5 py-3.5
                hover:bg-white hover:border-primary/15 hover:shadow-[0_4px_16px_rgba(15,23,42,0.05)]
                transition-all duration-200
              "
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
                    {meeting.time}
                  </p>
                  <p className="text-[13px] sm:text-sm font-semibold text-heading mt-1 truncate">
                    {meeting.title}
                  </p>
                  <div className="flex items-center mt-2.5 -space-x-2">
                    {meeting.participants.map((p) => (
                      <div
                        key={p}
                        className="h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[9px] font-bold flex items-center justify-center shadow-sm"
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
                {meeting.id ? (
                  <Link
                    to={`/dashboard/meetings/${meeting.id}`}
                    className="
                      inline-flex items-center gap-1.5 shrink-0 rounded-xl
                      bg-gradient-to-r from-primary to-[#1D4ED8] text-white
                      text-[12px] font-semibold px-3.5 py-2
                      shadow-[0_4px_14px_rgba(37,99,235,0.3)]
                      hover:shadow-[0_6px_18px_rgba(37,99,235,0.4)]
                      transition-shadow
                    "
                  >
                    <Video size={13} strokeWidth={2.25} />
                    Join
                  </Link>
                ) : (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="
                      inline-flex items-center gap-1.5 shrink-0 rounded-xl
                      bg-gradient-to-r from-primary to-[#1D4ED8] text-white
                      text-[12px] font-semibold px-3.5 py-2
                      shadow-[0_4px_14px_rgba(37,99,235,0.3)]
                    "
                  >
                    <Video size={13} strokeWidth={2.25} />
                    Join
                  </motion.button>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  );
};

export default UpcomingMeetings;
