import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';
import SettingsSidebar from '../../components/settings/SettingsSidebar';

const Settings = () => (
  <div className="mx-auto max-w-[1200px] space-y-5 sm:space-y-6">
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-2 flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary shadow-sm ring-1 ring-primary/10">
          <SettingsIcon size={17} strokeWidth={2} />
        </span>
      </div>
      <h1 className="text-[26px] sm:text-[30px] font-bold text-heading tracking-tight leading-tight">
        Settings
      </h1>
      <p className="mt-1.5 max-w-xl text-[13px] sm:text-[14px] text-secondaryText leading-relaxed">
        Account, organization, security, and billing preferences.
      </p>
    </motion.div>

    <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 lg:items-start">
      <SettingsSidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  </div>
);

export default Settings;
