import React from 'react';

const Key = ({ children }) => (
  <kbd
    className="
      inline-flex min-w-[22px] h-[22px] items-center justify-center
      rounded-[6px] border border-border/65 bg-white
      px-1.5 text-[10.5px] font-semibold text-slate-600 tracking-tight
      shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_1px_2px_rgba(15,23,42,0.05)]
    "
  >
    {children}
  </kbd>
);

const Hint = ({ keys, label }) => (
  <span className="inline-flex items-center gap-1.5 text-[11.5px] text-secondaryText">
    <span className="inline-flex items-center gap-0.5">
      {keys.map((k) => (
        <Key key={k}>{k}</Key>
      ))}
    </span>
    <span className="font-medium text-slate-500/95">{label}</span>
  </span>
);

const KeyboardHelper = ({ className = '' }) => {
  return (
    <div
      className={`
        flex flex-wrap items-center justify-center sm:justify-between gap-x-5 gap-y-2
        rounded-[14px] border border-border/40
        bg-gradient-to-b from-slate-50/95 to-white/80 backdrop-blur-md
        px-3.5 py-2.5
        shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]
        ${className}
      `}
      aria-hidden
    >
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <Hint keys={['↑', '↓']} label="Navigate" />
        <Hint keys={['↵']} label="Open" />
        <Hint keys={['Esc']} label="Close" />
        <span className="hidden md:inline-flex">
          <Hint keys={['Tab']} label="Jump" />
        </span>
      </div>
      <p className="hidden sm:block text-[11px] text-slate-400/90 font-medium tracking-tight">
        AI Company Brain
      </p>
    </div>
  );
};

export default KeyboardHelper;
