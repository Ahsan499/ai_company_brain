import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable 6-digit OTP input (UI only — auto-advance, keyboard nav).
 */
const OtpInput = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  'aria-label': ariaLabel = 'One-time password',
}) => {
  const [internal, setInternal] = useState(() => Array(length).fill(''));
  const digits = value ?? internal;
  const inputsRef = useRef([]);

  const setDigits = (next) => {
    if (onChange) onChange(next);
    else setInternal(next);
  };

  const focusAt = (index) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  };

  const updateAt = (index, char) => {
    const next = [...digits];
    next[index] = char;
    setDigits(next);
  };

  const handleChange = (index, e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      updateAt(index, '');
      return;
    }

    // Paste / multi-digit into current + following boxes
    const chars = raw.slice(0, length - index).split('');
    const next = [...digits];
    chars.forEach((c, i) => {
      next[index + i] = c;
    });
    setDigits(next);
    const nextFocus = Math.min(index + chars.length, length - 1);
    focusAt(nextFocus);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[index]) {
        updateAt(index, '');
      } else if (index > 0) {
        updateAt(index - 1, '');
        focusAt(index - 1);
      }
      return;
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      focusAt(index - 1);
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      focusAt(index + 1);
    }
  };

  const handlePaste = (index, e) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '');
    if (!pasted) return;
    const chars = pasted.slice(0, length - index).split('');
    const next = [...digits];
    chars.forEach((c, i) => {
      next[index + i] = c;
    });
    setDigits(next);
    focusAt(Math.min(index + chars.length, length - 1));
  };

  return (
    <div
      className="flex items-center justify-center gap-2 sm:gap-3"
      role="group"
      aria-label={ariaLabel}
    >
      {Array.from({ length }).map((_, index) => (
        <motion.input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digits[index]}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}`}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePaste(index, e)}
          whileFocus={{ scale: 1.04 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          className="
            w-11 h-11 sm:w-14 sm:h-14
            rounded-[12px] border border-border bg-white
            text-center text-xl sm:text-2xl font-semibold text-heading
            transition-all duration-200
            placeholder:text-gray-300
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
            hover:border-gray-400
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />
      ))}
    </div>
  );
};

export default OtpInput;
