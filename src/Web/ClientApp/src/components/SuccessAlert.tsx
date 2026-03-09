import { useEffect } from "react";

interface SuccessAlertProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
}

export function SuccessAlert({ message, className = "", onDismiss }: SuccessAlertProps) {
  useEffect(() => {
    if (!onDismiss) return;
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className={`bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-md ${className}`}>
      {message}
    </div>
  );
}
