import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Send, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Static UI flow → OTP screen
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/verify-otp');
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full"
    >
      <Card className="!rounded-[20px] p-6 sm:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.08)] border-border/40">
        {/* Card header */}
        <motion.div
          className="text-center mb-7 sm:mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5">
            <Lock className="h-6 w-6 text-primary" strokeWidth={2} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-heading mb-2">
            Forgot Password?
          </h1>
          <p className="text-sm text-secondaryText leading-relaxed max-w-sm mx-auto">
            Enter your registered email address.
            <br className="hidden sm:block" />
            {' '}We&apos;ll send you a password reset link.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4 }}
          >
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              icon={Mail}
              className="h-[52px] rounded-[12px]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.4 }}
          >
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-[52px] rounded-[12px] gap-2 text-[15px]"
            >
              {!isLoading && <Send size={18} />}
              Send Reset Link
            </Button>
          </motion.div>
        </form>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.34, duration: 0.4 }}
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-surface px-3 text-secondaryText">or</span>
            </div>
          </div>

          <Button
            variant="secondary"
            type="button"
            className="w-full h-[52px] rounded-[12px] gap-2 mt-5 text-[15px]"
            onClick={() => navigate('/auth')}
          >
            <ArrowLeft size={18} />
            Back to Login
          </Button>
        </motion.div>

        <motion.p
          className="mt-6 flex items-start sm:items-center justify-center gap-2 text-xs sm:text-sm text-secondaryText text-center leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42, duration: 0.4 }}
        >
          <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5 sm:mt-0" />
          <span>
            If you don&apos;t receive the email, check your spam folder or{' '}
            <button
              type="button"
              className="font-semibold text-primary hover:text-blue-700 focus:outline-none focus:underline"
            >
              try again
            </button>
            .
          </span>
        </motion.p>
      </Card>
    </motion.div>
  );
};

export default ForgotPassword;
