import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Command, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchInput from './SearchInput';
import QuickActionCard from './QuickActionCard';
import SearchCategory from './SearchCategory';
import SearchResultCard from './SearchResultCard';
import RecentSearches from './RecentSearches';
import EmptySearch from './EmptySearch';
import KeyboardHelper from './KeyboardHelper';
import {
  QUICK_ACTIONS,
  RECENT_SEARCHES,
  RECENTLY_OPENED,
  COMMANDS,
  filterSearchResults,
  groupResultsByCategory,
} from './searchData';

const getSelectableIds = ({ query, results, showBrowse }) => {
  if (query.trim() && results.length === 0) return [];

  if (query.trim()) {
    return results.map((r) => r.id);
  }

  if (!showBrowse) return [];

  const browseProjects = results
    .filter((r) => r.category === 'Projects')
    .slice(0, 3)
    .map((r) => r.id);

  return [
    ...QUICK_ACTIONS.map((a) => a.id),
    ...RECENT_SEARCHES.map((r) => r.id),
    ...COMMANDS.map((c) => c.id),
    ...browseProjects,
    ...RECENTLY_OPENED.map((r) => `opened-${r.id}`),
  ];
};

/**
 * Premium global search / command palette.
 */
const CommandPalette = ({ open, onClose }) => {
  const navigate = useNavigate();
  const titleId = useId();
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const listRef = useRef(null);

  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(QUICK_ACTIONS[0]?.id ?? null);

  const results = useMemo(() => filterSearchResults(query), [query]);
  const grouped = useMemo(() => groupResultsByCategory(results), [results]);
  const isSearching = query.trim().length > 0;
  const isEmpty = isSearching && results.length === 0;

  const selectableIds = useMemo(
    () => getSelectableIds({ query, results, showBrowse: !isSearching }),
    [query, results, isSearching]
  );

  // Reset when opened
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveId(QUICK_ACTIONS[0]?.id ?? null);
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(t);
  }, [open]);

  // Keep activeId valid when list changes
  useEffect(() => {
    if (!selectableIds.length) {
      setActiveId(null);
      return;
    }
    if (!selectableIds.includes(activeId)) {
      setActiveId(selectableIds[0]);
    }
  }, [selectableIds, activeId]);

  // Body scroll lock + ESC (panel-level also handles keys)
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const activate = useCallback(
    (id) => {
      if (!id) return;

      const recent = RECENT_SEARCHES.find((r) => r.id === id);
      if (recent) {
        setQuery(recent.title);
        return;
      }

      const opened = RECENTLY_OPENED.find((r) => `opened-${r.id}` === id);
      if (opened) {
        setQuery(opened.title);
        return;
      }

      const cmd = COMMANDS.find((c) => c.id === id);
      if (cmd?.id === 'cmd-d' || id === 'qa-dashboard') {
        navigate('/dashboard');
        close();
        return;
      }

      // Static actions — close palette for premium click-through feel
      close();
    },
    [close, navigate]
  );

  const moveActive = useCallback(
    (delta) => {
      if (!selectableIds.length) return;
      const idx = Math.max(0, selectableIds.indexOf(activeId));
      const next = (idx + delta + selectableIds.length) % selectableIds.length;
      setActiveId(selectableIds[next]);

      // Soft scroll into view
      requestAnimationFrame(() => {
        const el = listRef.current?.querySelector(`[data-search-id="${selectableIds[next]}"]`);
        el?.scrollIntoView({ block: 'nearest' });
      });
    },
    [selectableIds, activeId]
  );

  const onInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      activate(activeId);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      moveActive(e.shiftKey ? -1 : 1);
    }
  };

  // Focus trap within panel
  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start sm:items-center justify-center p-0 sm:p-5 md:p-8">
          <motion.button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 bg-heading/25 backdrop-blur-[5px] sm:backdrop-blur-[10px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={close}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 440, damping: 34, mass: 0.82 }}
            className="
              relative z-10 flex w-full flex-col
              h-dvh sm:h-auto sm:max-h-[650px]
              sm:w-full sm:max-w-[720px]
              rounded-none sm:rounded-[24px]
              border-0 sm:border sm:border-white/80
              bg-white/90 backdrop-blur-2xl
              shadow-[0_28px_90px_rgba(15,23,42,0.24),0_0_0_1px_rgba(15,23,42,0.04)]
              overflow-hidden
            "
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/50 to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -top-24 left-1/2 h-40 w-[70%] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl"
              aria-hidden
            />

            <div className="relative shrink-0 border-b border-border/35 px-3.5 pt-3.5 pb-3 sm:px-5 sm:pt-5 sm:pb-4">
              <h2 id={titleId} className="sr-only">
                Global search
              </h2>
              <SearchInput
                ref={inputRef}
                value={query}
                onChange={setQuery}
                onKeyDown={onInputKeyDown}
              />
            </div>

            <div
              ref={listRef}
              role="listbox"
              aria-label="Search results"
              className="relative flex-1 overflow-y-auto palette-scrollbar px-3 py-3.5 sm:px-5 sm:py-4 space-y-5 sm:space-y-6"
            >
              {isEmpty ? (
                <EmptySearch query={query} onClear={() => setQuery('')} />
              ) : isSearching ? (
                grouped.map(({ category, items }) => (
                  <SearchCategory key={category} category={category} count={items.length}>
                    {items.map((item) => (
                      <div key={item.id} data-search-id={item.id}>
                        <SearchResultCard
                          {...item}
                          active={activeId === item.id}
                          onMouseEnter={() => setActiveId(item.id)}
                          onClick={() => activate(item.id)}
                        />
                      </div>
                    ))}
                  </SearchCategory>
                ))
              ) : (
                <>
                  <section>
                    <div className="mb-3 flex items-center gap-2 px-1">
                      <span className="flex h-6 w-6 items-center justify-center rounded-[8px] bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary ring-1 ring-primary/10 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset]">
                        <Command size={12} strokeWidth={2.2} />
                      </span>
                      <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.09em] text-slate-400/95">
                        Quick Actions
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
                      {QUICK_ACTIONS.map((action) => (
                        <div key={action.id} data-search-id={action.id}>
                          <QuickActionCard
                            {...action}
                            active={activeId === action.id}
                            onMouseEnter={() => setActiveId(action.id)}
                            onClick={() => activate(action.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </section>

                  <RecentSearches
                    items={RECENT_SEARCHES}
                    activeId={activeId}
                    onHover={setActiveId}
                    onSelect={(item) => activate(item.id)}
                  />

                  {/* Commands */}
                  <section className="space-y-2">
                    <h3 className="px-1.5 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-slate-400/95">
                      Commands
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {COMMANDS.map((cmd) => {
                        const active = activeId === cmd.id;
                        return (
                          <button
                            key={cmd.id}
                            type="button"
                            data-search-id={cmd.id}
                            onMouseEnter={() => setActiveId(cmd.id)}
                            onClick={() => activate(cmd.id)}
                            className={`
                              group flex items-center justify-between gap-3 rounded-[14px] px-3 py-2.5 text-left
                              border transition-all duration-150
                              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20
                              ${
                                active
                                  ? 'bg-white border-primary/18 shadow-[0_6px_18px_rgba(37,99,235,0.09)]'
                                  : 'border-transparent hover:bg-white/95 hover:border-border/40'
                              }
                            `}
                          >
                            <span className="text-[13px] font-medium text-heading tracking-[-0.015em]">
                              {cmd.title}
                            </span>
                            <kbd
                              className={`
                                inline-flex items-center gap-0.5 rounded-[7px] border px-1.5 py-0.5
                                text-[10.5px] font-semibold tabular-nums tracking-tight
                                shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_1px_2px_rgba(15,23,42,0.04)]
                                transition-colors duration-150
                                ${
                                  active
                                    ? 'border-primary/20 bg-primary/5 text-primary'
                                    : 'border-border/65 bg-white text-secondaryText group-hover:border-border'
                                }
                              `}
                            >
                              {cmd.shortcut}
                            </kbd>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* Browse sample results */}
                  <SearchCategory category="Projects" count={3}>
                    {results
                      .filter((r) => r.category === 'Projects')
                      .slice(0, 3)
                      .map((item) => (
                        <div key={item.id} data-search-id={item.id}>
                          <SearchResultCard
                            {...item}
                            active={activeId === item.id}
                            onMouseEnter={() => setActiveId(item.id)}
                            onClick={() => activate(item.id)}
                          />
                        </div>
                      ))}
                  </SearchCategory>

                  {/* Recent Activity */}
                  <section className="space-y-2">
                    <div className="flex items-center gap-2 px-1.5">
                      <History size={12} className="text-slate-400" strokeWidth={2} />
                      <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.09em] text-slate-400/95">
                        Recently Opened
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-0.5">
                      {RECENTLY_OPENED.map((item) => {
                        const id = `opened-${item.id}`;
                        const active = activeId === id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            data-search-id={id}
                            onMouseEnter={() => setActiveId(id)}
                            onClick={() => activate(id)}
                            className={`
                              inline-flex items-center gap-2 rounded-full px-3 py-1.5
                              text-[12px] font-medium tracking-[-0.01em]
                              border transition-all duration-150
                              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20
                              ${
                                active
                                  ? 'bg-white border-primary/25 text-heading shadow-[0_4px_12px_rgba(37,99,235,0.1)]'
                                  : 'bg-slate-50/90 border-border/45 text-secondaryText hover:bg-white hover:text-heading hover:border-border/70'
                              }
                            `}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                active ? 'bg-primary' : 'bg-slate-300'
                              }`}
                            />
                            {item.title}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </>
              )}
            </div>

            <div className="relative shrink-0 border-t border-border/35 bg-white/75 backdrop-blur-xl px-3 py-2.5 sm:px-5 sm:py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <KeyboardHelper />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
