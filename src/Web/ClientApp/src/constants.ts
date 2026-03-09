export interface LoanStatusLabel {
  label: string;
  className: string;
}

export const LOAN_STATUS_LABELS: Record<number, LoanStatusLabel> = {
  1: { label: "Activo", className: "text-emerald-700" },
  2: { label: "Devuelto", className: "text-stone-500" },
  3: { label: "Vencido", className: "text-red-600" },
};

export interface ReservationStatusLabel {
  label: string;
  className: string;
}

export const RESERVATION_STATUS_LABELS: Record<number, ReservationStatusLabel> = {
  1: { label: "Pendiente", className: "text-yellow-600" },
  2: { label: "Completada", className: "text-green-600" },
  3: { label: "Cancelada", className: "text-red-500" },
  4: { label: "Vencida", className: "text-orange-500" },
};

export const CONDITION_LABELS: Record<number, string> = {
  0: "Nuevo",
  1: "Bueno",
  2: "Regular",
  3: "Malo",
};

export const DATE_LOCALE = "es-SV";
