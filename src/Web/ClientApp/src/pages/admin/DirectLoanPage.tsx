import { Link } from "react-router-dom";
import { DirectLoanForm } from "../../components/admin/DirectLoanForm";

export function DirectLoanPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Create Direct Loan</h1>
        <Link to="/admin/loans" className="text-sm text-blue-600 hover:underline">
          Create loan from reservation instead
        </Link>
      </div>
      <DirectLoanForm />
    </div>
  );
}
