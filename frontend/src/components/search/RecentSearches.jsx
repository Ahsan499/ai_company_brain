import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { CATEGORY_META } from './searchData';

const RecentSearches = ({
  items = [],
  activeId,
  onSelect,
  onHover,
}) => {
  if (!items.length) return null;

  return (
    <section className="space-y-2">
      <h3 className="px-1.5 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-slate-400/95">
        Recent Searches
      </h3>
      <ul className="space-y-0.5">
        {items.map((item, i) => {
          const active = activeId === item.id;
          const meta = CATEGORY_META[item.category] || CATEGORY_META.Projects;
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.03 + i * 0.025, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                data-search-id={item.id}
                onClick={() => onSelect?.(item)}
                onMouseEnter={() => onHover?.(item.id)}
                className={`
                  group flex w-full items-center gap-3 rounded-[14px] px-2.5 py-[9px] text-left
                  border transition-all duration-150
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20
                  ${
                    active
                      ? 'bg-white border-primary/18 shadow-[0_6px_18px_rgba(37,99,235,0.09)]'
                      : 'border-transparent hover:bg-white/95 hover:border-border/40'
                  }
                `}
              >
                <span
                  className={`
                    flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]
                    ring-1 transition-all duration-200
                    ${
                      active
                        ? 'bg-primary/10 text-primary ring-primary/15'
                        : 'bg-slate-100/90 text-slate-500 ring-slate-200/70 group-hover:bg-slate-100 group-hover:text-slate-600'
                    }
                  `}
                >
                  <Clock size={13} strokeWidth={1.95} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-heading tracking-[-0.015em]">
                  {item.title}
                </span>
                <span
                  className={`
                    shrink-0 rounded-md px-1.5 py-0.5
                    text-[10px] font-semibold tracking-tight ring-1
                    ${meta.tone}
                  `}
                >
                  {item.category}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
};

export default RecentSearches;
