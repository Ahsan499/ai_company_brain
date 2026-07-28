import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import AuditActionBadge, { AuditActionIcon } from './AuditActionBadge';
import AuditDiffView from './AuditDiffView';

const AUDIT_ACTION_META = {
  create: { verb: 'created' },
  update: { verb: 'updated' },
  delete: { verb: 'deleted' },
  login: { verb: 'logged in' },
  permission_change: { verb: 'changed permissions on' },
  invite: { verb: 'invited' },
  remove: { verb: 'removed' },
};

const formatExactTime = (iso) => {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const formatRelativeTime = (iso) => {
  try {
    const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
    return `${Math.round(mins / 1440)}d ago`;
  } catch {
    return iso;
  }
};

const AuditLogRow = ({ log, expanded, onToggle }) => {
  if (!log) return null;
  const meta = AUDIT_ACTION_META[log.action] || AUDIT_ACTION_META.update;
  const hasDetails = Boolean(log.diff?.length || log.metadata);

  return (
    <motion.article
      layout
      className="
        rounded-[16px] border border-border/45 bg-white/90
        shadow-[0_1px_2px_rgba(15,23,42,0.03)]
        hover:border-primary/15 hover:shadow-[0_6px_20px_rgba(37,99,235,0.06)]
        transition-[border-color,box-shadow] duration-200
      "
    >
      <button
        type="button"
        onClick={() => onToggle?.(log.id)}
        className="flex w-full items-start gap-3 p-3.5 sm:p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 rounded-[16px]"
        aria-expanded={expanded}
      >
        <AuditActionIcon action={log.action} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/dashboard/users/${log.actorId}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 hover:opacity-90"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[9px] font-semibold ring-2 ring-white shadow-sm">
                {log.actorInitials}
              </span>
              <span className="text-[13px] font-semibold text-heading hover:text-primary truncate max-w-[140px] sm:max-w-none">
                {log.actorName}
              </span>
            </Link>
            <AuditActionBadge action={log.action} size="sm" />
          </div>

          <p className="mt-1.5 text-[13px] text-secondaryText leading-snug">
            <span className="text-heading/80">{meta.verb}</span>{' '}
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {log.module}
            </span>{' '}
            {log.targetEntity?.link ? (
              <Link
                to={log.targetEntity?.link}
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-heading hover:text-primary"
              >
                {log.targetEntity?.name}
              </Link>
            ) : (
              <span className="font-semibold text-heading">{log.targetEntity?.name || '—'}</span>
            )}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400">
            <span title={formatExactTime(log.timestamp)} className="tabular-nums font-medium text-secondaryText/80">
              {formatRelativeTime(log.timestamp)}
            </span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="hidden sm:inline truncate max-w-[220px]">
              {log.ip} · {log.device}
            </span>
          </div>
        </div>

        <ChevronDown
          size={16}
          className={`mt-1 shrink-0 text-slate-400 transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/40 px-3.5 sm:px-4 pb-4 pt-3 space-y-3">
              <div className="sm:hidden text-[11px] text-slate-400">
                {log.ip} · {log.device}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                <Meta label="Exact time" value={formatExactTime(log.timestamp)} />
                <Meta label="Log ID" value={log.id} />
                <Meta label="Actor" value={log.actorName} />
                <Meta label="Module" value={log.module} />
              </div>

              {log.action === 'update' || log.diff?.length ? (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Changes
                  </p>
                  <AuditDiffView diffs={log.diff} />
                </div>
              ) : null}

              {log.metadata && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Metadata
                  </p>
                  <dl className="rounded-[14px] border border-border/50 bg-slate-50/80 px-3 py-2.5 space-y-1.5">
                    {Object.entries(log.metadata).map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-3 text-[12.5px]">
                        <dt className="text-secondaryText capitalize">{k.replace(/_/g, ' ')}</dt>
                        <dd className="font-medium text-heading tabular-nums text-right">
                          {String(v)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {!hasDetails && log.action !== 'update' && (
                <p className="text-[12.5px] text-secondaryText">
                  No additional change details for this event.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

const Meta = ({ label, value }) => (
  <div className="rounded-[12px] border border-border/40 bg-slate-50/60 px-3 py-2">
    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">{label}</p>
    <p className="mt-0.5 text-[12.5px] font-medium text-heading break-all">{value}</p>
  </div>
);

export default AuditLogRow;
