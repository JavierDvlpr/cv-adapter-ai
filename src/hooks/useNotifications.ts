import { useRef, useState } from 'react';
import type { ToastItem } from '../components/ToastStack';

export function useNotifications() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(1);

  const notify = (message: string, type: ToastItem['type'] = 'info') => {
    const id = toastIdRef.current++;
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3000);
  };

  return { toasts, notify };
}
