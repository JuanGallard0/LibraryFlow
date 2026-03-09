import { useState, useEffect } from "react";
import { LoansClient, LoanDto } from "../web-api-client.ts";
import { LOAN_STATUS_LABELS, DATE_LOCALE } from "../constants";
import { ErrorAlert } from "../components/ErrorAlert";
import { Pagination } from "../components/Pagination";

const loansClient = new LoansClient();

const PAGE_SIZE = 10;

export function MyLoansPage() {
  const [items, setItems] = useState<LoanDto[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | undefined>();

  useEffect(() => {
    setLoading(true);
    setError("");
    loansClient
      .getMyLoans(statusFilter, pageNumber, PAGE_SIZE)
      .then((data) => {
        setItems(data.items);
        setPageNumber(data.pageNumber);
        setTotalPages(data.totalPages ?? 1);
        setHasPreviousPage(data.hasPreviousPage ?? false);
        setHasNextPage(data.hasNextPage ?? false);
      })
      .catch((err) => {
        console.error("Failed to load my loans:", err);
        setError("Error al cargar los préstamos.");
      })
      .finally(() => setLoading(false));
  }, [statusFilter, pageNumber]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Mis Préstamos</h1>

      <div className="mb-4">
        <select
          value={statusFilter ?? ""}
          onChange={(e) => {
            setStatusFilter(
              e.target.value ? Number(e.target.value) : undefined,
            );
            setPageNumber(1);
          }}
          className="border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
        >
          <option value="">Todos los estados</option>
          <option value="1">Activo</option>
          <option value="2">Devuelto</option>
          <option value="3">Vencido</option>
        </select>
      </div>

      {error && <ErrorAlert message={error} className="mb-4" />}

      {loading ? (
        <p className="text-stone-500">
          <em>Cargando...</em>
        </p>
      ) : items.length === 0 ? (
        <p className="text-stone-500">No tienes préstamos registrados.</p>
      ) : (
        <>
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-100">
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Libro
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Nº Ejemplar
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Prestado
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Vence
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Devuelto
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((loan) => {
                  const loanStatus =
                    loan.status !== undefined
                      ? (LOAN_STATUS_LABELS[loan.status] ?? {
                          label: String(loan.status),
                          className: "text-stone-500",
                        })
                      : null;
                  return (
                    <tr
                      key={loan.id}
                      className="hover:bg-amber-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-800 font-medium">
                        {loan.bookTitle}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {loan.copyNumber}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {loan.borrowedAt
                          ? new Date(loan.borrowedAt).toLocaleDateString(
                              DATE_LOCALE,
                            )
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {loan.dueAt
                          ? new Date(loan.dueAt).toLocaleDateString(DATE_LOCALE)
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {loan.returnedAt
                          ? new Date(loan.returnedAt).toLocaleDateString(
                              DATE_LOCALE,
                            )
                          : "—"}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${loanStatus?.className ?? "text-stone-500"}`}
                      >
                        {loanStatus?.label ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            pageNumber={pageNumber}
            totalPages={totalPages}
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            onPageChange={setPageNumber}
          />
        </>
      )}
    </div>
  );
}
