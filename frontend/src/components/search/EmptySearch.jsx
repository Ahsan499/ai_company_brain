import React from 'react';
import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import Button from '../ui/Button';

const EmptySearch = ({ query, onClear }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center px-6 py-14 sm:py-16 text-center"
    >
      <div className="relative mb-6">
        <div
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.18)_0%,transparent_70%)] blur-xl scale-[1.6]"
          aria-hidden
        />
        <motion.div
          initial={{ rotate: -4, scale: 0.94 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="
            relative flex h-[88px] w-[88px] items-center justify-center rounded-[24px]
            bg-gradient-to-br from-[#EFF6FF] via-white to-[#DBEAFE]
            ring-1 ring-primary/10
            shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_12px_32px_rgba(37,99,235,0.14)]
          "
        >
          <SearchX size={34} strokeWidth={1.55} className="text-primary/75" />
        </motion.div>
      </div>

      <h3 className="text-[17px] sm:text-[18px] font-semibold text-heading tracking-[-0.025em]">
        No Results Found
      </h3>
      <p className="mt-2 max-w-[300px] text-[13px] text-secondaryText/90 leading-relaxed">
        {query
          ? `Nothing matched “${query}”. Try another keyword.`
          : 'Try another keyword.'}
      </p>

      <div className="mt-6">
        <Button
          type="button"
          variant="primary"
          onClick={onClear}
          className="rounded-xl px-5 shadow-[0_6px_16px_rgba(37,99,235,0.25)]"
        >
          Clear Search
        </Button>
      </div>
    </motion.div>
  );
};

export default EmptySearch;
