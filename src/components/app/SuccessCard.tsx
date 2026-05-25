import { CheckCircle2, X } from 'lucide-react';
import { Surface } from './Surface';

export function SuccessCard({
  title,
  message,
  onDismiss,
}: {
  title: string;
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <Surface className="border-emerald-200 bg-emerald-50 text-emerald-950 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-50">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-black tracking-tight">{title}</div>
          <div className="mt-0.5 text-[12px] opacity-90">{message}</div>
        </div>
        {onDismiss ? (
          <button onClick={onDismiss} className="rounded-lg p-1 text-emerald-900/70 hover:bg-emerald-100 dark:text-emerald-50/80 dark:hover:bg-emerald-900/40" aria-label="Dismiss success message">
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </Surface>
  );
}
