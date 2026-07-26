import React from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Lock, Lightbulb, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import SuccessCard from '../../components/auth/SuccessCard';

const SUCCESS_ITEMS = [
  {
    icon: Shield,
    title: 'Account Secured',
    description: 'Your account is now protected with your new password.',
  },
  {
    icon: Lock,
    title: "You're All Set",
    description: 'You can now sign in using your new password.',
  },
  {
    icon: Lightbulb,
    title: 'Keep It Safe',
    description: 'Never share your password with anyone.',
  },
];

const PasswordUpdated = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="w-full"
    >
      <Card className="!rounded-[20px] !p-8 sm:!p-10 max-w-[460px] mx-auto shadow-[0_12px_40px_rgba(15,23,42,0.08)] border-border/40">
        <motion.div
          className="text-center mb-7"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <motion.div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success shadow-[0_8px_24px_rgba(16,185,129,0.35)]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 16 }}
            aria-hidden="true"
          >
            <Check size={32} className="text-white" strokeWidth={3} />
          </motion.div>

          <h1 className="text-xl sm:text-2xl font-bold text-heading mb-2 leading-snug">
            Password Updated{' '}
            <span className="text-success">Successfully!</span>
          </h1>
          <p className="text-sm text-secondaryText leading-relaxed max-w-sm mx-auto">
            Your password has been successfully updated.
            <br />
            Your account is now secure and ready to use.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="mb-6"
        >
          <SuccessCard items={SUCCESS_ITEMS} />
        </motion.div>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.4 }}
        >
          <Button
            type="button"
            className="w-full h-14 rounded-[12px] gap-2 text-[15px] bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] border-0"
            onClick={() => navigate('/auth')}
          >
            <Lock size={18} />
            Go to Login
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full h-14 rounded-[12px] gap-2 text-[15px]"
            onClick={() => navigate('/dashboard')}
          >
            <Home size={18} />
            Go to Home
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default PasswordUpdated;
