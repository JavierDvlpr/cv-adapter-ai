export interface ToastItem {
  id: number;
  message: string;
  type: 'ok' | 'err' | 'info' | 'warn';
}

interface ToastStackProps {
  toasts: ToastItem[];
}

export function ToastStack({ toasts }: ToastStackProps) {
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`.trim()}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
