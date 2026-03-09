import { useState } from "react";
import { LoanFromReservationForm } from "../../components/admin/LoanFromReservationForm";
import { DirectLoanForm } from "../../components/admin/DirectLoanForm";

type Mode = "reservation" | "direct";

export function LoanFromReservationPage() {
  const [mode, setMode] = useState<Mode>("reservation");

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Prestar Libro</h1>

      <div className="flex gap-1 mb-6 bg-stone-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setMode("reservation")}
          className={
            mode === "reservation"
              ? "px-4 py-2 rounded-md text-sm font-medium bg-white text-slate-800 shadow-sm transition-all"
              : "px-4 py-2 rounded-md text-sm font-medium text-stone-500 hover:text-slate-700 transition-all"
          }
        >
          Desde Reservación
        </button>
        <button
          onClick={() => setMode("direct")}
          className={
            mode === "direct"
              ? "px-4 py-2 rounded-md text-sm font-medium bg-white text-slate-800 shadow-sm transition-all"
              : "px-4 py-2 rounded-md text-sm font-medium text-stone-500 hover:text-slate-700 transition-all"
          }
        >
          Directo
        </button>
      </div>

      {mode === "reservation" ? <LoanFromReservationForm /> : <DirectLoanForm />}
    </div>
  );
}
