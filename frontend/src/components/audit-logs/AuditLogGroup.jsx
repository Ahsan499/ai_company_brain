import { motion } from 'framer-motion';
import AuditLogRow from './AuditLogRow';

const AuditLogGroup = ({ label, items = [], expandedId, onToggle, index = 0 }) => {
  if (!items.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-2.5"
    >
      <div className="sticky top-0 z-10 -mx-1 flex items-center gap-3 bg-gradient-to-b from-[#F8FAFC] via-[#F8FAFC]/95 to-transparent px-1 py-2 backdrop-blur-[2px]">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-400">
          {label}
        </h2>
        <span className="h-px flex-1 bg-border/50" />
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold tabular-nums text-secondaryText">
          {items.length}
        </span>
      </div>

      <div className="space-y-2">
        {items.map((log) => (
          <AuditLogRow
            key={log.id}
            log={log}
            expanded={expandedId === log.id}
            onToggle={onToggle}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default AuditLogGroup;
