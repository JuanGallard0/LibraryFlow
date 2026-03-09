import { useState, useEffect } from "react";
import { LoansClient, LoanDto } from "../web-api-client.ts";
import { LOAN_STATUS_LABELS, DATE_LOCALE } from "../constants";
import { ErrorAlert } from "../components/ErrorAlert";

const loansClient = new LoansClient();

export function MyLoansPage() {
  const [loans, setLoans] = useState<LoanDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loansClient
      .getMyLoans()
      .then(setLoans)
      .catch((err) => {
        console.error('Failed to load my loans:', err);
        setError("Error al cargar los préstamos.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Mis Préstamos</h1>

      {error && <ErrorAlert message={error} className="mb-4" />}

      {loading ? (
        <p className="text-stone-500"><em>Cargando...</em></p>
      ) : loans.length === 0 ? (
        <p className="text-stone-500">No tienes préstamos registrados.</p>
      ) : (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-100">
                <th className="px-4 py-3 font-semibold text-slate-700">Libro</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Nº Ejemplar</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Prestado</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Vence</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Devuelto</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-amber-50 transition-colors">
                  <td className="px-4 py-3 text-slate-800 font-medium">{loan.bookTitle}</td>
                  <td className="px-4 py-3 text-stone-600">{loan.copyNumber}</td>
                  <td className="px-4 py-3 text-stone-600">{loan.borrowedAt ? new Date(loan.borrowedAt).toLocaleDateString(DATE_LOCALE) : "—"}</td>
                  <td className="px-4 py-3 text-stone-600">{loan.dueAt ? new Date(loan.dueAt).toLocaleDateString(DATE_LOCALE) : "—"}</td>
                  <td className="px-4 py-3 text-stone-600">{loan.returnedAt ? new Date(loan.returnedAt).toLocaleDateString(DATE_LOCALE) : "—"}</td>
                  <td className="px-4 py-3 text-stone-600">{loan.status !== undefined ? (LOAN_STATUS_LABELS[loan.status] ?? loan.status) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
