import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Columns3,
  Filter,
  List,
  Plus,
  Search,
  UserRound,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/dashboard/EmptyState';
import TaskRow from '../../components/tasks/TaskRow';
import TaskBoardColumn from '../../components/tasks/TaskBoardColumn';
import TaskDetailDrawer from '../../components/tasks/TaskDetailDrawer';
import CreateTaskModal from '../../components/tasks/CreateTaskModal';
import {
  TASKS,
  TASK_STATUSES,
  TASK_STATUS_META,
  filterTasks,
  groupTasksByStatus,
  getTaskById,
} from '../../components/tasks/taskData';
import {
  PROJECTS,
  PROJECT_PRIORITIES,
  PRIORITY_META,
} from '../../components/projects/projectData';
import { USERS } from '../../components/users/userData';

const PAGE_SIZE = 10;
const selectClass =
  'h-10 rounded-xl border border-border/60 bg-white px-3 text-[12.5px] font-medium text-heading focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12';

const Tasks = () => {
  const navigate = useNavigate();
  const { id: routeTaskId } = useParams();

  const [items, setItems] = useState(TASKS);
  const [query, setQuery] = useState('');
  const [projectId, setProjectId] = useState('all');
  const [assigneeId, setAssigneeId] = useState('all');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [dueAfter, setDueAfter] = useState('');
  const [dueBefore, setDueBefore] = useState('');
  const [myTasksOnly, setMyTasksOnly] = useState(false);
  const [view, setView] = useState('list');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(
    () =>
      filterTasks(items, {
        query,
        projectId,
        assigneeId,
        status,
        priority,
        myTasksOnly,
        dueAfter,
        dueBefore,
      }),
    [items, query, projectId, assigneeId, status, priority, myTasksOnly, dueAfter, dueBefore]
  );

  const pageItems = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = pageItems.length < filtered.length;
  const boardColumns = useMemo(() => groupTasksByStatus(filtered), [filtered]);

  const openTask = useCallback(
    (taskId) => {
      navigate(`/dashboard/tasks/${taskId}`);
    },
    [navigate]
  );

  const closeTask = useCallback(() => {
    navigate('/dashboard/tasks');
  }, [navigate]);

  const activeTask = useMemo(() => {
    if (!routeTaskId) return null;
    return items.find((t) => t.id === routeTaskId) || getTaskById(routeTaskId);
  }, [routeTaskId, items]);

  useEffect(() => {
    if (routeTaskId && !activeTask) {
      navigate('/dashboard/tasks', { replace: true });
    }
  }, [routeTaskId, activeTask, navigate]);

  const toggleComplete = (taskId) => {
    setItems((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'done' ? 'todo' : 'done' }
          : t
      )
    );
  };

  const onStatusChange = (taskId, next) => {
    setItems((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: next } : t)));
  };

  const onPriorityChange = (taskId, next) => {
    setItems((prev) => prev.map((t) => (t.id === taskId ? { ...t, priority: next } : t)));
  };

  const onToggleSubtask = (taskId, subId) => {
    setItems((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subId ? { ...s, done: !s.done } : s
              ),
            }
          : t
      )
    );
  };

  const resetFilters = () => {
    setQuery('');
    setProjectId('all');
    setAssigneeId('all');
    setStatus('all');
    setPriority('all');
    setDueAfter('');
    setDueBefore('');
    setMyTasksOnly(false);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary shadow-sm ring-1 ring-primary/10">
              <CheckSquare size={17} strokeWidth={2} />
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-primary/12">
              {items.length} tasks
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-heading tracking-tight leading-tight">
            Tasks
          </h1>
          <p className="mt-1.5 max-w-lg text-[13px] sm:text-[14px] text-secondaryText leading-relaxed">
            Organize work across projects — assign, prioritize, and track delivery.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => setCreateOpen(true)}
          className="h-11 rounded-xl gap-2 text-[13px] font-semibold shadow-[0_6px_16px_rgba(37,99,235,0.28)]"
        >
          <Plus size={16} strokeWidth={2.25} />
          New Task
        </Button>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
        className="
          flex flex-col gap-3
          rounded-[20px] border border-border/45 bg-white/85 backdrop-blur-md
          p-3 sm:p-3.5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]
        "
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search tasks..."
              className="
                w-full h-10 rounded-xl border border-border/60 bg-white/90
                pl-10 pr-3 text-[13px] text-heading placeholder:text-slate-400
                focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12
              "
              aria-label="Search tasks"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMyTasksOnly((v) => !v);
                setPage(1);
              }}
              aria-pressed={myTasksOnly}
              className={`
                inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-[12.5px] font-semibold border transition-all
                ${
                  myTasksOnly
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'bg-white border-border/60 text-secondaryText hover:text-heading'
                }
              `}
            >
              <UserRound size={14} />
              My Tasks
            </button>

            <div className="inline-flex rounded-xl border border-border/60 bg-slate-50/80 p-0.5" role="group">
              <button
                type="button"
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
                className={`inline-flex h-9 items-center gap-1.5 rounded-[10px] px-2.5 text-[12px] font-semibold ${
                  view === 'list'
                    ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                    : 'text-slate-400 hover:text-heading'
                }`}
              >
                <List size={14} />
                List
              </button>
              <button
                type="button"
                onClick={() => setView('board')}
                aria-pressed={view === 'board'}
                className={`inline-flex h-9 items-center gap-1.5 rounded-[10px] px-2.5 text-[12px] font-semibold ${
                  view === 'board'
                    ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                    : 'text-slate-400 hover:text-heading'
                }`}
              >
                <Columns3 size={14} />
                Board
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400 px-1">
            <Filter size={12} />
            Filters
          </span>
          <select
            value={projectId}
            onChange={(e) => {
              setProjectId(e.target.value);
              setPage(1);
            }}
            className={`${selectClass} max-w-[200px]`}
          >
            <option value="all">All projects</option>
            {PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            value={assigneeId}
            onChange={(e) => {
              setAssigneeId(e.target.value);
              setPage(1);
            }}
            className={`${selectClass} max-w-[160px]`}
          >
            <option value="all">All assignees</option>
            {USERS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="all">All status</option>
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {TASK_STATUS_META[s].label}
              </option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="all">All priority</option>
            {PROJECT_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_META[p].label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dueAfter}
            onChange={(e) => {
              setDueAfter(e.target.value);
              setPage(1);
            }}
            className={selectClass}
            aria-label="Due after"
            title="Due after"
          />
          <input
            type="date"
            value={dueBefore}
            onChange={(e) => {
              setDueBefore(e.target.value);
              setPage(1);
            }}
            className={selectClass}
            aria-label="Due before"
            title="Due before"
          />
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="rounded-[20px] border border-border/45 bg-white/85 py-6 shadow-sm">
          <EmptyState
            icon={CheckSquare}
            title="No tasks found"
            description="Try another filter or clear filters to see all tasks."
            action={
              <Button type="button" variant="secondary" onClick={resetFilters} className="rounded-xl">
                Clear filters
              </Button>
            }
          />
        </div>
      ) : view === 'board' ? (
        <div className="overflow-x-auto dashboard-scrollbar -mx-1 px-1 pb-2">
          <div className="flex gap-3 sm:gap-4 min-w-min">
            {boardColumns.map((col, i) => (
              <TaskBoardColumn
                key={col.status}
                status={col.status}
                meta={col.meta}
                tasks={col.items}
                index={i}
                onOpen={openTask}
                onToggleComplete={toggleComplete}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-[20px] border border-border/45 bg-white/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
            <div className="overflow-x-auto dashboard-scrollbar">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-border/50 bg-slate-50/80">
                    <th className="px-3 py-3 w-12" />
                    {[
                      'Task',
                      'Project',
                      'Assignee',
                      'Priority',
                      'Status',
                      'Due',
                      'Subtasks',
                    ].map((h) => (
                      <th
                        key={h}
                        className={`
                          px-3 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400
                          ${h === 'Project' ? 'hidden md:table-cell' : ''}
                          ${h === 'Assignee' ? 'hidden sm:table-cell' : ''}
                          ${h === 'Status' ? 'hidden lg:table-cell' : ''}
                          ${h === 'Subtasks' ? 'hidden xl:table-cell' : ''}
                        `}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onOpen={openTask}
                      onToggleComplete={toggleComplete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12.5px] text-secondaryText">
              Showing{' '}
              <span className="font-semibold text-heading tabular-nums">{pageItems.length}</span>
              {' '}of{' '}
              <span className="font-semibold text-heading tabular-nums">{filtered.length}</span>
              {' '}tasks
            </p>
            {hasMore && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl h-10 text-[13px] font-semibold bg-white/90"
              >
                Load more
              </Button>
            )}
          </div>
        </>
      )}

      <TaskDetailDrawer
        open={Boolean(routeTaskId && activeTask)}
        task={activeTask}
        onClose={closeTask}
        onStatusChange={onStatusChange}
        onPriorityChange={onPriorityChange}
        onToggleSubtask={onToggleSubtask}
      />

      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
};

export default Tasks;
