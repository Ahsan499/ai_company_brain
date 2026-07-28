import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Edit3, MessageSquare, Network } from 'lucide-react';
import Button from '../ui/Button';
import RoleBadge from '../users/RoleBadge';
import StatusBadge from '../users/StatusBadge';

const ProfileHeader = ({ user, isOwnProfile = false, onMessage }) => {
  if (!user) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="
        relative overflow-hidden rounded-[24px]
        border border-border/45 bg-white/90
        shadow-[0_4px_24px_rgba(15,23,42,0.06)]
      "
    >
      {/* Banner */}
      <div
        className="
          relative h-28 sm:h-36
          bg-gradient-to-br from-[#1D4ED8] via-primary to-[#60A5FA]
          overflow-hidden
        "
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.35) 0%, transparent 45%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="relative px-4 sm:px-6 pb-5 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5 -mt-10 sm:-mt-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08, type: 'spring', stiffness: 320, damping: 22 }}
            className="relative shrink-0 self-start sm:self-auto"
          >
            <div
              className="
                flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center
                rounded-full bg-gradient-to-br from-[#3B82F6] via-primary to-[#1E40AF]
                text-white text-[28px] sm:text-[32px] font-semibold
                ring-[4px] ring-white shadow-[0_12px_32px_rgba(37,99,235,0.35)]
              "
            >
              {user.initials}
            </div>
            {user.status === 'active' && (
              <span
                className="
                  absolute bottom-1.5 right-1.5 h-4 w-4 rounded-full bg-success
                  shadow-[0_0_0_3px_#fff]
                "
                title="Online"
              />
            )}
          </motion.div>

          <div className="min-w-0 flex-1 pt-1 sm:pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[24px] sm:text-[28px] font-bold text-heading tracking-tight leading-tight">
                {user.name}
              </h1>
              <StatusBadge status={user.status} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <RoleBadge role={user.role} />
              <span className="text-[13px] font-medium text-secondaryText">
                {user.role === 'Super Admin' ? 'Super Administrator' : user.role}
              </span>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {user.organizationId && (
                <Link
                  to={`/dashboard/organizations/${user.organizationId}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-2.5 py-1 text-[11.5px] font-semibold text-primary ring-1 ring-primary/12 hover:bg-primary/12"
                >
                  <Building2 size={12} />
                  {user.organizationName}
                </Link>
              )}
              {user.departmentId && (
                <Link
                  to={`/dashboard/departments/${user.departmentId}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11.5px] font-semibold text-heading ring-1 ring-slate-200/80 hover:bg-slate-200/70"
                >
                  <Network size={12} className="text-slate-500" />
                  {user.departmentName || user.department}
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:pb-1 shrink-0">
            {isOwnProfile ? (
              <Link to="/dashboard/settings/account">
                <Button type="button" variant="primary" className="h-10 rounded-xl gap-2">
                  <Edit3 size={15} />
                  Edit Profile
                </Button>
              </Link>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              className="h-10 rounded-xl gap-2 bg-white"
              onClick={onMessage}
            >
              <MessageSquare size={15} />
              Message
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ProfileHeader;
