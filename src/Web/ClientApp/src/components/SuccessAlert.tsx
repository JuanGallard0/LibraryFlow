interface SuccessAlertProps {
  message: string;
  className?: string;
}

export function SuccessAlert({ message, className = "" }: SuccessAlertProps) {
  return (
    <div className={`bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-md ${className}`}>
      {message}
    </div>
  );
}
