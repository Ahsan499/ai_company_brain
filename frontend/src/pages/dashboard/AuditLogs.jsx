import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, ScrollText } from 'lucide-react';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/dashboard/EmptyState';
import AuditFilterBar from '../../components/audit-logs/AuditFilterBar';
import AuditLogGroup from '../../components/audit-logs/AuditLogGroup';
import {
  AUDIT_LOGS,
  filterAuditLogs,
  groupLogsByDate,
} from '../../components/audit-logs/auditLogData';

const PAGE_SIZE = 20;

const AuditLogs = () => {
  const [query, setQuery] = useState('');
  const [action, setAction] = useState('all');
  const [module, setModule] = useState('all');
  const [actorId, setActorId] = useState('all');
  const [dateAfter, setDateAfter] = useState('');
  const [dateBefore, setDateBefore] = useState('');
  const [mobileFilters, setMobileFilters] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [exportToast, setExportToast] = useState(false);

  const filtered = useMemo(
    () =>
      filterAuditLogs(AUDIT_LOGS, {
        query,
        action,
        module,
        actorId,
        dateAfter,
        dateBefore,
      }),
    [query, action, module, actorId, dateAfter, dateBefore]
  );

  const visibleLogs = useMemo(() => filtered.slice(0, visible), [filtered, visible]);
  const groups = useMemo(() => groupLogsByDate(visibleLogs), [visibleLogs]);
  const hasMore = visible < filtered.length;

  const clearFilters = () => {
    setQuery('');
    setAction('all');
    setModule('all');
    setActorId('all');
    setDateAfter('');
    setDateBefore('');
  };

  const handleExport = () => {
    setExportToast(true);
    window.setTimeout(() => setExportToast(false), 2200);
  };

  const toggleRow = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary shadow-sm ring-1 ring-primary/10">
              <ScrollText size={17} strokeWidth={2} />
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-heading tracking-tight leading-tight">
            Audit Logs
          </h1>
          <p className="mt-1.5 max-w-xl text-[13px] sm:text-[14px] text-secondaryText leading-relaxed">
            Chronological security trail — who changed what across the workspace.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="h-10 rounded-xl bg-white gap-2 shrink-0 w-fit"
          onClick={handleExport}
        >
          <Download size={15} />
          Export
        </Button>
      </motion.div>

      <AuditFilterBar
        query={query}
        onQuery={(v) => {
          setQuery(v);
          setVisible(PAGE_SIZE);
        }}
        action={action}
        onAction={(v) => {
          setAction(v);
          setVisible(PAGE_SIZE);
        }}
        module={module}
        onModule={(v) => {
          setModule(v);
          setVisible(PAGE_SIZE);
        }}
        actorId={actorId}
        onActor={(v) => {
          setActorId(v);
          setVisible(PAGE_SIZE);
        }}
        dateAfter={dateAfter}
        onDateAfter={(v) => {
          setDateAfter(v);
          setVisible(PAGE_SIZE);
        }}
        dateBefore={dateBefore}
        onDateBefore={(v) => {
          setDateBefore(v);
          setVisible(PAGE_SIZE);
        }}
        mobileOpen={mobileFilters}
        onMobileOpen={() => setMobileFilters(true)}
        onMobileClose={() => setMobileFilters(false)}
        onClear={clearFilters}
      />

      <div className="flex items-center justify-between gap-2 text-[12.5px] text-secondaryText">
        <p>
          Showing{' '}
          <span className="font-semibold text-heading tabular-nums">{visibleLogs.length}</span>
          {' '}of{' '}
          <span className="font-semibold text-heading tabular-nums">{filtered.length}</span>
          {' '}events
        </p>
        {(query || action !== 'all' || module !== 'all' || actorId !== 'all' || dateAfter || dateBefore) && (
          <button
            type="button"
            onClick={() => {
              clearFilters();
              setVisible(PAGE_SIZE);
            }}
            className="text-[12px] font-semibold text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-6">
          <EmptyState
            icon={ScrollText}
            title="No matching logs"
            description="Try widening the date range or clearing filters."
            action={
              <Button
                type="button"
                variant="secondary"
                className="rounded-xl"
                onClick={clearFilters}
              >
                Reset filters
              </Button>
            }
          />
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((g, i) => (
            <AuditLogGroup
              key={g.dateKey}
              label={g.label}
              items={g.items}
              expandedId={expandedId}
              onToggle={toggleRow}
              index={i}
            />
          ))}

          {hasMore && (
            <div className="flex justify-center pt-1">
              <Button
                type="button"
                variant="secondary"
                className="h-10 rounded-xl bg-white"
                onClick={() => setVisible((n) => n + PAGE_SIZE)}
              >
                Load more
              </Button>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {exportToast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="
              fixed bottom-6 left-1/2 z-[90] -translate-x-1/2
              rounded-2xl border border-border/50 bg-heading px-4 py-2.5
              text-[13px] font-medium text-white shadow-xl
            "
          >
            Export queued (demo) — CSV coming with backend.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuditLogs;
