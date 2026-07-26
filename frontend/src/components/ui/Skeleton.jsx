import { motion } from 'framer-motion';

/**
 * Reusable pulsing placeholder block — match Card / panel radii.
 */
const Skeleton = ({ className = '', rounded = 'rounded-[14px]' }) => (
  <motion.div
    aria-hidden
    className={`
      relative overflow-hidden bg-slate-100/90
      ${rounded}
      ${className}
    `}
    initial={{ opacity: 0.55 }}
    animate={{ opacity: [0.45, 0.85, 0.45] }}
    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
  >
    <div
      className="
        pointer-events-none absolute inset-0
        bg-gradient-to-r from-transparent via-white/55 to-transparent
        -translate-x-full animate-[shimmer_1.6s_infinite]
      "
      style={{
        animation: 'skeleton-shimmer 1.6s ease-in-out infinite',
      }}
    />
    <style>{`
      @keyframes skeleton-shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}</style>
  </motion.div>
);

export default Skeleton;
