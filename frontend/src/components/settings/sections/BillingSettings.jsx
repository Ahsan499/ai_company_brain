import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import Button from '../../ui/Button';
import SettingsSection from '../SettingsSection';
import PlanCard from '../PlanCard';
import InvoiceRow from '../InvoiceRow';
import { CURRENT_PLAN, INVOICES, PAYMENT_METHOD } from '../settingsData';

const BillingSettings = () => {
  const [toast, setToast] = useState('');

  const flash = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 2000);
  };

  return (
    <div className="space-y-5">
      <SettingsSection
        title="Billing"
        description="Plan, payment method, and invoice history."
      >
        <PlanCard plan={CURRENT_PLAN} onUpgrade={() => flash('Upgrade flow (demo)')} />

        <div className="mt-6 pt-6 border-t border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <h3 className="text-[14px] font-semibold text-heading">Payment method</h3>
            <Button
              type="button"
              variant="secondary"
              className="h-9 rounded-xl w-fit"
              onClick={() => flash('Update card (demo)')}
            >
              Update
            </Button>
          </div>
          <div className="flex items-center gap-3 rounded-[16px] border border-border/45 bg-slate-50/60 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-white text-primary ring-1 ring-border/50 shadow-sm">
              <CreditCard size={18} />
            </span>
            <div>
              <p className="text-[13.5px] font-semibold text-heading">
                {PAYMENT_METHOD.brand} ···· {PAYMENT_METHOD.last4}
              </p>
              <p className="text-[12px] text-secondaryText">
                Expires {PAYMENT_METHOD.exp} · {PAYMENT_METHOD.name}
              </p>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Invoice history"
        description="Download past invoices for your records."
      >
        <div className="space-y-2">
          {INVOICES.map((inv) => (
            <InvoiceRow
              key={inv.id}
              invoice={inv}
              onDownload={() => flash(`Downloaded ${inv.id} (demo)`)}
            />
          ))}
        </div>
      </SettingsSection>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-2xl bg-heading px-4 py-2.5 text-[13px] font-medium text-white shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BillingSettings;
