import { Link } from "react-router-dom";
import { LoanFromReservationForm } from "../../components/admin/LoanFromReservationForm";

export function LoanFromReservationPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Create Loan from Reservation</h1>
        <Link to="/admin/loans/direct" className="text-sm text-blue-600 hover:underline">
          Create direct loan instead
        </Link>
      </div>
      <LoanFromReservationForm />
    </div>
  );
}
