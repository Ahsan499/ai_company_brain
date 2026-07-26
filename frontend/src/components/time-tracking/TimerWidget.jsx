import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, Timer } from 'lucide-react';
import Button from '../ui/Button';
import { TASKS } from '../tasks/taskData';
import { CURRENT_USER_ID } from './timeEntryData';

const formatElapsed = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
};

const TimerWidget = ({ tasks = TASKS, defaultUserId = CURRENT_USER_ID }) => {
  const myTasks = tasks.filter((t) => t.assigneeId === defaultUserId);
  const options = myTasks.length ? myTasks : tasks.slice(0, 12);
  const [taskId, setTaskId] = useState(options[0]?.id || '');
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const selected = options.find((t) => t.id === taskId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        relative overflow-hidden rounded-[20px] border border-border/45
        bg-white/90 backdrop-blur-md p-4 sm:p-5
        shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_8px_28px_rgba(15,23,42,0.05)]
      "
    >
      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-primary/[0.06] blur-3xl" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary ring-1 ring-primary/10">
            <Timer size={18} strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-slate-400">
              Live timer
            </p>
            <p
              className={`mt-1 text-[28px] sm:text-[32px] font-bold tracking-tight tabular-nums leading-none ${
                running ? 'text-primary' : 'text-heading'
              }`}
            >
              {formatElapsed(elapsed)}
            </p>
            <p className="mt-1.5 text-[12.5px] text-secondaryText truncate">
              {selected ? `${selected.title} · ${selected.projectName}` : 'Select a task to track'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
          <select
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            disabled={running}
            className="
              h-11 min-w-[220px] rounded-xl border border-border/60 bg-white px-3
              text-[13px] font-medium text-heading
              focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12
              disabled:opacity-60
            "
            aria-label="Task to track"
          >
            {options.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          <Button
            type="button"
            variant={running ? 'secondary' : 'primary'}
            onClick={() => {
              if (running) setRunning(false);
              else setRunning(true);
            }}
            className={`
              h-11 rounded-xl gap-2 text-[13px] font-semibold min-w-[128px]
              ${running ? 'bg-white border-primary/20 text-primary' : 'shadow-[0_6px_16px_rgba(37,99,235,0.28)]'}
            `}
          >
            {running ? (
              <>
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  <Pause size={15} />
                </motion.span>
                Stop
              </>
            ) : (
              <>
                <Play size={15} />
                Start
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TimerWidget;
