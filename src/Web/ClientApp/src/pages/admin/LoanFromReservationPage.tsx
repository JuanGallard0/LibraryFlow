import { Link } from "react-router-dom";
import { LoanFromReservationForm } from "../../components/admin/LoanFromReservationForm";

export function LoanFromReservationPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Crear Préstamo desde Reservación</h1>
        <Link to="/admin/loans/direct" className="text-sm text-blue-600 hover:underline">
          Crear préstamo directo
        </Link>
      </div>
      <LoanFromReservationForm />
    </div>
  );
}
