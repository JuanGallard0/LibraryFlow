import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LoansClient, LoanDto } from "../../web-api-client.ts";
import { LOAN_STATUS_LABELS, DATE_LOCALE } from "../../constants";
import { ErrorAlert } from "../../components/ErrorAlert";
import { SuccessAlert } from "../../components/SuccessAlert";
import { Pagination } from "../../components/Pagination";

const loansClient = new LoansClient();

const PAGE_SIZE = 10;

export function LoansPage() {
  const { state } = useLocation();
  const [items, setItems] = useState<LoanDto[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState((state as { success?: string })?.success ?? "");
  const [returning, setReturning] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | undefined>(1);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPageNumber(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    setError("");
    loansClient
      .getLoans(undefined, statusFilter, debouncedSearch || undefined, pageNumber, PAGE_SIZE)
      .then((data) => {
        setItems(data.items);
        setPageNumber(data.pageNumber);
        setTotalPages(data.totalPages ?? 1);
        setHasPreviousPage(data.hasPreviousPage ?? false);
        setHasNextPage(data.hasNextPage ?? false);

      })
      .catch((err) => {
        console.error("Failed to load loans:", err);
        setError("Error al cargar los préstamos.");
      })
      .finally(() => setLoading(false));
  }, [statusFilter, debouncedSearch, pageNumber, refreshTick]);

  const handleReturn = async (loanId: number) => {
    setReturning(loanId);
    setError("");
    setSuccess("");
    try {
      await loansClient.returnBook(loanId);
      setRefreshTick((t) => t + 1);
      setSuccess("Devolución registrada exitosamente.");
    } catch (err) {
      console.error("Failed to return book:", err);
      setError("Error al registrar la devolución.");
    } finally {
      setReturning(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Préstamos</h1>

      <div className="flex gap-3 mb-4">
        <input
          type="search"
          placeholder="Buscar por miembro o libro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
        />
        <select
          value={statusFilter ?? ""}
          onChange={(e) => {
            setStatusFilter(e.target.value ? Number(e.target.value) : undefined);
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

      {success && <SuccessAlert message={success} className="mb-4" />}
      {error && <ErrorAlert message={error} className="mb-4" />}

      {loading ? (
        <p className="text-stone-500">
          <em>Cargando...</em>
        </p>
      ) : items.length === 0 ? (
        <p className="text-stone-500">No hay préstamos registrados.</p>
      ) : (
        <>
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-100">
                  <th className="px-4 py-3 font-semibold text-slate-700">Miembro</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Libro</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Ejemplar</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Prestado</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Vence</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Devuelto</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Estado</th>
                  <th className="px-4 py-3 font-semibold text-slate-700"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((loan) => {
                  const isActive = loan.status === 1 || loan.status === 3;
                  const loanStatus = loan.status !== undefined
                    ? (LOAN_STATUS_LABELS[loan.status] ?? { label: String(loan.status), className: "text-stone-500" })
                    : null;
                  return (
                    <tr
                      key={loan.id}
                      className="hover:bg-amber-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {loan.memberName}
                      </td>
                      <td className="px-4 py-3 text-stone-700">{loan.bookTitle}</td>
                      <td className="px-4 py-3 text-stone-600">{loan.copyNumber}</td>
                      <td className="px-4 py-3 text-stone-600">
                        {loan.borrowedAt
                          ? new Date(loan.borrowedAt).toLocaleDateString(DATE_LOCALE)
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {loan.dueAt
                          ? new Date(loan.dueAt).toLocaleDateString(DATE_LOCALE)
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {loan.returnedAt
                          ? new Date(loan.returnedAt).toLocaleDateString(DATE_LOCALE)
                          : "—"}
                      </td>
                      <td className={`px-4 py-3 font-medium ${loanStatus?.className ?? "text-stone-500"}`}>
                        {loanStatus?.label ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {isActive && (
                          <button
                            onClick={() => handleReturn(loan.id!)}
                            disabled={returning === loan.id}
                            className="px-3 py-1 text-xs rounded-md bg-stone-700 text-white hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
                          >
                            {returning === loan.id ? "..." : "Marcar como devuelto"}
                          </button>
                        )}
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
