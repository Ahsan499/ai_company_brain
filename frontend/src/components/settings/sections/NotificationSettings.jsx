import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Button from '../../ui/Button';
import SettingsSection from '../SettingsSection';
import ToggleRow from '../ToggleRow';
import { NOTIFICATION_GROUPS } from '../settingsData';
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '../../../hooks/useSettings';

const buildDefaults = () => {
  const map = {};
  NOTIFICATION_GROUPS.forEach((g) => {
    g.items.forEach((item) => {
      map[item.id] = item.defaultOn;
    });
  });
  return map;
};

const prefsToUi = (apiPrefs) => {
  if (!apiPrefs) return buildDefaults();
  return {
    email: Boolean(apiPrefs.email ?? apiPrefs.email_enabled),
    push: Boolean(apiPrefs.push ?? apiPrefs.push_enabled),
    task_assigned: Boolean(apiPrefs.task_assigned ?? apiPrefs.taskAssigned),
    task_completed: Boolean(apiPrefs.task_completed ?? apiPrefs.taskCompleted),
    meeting_reminders: Boolean(apiPrefs.meeting_reminders ?? apiPrefs.meetingReminders),
    mentions: Boolean(apiPrefs.mentions),
    weekly_digest: Boolean(apiPrefs.weekly_digest ?? apiPrefs.weeklyDigest),
  };
};

const NotificationSettings = () => {
  const { data: apiPrefs, isLoading } = useNotificationPreferences();
  const updatePrefs = useUpdateNotificationPreferences();
  const [prefs, setPrefs] = useState(buildDefaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (apiPrefs) {
      setPrefs(prefsToUi(apiPrefs));
    }
  }, [apiPrefs]);

  const handleSave = async () => {
    await updatePrefs.mutateAsync({
      email: prefs.email,
      push: prefs.push,
      task_assigned: prefs.task_assigned,
      task_completed: prefs.task_completed,
      meeting_reminders: prefs.meeting_reminders,
      mentions: prefs.mentions,
      weekly_digest: prefs.weekly_digest,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SettingsSection
      title="Notifications"
      description="Choose how and when AI Company Brain reaches you."
      action={
        <Button
          type="button"
          variant="primary"
          className="h-10 rounded-xl"
          disabled={isLoading || updatePrefs.isPending}
          onClick={handleSave}
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.span
                key="ok"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-1.5"
              >
                <Check size={15} /> Saved
              </motion.span>
            ) : (
              <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Save preferences
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      }
    >
      <div className="space-y-8">
        {NOTIFICATION_GROUPS.map((group) => (
          <div key={group.id}>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 mb-1">
              {group.title}
            </h3>
            <div>
              {group.items.map((item) => (
                <ToggleRow
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  description={item.description}
                  checked={Boolean(prefs[item.id])}
                  onChange={(v) => setPrefs((p) => ({ ...p, [item.id]: v }))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SettingsSection>
  );
};

export default NotificationSettings;
