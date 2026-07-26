import { Monitor, Smartphone, Tablet } from 'lucide-react';
import Button from '../ui/Button';

function pickDeviceIcon(device = '') {
  const d = device.toLowerCase();
  if (d.includes('ios') || d.includes('android')) return 'phone';
  if (d.includes('ipad') || d.includes('tablet')) return 'tablet';
  return 'monitor';
}

const SessionRow = ({ session, onRevoke }) => {
  if (!session) return null;
  const kind = pickDeviceIcon(session.device);

  return (
    <div
      className="
        flex flex-col sm:flex-row sm:items-center gap-3
        rounded-[16px] border border-border/45 bg-slate-50/50 p-3.5
      "
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white text-slate-500 ring-1 ring-border/60 shadow-sm">
        {kind === 'phone' && <Smartphone size={17} strokeWidth={1.9} />}
        {kind === 'tablet' && <Tablet size={17} strokeWidth={1.9} />}
        {kind === 'monitor' && <Monitor size={17} strokeWidth={1.9} />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13.5px] font-semibold text-heading">{session.device}</p>
          {session.current && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700 ring-1 ring-emerald-500/15">
              This device
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[12px] text-secondaryText">
          {session.location} · {session.ip}
        </p>
        <p className="mt-0.5 text-[11.5px] text-slate-400">{session.lastActive}</p>
      </div>
      {!session.current && (
        <Button
          type="button"
          variant="secondary"
          className="h-9 rounded-xl text-[12.5px] shrink-0"
          onClick={() => onRevoke?.(session.id)}
        >
          Revoke
        </Button>
      )}
    </div>
  );
};

export default SessionRow;
