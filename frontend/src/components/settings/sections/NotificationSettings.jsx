import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Button from '../../ui/Button';
import SettingsSection from '../SettingsSection';
import ToggleRow from '../ToggleRow';
import { NOTIFICATION_GROUPS } from '../settingsData';

const buildDefaults = () => {
  const map = {};
  NOTIFICATION_GROUPS.forEach((g) => {
    g.items.forEach((item) => {
      map[item.id] = item.defaultOn;
    });
  });
  return map;
};

const NotificationSettings = () => {
  const [prefs, setPrefs] = useState(buildDefaults);
  const [saved, setSaved] = useState(false);

  return (
    <SettingsSection
      title="Notifications"
      description="Choose how and when AI Company Brain reaches you."
      action={
        <Button
          type="button"
          variant="primary"
          className="h-10 rounded-xl"
          onClick={() => {
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2000);
          }}
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
