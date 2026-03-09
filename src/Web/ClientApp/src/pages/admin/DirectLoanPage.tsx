import { Link } from "react-router-dom";
import { DirectLoanForm } from "../../components/admin/DirectLoanForm";

export function DirectLoanPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Prestar libro directamente
        </h1>
        <Link
          to="/admin/loans/reservations"
          className="text-sm text-amber-700 hover:underline font-medium"
        >
          Prestar libro con reservación
        </Link>
      </div>
      <DirectLoanForm />
    </div>
  );
}
