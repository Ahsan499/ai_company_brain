import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import PasswordStrength from '../../components/auth/PasswordStrength';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Static UI flow → success screen
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/password-updated');
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
            Reset Password
          </h1>
          <p className="text-sm text-secondaryText leading-relaxed max-w-sm mx-auto">
            Create a strong password for your account.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.4 }}
            className="space-y-3"
          >
            <div className="relative">
              <Input
                label="New Password"
                type={showNew ? 'text' : 'password'}
                placeholder="Enter new password"
                icon={Lock}
                autoComplete="new-password"
                className="h-14 rounded-[12px] pr-11"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-primary p-0.5"
                onClick={() => setShowNew((v) => !v)}
                aria-label={showNew ? 'Hide password' : 'Show password'}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Static strength UI — no validation */}
            <PasswordStrength label="Strong" segmentsFilled={4} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.4 }}
            className="relative"
          >
            <Input
              label="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm new password"
              icon={Lock}
              autoComplete="new-password"
              className="h-14 rounded-[12px] pr-11"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-primary p-0.5"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.4 }}
            className="pt-1"
          >
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-[52px] rounded-[12px] gap-2 text-[15px] bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] border-0"
            >
              {!isLoading && <Lock size={17} />}
              Update Password
            </Button>
          </motion.div>
        </form>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-surface px-3 text-secondaryText">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/auth')}
            className="w-full inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:text-blue-700 transition-colors focus:outline-none focus:underline"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default ResetPassword;
