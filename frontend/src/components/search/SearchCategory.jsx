import React from 'react';
import { CATEGORY_META } from './searchData';

const SearchCategory = ({ category, count, children }) => {
  const meta = CATEGORY_META[category] || CATEGORY_META.Projects;
  const Icon = meta.icon;

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 px-1.5">
        <span
          className={`
            inline-flex h-6 w-6 items-center justify-center rounded-[8px]
            shadow-[0_1px_0_rgba(255,255,255,0.7)_inset]
            ${meta.tone} ring-1
          `}
        >
          <Icon size={12} strokeWidth={2.1} />
        </span>
        <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.09em] text-slate-400/95">
          {category}
        </h3>
        <span className="h-px flex-1 bg-gradient-to-r from-border/70 to-transparent ml-1" aria-hidden />
        {typeof count === 'number' && (
          <span className="text-[10.5px] font-semibold tabular-nums text-slate-400/90">
            {count}
          </span>
        )}
      </div>
      <div className="space-y-1">{children}</div>
    </section>
  );
};

export default SearchCategory;
