import { useState, useEffect } from "react";
import { LoansClient, LoanDto } from "../../web-api-client.ts";

const loansClient = new LoansClient();

const STATUS_LABELS: Record<number, string> = {
  1: "Activo",
  2: "Devuelto",
  3: "Vencido",
};

export function LoansPage() {
  const [loans, setLoans] = useState<LoanDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loansClient
      .getLoans(undefined, undefined)
      .then(setLoans)
      .catch(() => setError("Error al cargar los préstamos."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Préstamos</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p><em>Cargando...</em></p>
      ) : loans.length === 0 ? (
        <p className="text-gray-500">No hay préstamos registrados.</p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-2 font-semibold text-gray-700">Miembro</th>
              <th className="px-4 py-2 font-semibold text-gray-700">Libro</th>
              <th className="px-4 py-2 font-semibold text-gray-700">Ejemplar</th>
              <th className="px-4 py-2 font-semibold text-gray-700">Prestado</th>
              <th className="px-4 py-2 font-semibold text-gray-700">Vence</th>
              <th className="px-4 py-2 font-semibold text-gray-700">Devuelto</th>
              <th className="px-4 py-2 font-semibold text-gray-700">Estado</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, i) => (
              <tr key={loan.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2">{loan.memberName}</td>
                <td className="px-4 py-2">{loan.bookTitle}</td>
                <td className="px-4 py-2">{loan.copyNumber}</td>
                <td className="px-4 py-2">{loan.borrowedAt ? new Date(loan.borrowedAt).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-2">{loan.dueAt ? new Date(loan.dueAt).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-2">{loan.returnedAt ? new Date(loan.returnedAt).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-2">{loan.status !== undefined ? (STATUS_LABELS[loan.status] ?? loan.status) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
