import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Globe, ChevronDown } from 'lucide-react';
import Logo from '../components/ui/Logo';
import LoginHeroIllustration from '../components/auth/LoginHeroIllustration';
import SecurityHeroIllustration from '../components/auth/SecurityHeroIllustration';
import OtpHeroIllustration from '../components/auth/OtpHeroIllustration';
import ResetPasswordHeroIllustration from '../components/auth/ResetPasswordHeroIllustration';
import PasswordUpdatedHeroIllustration from '../components/auth/PasswordUpdatedHeroIllustration';

const TrustedBy = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.1, duration: 0.55, ease: 'easeOut' }}
    className="bg-[#EEF2FF]/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.12)] py-4 px-6 xl:px-8 flex flex-col items-center border border-white/40"
  >
    <p className="text-[11px] font-semibold text-slate-400 mb-3 tracking-wide text-center">
      Trusted by smart teams worldwide
    </p>
    <div className="flex flex-wrap justify-center items-center gap-4 xl:gap-7 text-slate-700 font-semibold text-sm">
      {[
        {
          key: 'google',
          label: 'Google',
          icon: (
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          ),
        },
        {
          key: 'microsoft',
          label: 'Microsoft',
          icon: (
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 21 21">
              <path fill="#f25022" d="M0 0h10v10H0z"/>
              <path fill="#7fba00" d="M11 0h10v10H11z"/>
              <path fill="#00a4ef" d="M0 11h10v10H0z"/>
              <path fill="#ffb900" d="M11 11h10v10H11z"/>
            </svg>
          ),
        },
        {
          key: 'slack',
          label: 'Slack',
          icon: (
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" fill="#E01E5A"/>
              <path d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
              <path d="M8.834 5.042a2.528 2.528 0 0 1 2.521-2.52A2.528 2.528 0 0 1 13.877 5.042a2.527 2.527 0 0 1-2.522 2.52H8.834v-2.52z" fill="#36C5F0"/>
              <path d="M8.834 6.313a2.527 2.527 0 0 1 2.522 2.521 2.527 2.527 0 0 1-2.522 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
              <path d="M18.956 8.835a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.835a2.527 2.527 0 0 1-2.522 2.52h-2.522v-2.52z" fill="#2EB67D"/>
              <path d="M17.685 8.835a2.527 2.527 0 0 1-2.522 2.52 2.527 2.527 0 0 1-2.521-2.52V2.522A2.528 2.528 0 0 1 15.164 0a2.528 2.528 0 0 1 2.521 2.522v6.313z" fill="#2EB67D"/>
              <path d="M15.166 18.958a2.528 2.528 0 0 1-2.522 2.522 2.528 2.528 0 0 1-2.521-2.522a2.527 2.527 0 0 1 2.521-2.52h2.522v2.52z" fill="#ECB22E"/>
              <path d="M15.166 17.687a2.527 2.527 0 0 1-2.522-2.521 2.527 2.527 0 0 1 2.522-2.521h6.312A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z" fill="#ECB22E"/>
            </svg>
          ),
        },
        {
          key: 'notion',
          label: 'Notion',
          icon: (
            <div className="h-5 w-5 bg-black rounded flex items-center justify-center shrink-0">
              <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.8 4.2V5c0 .3-.1.4-.4.4h-1.6l-5.6 11.1h-1.2L5.8 7.3v8c0 1.2.6 1.8 1.8 1.8h1c.3 0 .4.1.4.4v.8c0 .3-.1.4-.4.4h-5.2c-.3 0-.4-.1-.4-.4v-.8c0-.3.1-.4.4-.4h.6c1.1 0 1.6-.6 1.6-1.8V7c0-1.2-.6-1.8-1.6-1.8h-.6c-.3 0-.4-.1-.4-.4v-.8c0-.3.1-.4.4-.4h4.4c.2 0 .4.1.4.3l4.7 10 3.8-9.9h-1.4c-.3 0-.4-.1-.4-.4v-.8c0-.3.1-.4.4-.4h4.8c.3 0 .4.1.4.4z"/>
              </svg>
            </div>
          ),
        },
      ].map((item, i) => (
        <motion.div
          key={item.key}
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25 + i * 0.08 }}
          whileHover={{ y: -2, scale: 1.03 }}
        >
          {item.icon}
          <span>{item.label}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const LoginBrandPanel = () => (
  <div className="relative overflow-hidden flex flex-col h-full p-8 xl:p-12 bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#3B82F6]">
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute -top-28 -left-28 w-[22rem] h-[22rem] rounded-full border-[44px] border-white/10"
        animate={{ scale: [1, 1.06, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[28%] -right-20 w-72 h-72 rounded-full border-[36px] border-white/[0.12]"
        animate={{ scale: [1, 1.08, 1], rotate: [0, -10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.div
        className="absolute -bottom-24 left-[18%] w-[26rem] h-[26rem] rounded-full border-[52px] border-white/[0.07]"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
    </div>

    <motion.div
      className="relative z-10 text-white shrink-0"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <Logo className="text-white brightness-0 invert [&_span]:text-white" showText />
      <motion.p
        className="mt-5 xl:mt-6 text-base xl:text-lg text-white/90 max-w-md leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        One platform to manage your organization, teams, projects and productivity.
      </motion.p>
    </motion.div>

    <div className="relative z-10 flex-1 flex items-center justify-center min-h-0 py-4 xl:py-6">
      <LoginHeroIllustration className="w-full max-w-lg xl:max-w-xl drop-shadow-2xl" />
    </div>

    <div className="relative z-10 mt-auto pt-4 shrink-0">
      <TrustedBy />
    </div>
  </div>
);

const SoftSidePanel = ({ title, description, illustration }) => (
  <motion.div
    className="flex flex-col justify-center h-full px-4 sm:px-6 md:px-8 xl:px-4"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.55, ease: 'easeOut' }}
  >
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.45 }}
      className="mb-6 xl:mb-8 max-w-md"
    >
      <h2 className="text-2xl sm:text-3xl xl:text-[32px] font-bold text-heading tracking-tight">
        {title}
      </h2>
      <p className="mt-2 text-sm sm:text-base text-secondaryText leading-relaxed">
        {description}
      </p>
    </motion.div>
    {illustration}
  </motion.div>
);

const ForgotSidePanel = () => (
  <SoftSidePanel
    title="Secure your account"
    description="We take your account security seriously. Let's get you back in."
    illustration={<SecurityHeroIllustration />}
  />
);

const OtpSidePanel = () => (
  <SoftSidePanel
    title="Almost there! Let's verify your account"
    description="Enter the code we emailed you to confirm it's really you and keep your workspace secure."
    illustration={<OtpHeroIllustration className="md:max-w-md xl:max-w-lg" />}
  />
);

const ResetSidePanel = () => (
  <SoftSidePanel
    title={
      <>
        Stronger password,{' '}
        <span className="text-primary">stronger protection</span>
      </>
    }
    description="Create a new password that keeps your account and data secure."
    illustration={<ResetPasswordHeroIllustration className="md:max-w-md xl:max-w-lg" />}
  />
);

const PasswordUpdatedSidePanel = () => (
  <SoftSidePanel
    title="Your account is now secure!"
    description="Your password has been updated successfully. You can now login with your new password."
    illustration={<PasswordUpdatedHeroIllustration className="md:max-w-md xl:max-w-lg" />}
  />
);

const ForgotHeader = () => (
  <header className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 pt-5 sm:pt-6 pb-2">
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Logo tagline="Smart. Organized. Productive." iconSize={30} />
    </motion.div>

    <motion.div
      className="flex items-center gap-2 sm:gap-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      <button
        type="button"
        className="p-2 rounded-lg text-secondaryText hover:text-heading hover:bg-white/70 transition-colors"
        aria-label="Toggle theme"
      >
        <Moon size={18} />
      </button>
      <button
        type="button"
        className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm text-secondaryText hover:text-heading hover:bg-white/70 transition-colors"
        aria-label="Language"
      >
        <Globe size={16} />
        <span className="font-medium">EN</span>
        <ChevronDown size={14} />
      </button>
    </motion.div>
  </header>
);

const LoginLayout = ({ children }) => (
  <div className="min-h-dvh bg-background flex flex-col lg:flex-row lg:items-stretch">
    <motion.div
      className="hidden lg:flex lg:w-[48%] xl:w-1/2 p-4 xl:p-6 shrink-0"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="w-full min-h-[calc(100dvh-2rem)] xl:min-h-[calc(100dvh-3rem)] rounded-2xl xl:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(37,99,235,0.25)]">
        <LoginBrandPanel />
      </div>
    </motion.div>

    <div className="w-full lg:flex-1 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:p-8 xl:p-12 min-h-dvh lg:min-h-0">
      <div className="w-full max-w-md mx-auto">{children}</div>
    </div>
  </div>
);

/**
 * Soft auth shell (Forgot + OTP):
 * - Desktop 1440+: side-by-side
 * - Tablet: stacked / narrower illustration
 * - Mobile: illustration hidden, centered card
 */
const SoftAuthLayout = ({ children, sidePanel, cardMaxClass = 'max-w-md' }) => (
  <div className="min-h-dvh bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-white flex flex-col">
    <ForgotHeader />

    <div className="flex-1 flex flex-col xl:flex-row xl:items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 gap-6 xl:gap-10">
      <div className="hidden md:flex xl:w-1/2 order-1 xl:order-none justify-center xl:justify-start">
        {sidePanel}
      </div>

      <div className="w-full xl:w-1/2 flex items-center justify-center order-2 xl:order-none py-4 md:py-2">
        <div className={`w-full mx-auto ${cardMaxClass}`}>{children}</div>
      </div>
    </div>
  </div>
);

const AuthLayout = ({ children, variant = 'login' }) => {
  if (variant === 'forgot') {
    return (
      <SoftAuthLayout sidePanel={<ForgotSidePanel />}>
        {children}
      </SoftAuthLayout>
    );
  }
  if (variant === 'otp') {
    return (
      <SoftAuthLayout sidePanel={<OtpSidePanel />} cardMaxClass="max-w-[460px]">
        {children}
      </SoftAuthLayout>
    );
  }
  if (variant === 'reset') {
    return (
      <SoftAuthLayout sidePanel={<ResetSidePanel />} cardMaxClass="max-w-[460px]">
        {children}
      </SoftAuthLayout>
    );
  }
  if (variant === 'password-updated') {
    return (
      <SoftAuthLayout sidePanel={<PasswordUpdatedSidePanel />} cardMaxClass="max-w-[460px]">
        {children}
      </SoftAuthLayout>
    );
  }
  return <LoginLayout>{children}</LoginLayout>;
};

export default AuthLayout;
