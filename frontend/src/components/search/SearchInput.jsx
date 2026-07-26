import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Large command-palette search field with shortcut badge.
 */
const SearchInput = forwardRef(function SearchInput(
  { value, onChange, onKeyDown, shortcutLabel = 'Ctrl K', className = '' },
  ref
) {
  const isMac =
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || '');

  const badgeParts =
    shortcutLabel === 'Ctrl K'
      ? isMac
        ? ['⌘', 'K']
        : ['Ctrl', 'K']
      : shortcutLabel.split(' ');

  return (
    <div className={`relative group/search ${className}`}>
      <Search
        size={18}
        strokeWidth={1.85}
        className="
          pointer-events-none absolute left-[18px] sm:left-5 top-1/2 -translate-y-1/2
          text-slate-400 transition-colors duration-200
          group-focus-within/search:text-primary
        "
        aria-hidden
      />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search projects, tasks, users, meetings..."
        autoComplete="off"
        spellCheck={false}
        aria-label="Global search"
        className="
          w-full h-[56px] sm:h-[60px] rounded-[18px]
          border border-border/50 bg-gradient-to-b from-white to-slate-50/40
          pl-[46px] sm:pl-14 pr-16 sm:pr-[5.75rem]
          text-[15px] sm:text-[16px] font-medium text-heading tracking-[-0.02em]
          placeholder:text-slate-400/90 placeholder:font-normal
          shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_1px_2px_rgba(15,23,42,0.04)]
          focus:outline-none focus:border-primary/40 focus:bg-white
          focus:ring-[3px] focus:ring-primary/12
          transition-all duration-200
          [&::-webkit-search-cancel-button]:hidden
          [&::-webkit-search-decoration]:hidden
        "
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={() => onChange?.('')}
            aria-label="Clear search"
            className="
              inline-flex h-7 w-7 items-center justify-center rounded-lg
              text-slate-400 hover:text-heading hover:bg-slate-100
              transition-colors duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
            "
          >
            <X size={14} strokeWidth={2.1} />
          </button>
        ) : null}

        <kbd
          className="
            pointer-events-none hidden sm:inline-flex items-center gap-1
            rounded-[8px] border border-border/65 bg-white/95
            px-1.5 py-1
            text-[10.5px] font-semibold text-secondaryText tracking-tight
            shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_1px_2px_rgba(15,23,42,0.05)]
          "
        >
          {badgeParts.map((part, i) => (
            <span key={`${part}-${i}`} className="inline-flex items-center gap-1">
              {i > 0 && <span className="text-slate-300 font-normal">+</span>}
              <span className="min-w-[1.1rem] text-center tabular-nums">{part}</span>
            </span>
          ))}
        </kbd>
      </div>
    </div>
  );
});

export default SearchInput;
