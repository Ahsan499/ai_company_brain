import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import OtpInput from '../../components/auth/OtpInput';

const DEMO_EMAIL = 'john.doe@example.com';
/** Static display only — no timer logic */
const STATIC_TIMER = '01:58';

const OtpVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  // Static UI: resend stays disabled (timer "active")
  const resendDisabled = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Static UI flow → Reset Password
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/reset-password');
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full"
    >
      <Card className="!rounded-[20px] !p-8 sm:!p-10 max-w-[460px] mx-auto shadow-[0_12px_40px_rgba(15,23,42,0.08)] border-border/40">
        <motion.div
          className="text-center mb-7"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5">
            <Shield className="h-6 w-6 text-primary" strokeWidth={2} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-heading mb-2">
            Verify Your Identity
          </h1>
          <p className="text-sm text-secondaryText leading-relaxed">
            We&apos;ve sent a 6-digit verification code to your registered email.
          </p>
          <p className="mt-2 text-sm font-semibold text-primary break-all">
            {DEMO_EMAIL}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4 }}
          >
            <OtpInput value={otp} onChange={setOtp} aria-label="Enter 6-digit verification code" />
            <p className="mt-3 text-center text-xs sm:text-sm text-secondaryText">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                className="font-semibold text-primary hover:text-blue-700 focus:outline-none focus:underline"
              >
                Check your spam folder
              </button>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.4 }}
            className="flex items-center justify-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-2.5 text-sm text-heading"
            role="status"
            aria-live="polite"
          >
            <Clock size={16} className="text-primary shrink-0" />
            <span>
              Code expires in{' '}
              <span className="font-semibold tabular-nums text-primary">{STATIC_TIMER}</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="space-y-4"
          >
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-[52px] rounded-[12px] text-[15px]"
            >
              Verify Code
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-surface px-3 text-secondaryText">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={resendDisabled}
              className="w-full h-[52px] rounded-[12px] gap-2 text-[15px] border-primary/40"
              aria-disabled={resendDisabled}
            >
              <RefreshCw size={17} />
              Resend Code
            </Button>
          </motion.div>
        </form>

        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <button
            type="button"
            onClick={() => navigate('/auth/forgot-password')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-secondaryText hover:text-heading transition-colors focus:outline-none focus:underline"
          >
            <ArrowLeft size={16} />
            Back to Forgot Password
          </button>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default OtpVerification;
