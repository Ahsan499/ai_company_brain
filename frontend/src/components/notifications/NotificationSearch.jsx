import React from 'react';
import { Search, Command } from 'lucide-react';

const NotificationSearch = ({ value, onChange, className = '' }) => {
  return (
    <div className={`relative group ${className}`}>
      <Search
        size={15}
        strokeWidth={2}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors duration-200 group-focus-within:text-primary"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Search notifications..."
        aria-label="Search notifications"
        className="
          w-full h-12 rounded-2xl
          border border-border/50 bg-slate-50/80
          pl-10 pr-12 text-[13px] text-heading
          placeholder:text-slate-400
          shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)]
          hover:bg-white hover:border-border
          focus:outline-none focus:border-primary/35 focus:bg-white
          focus:ring-[3px] focus:ring-primary/[0.12]
          transition-all duration-200
        "
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 rounded-md border border-border/60 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-sm">
        <Command size={10} />K
      </span>
    </div>
  );
};

export default NotificationSearch;
