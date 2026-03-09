import { useState, useEffect } from "react";
import { ReservationsClient, LoansClient, ReservationDto, CreateLoanCommand } from "../../web-api-client.ts";
import { RESERVATION_STATUS_LABELS, DATE_LOCALE } from "../../constants";
import { ErrorAlert } from "../../components/ErrorAlert";
import { SuccessAlert } from "../../components/SuccessAlert";
import { Pagination } from "../../components/Pagination";

const reservationsClient = new ReservationsClient();
const loansClient = new LoansClient();

const PAGE_SIZE = 10;
const PENDING = 1;

export function ReservationsPage() {
  const [items, setItems] = useState<ReservationDto[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | undefined>(PENDING);
  const [selected, setSelected] = useState<ReservationDto | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loanError, setLoanError] = useState("");
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
    reservationsClient
      .getAllReservations(statusFilter, debouncedSearch || undefined, pageNumber, PAGE_SIZE)
      .then((data) => {
        setItems(data.items);
        setPageNumber(data.pageNumber);
        setTotalPages(data.totalPages ?? 1);
        setHasPreviousPage(data.hasPreviousPage ?? false);
        setHasNextPage(data.hasNextPage ?? false);
      })
      .catch((err) => {
        console.error("Failed to load reservations:", err);
        setError("Error al cargar las reservaciones.");
      })
      .finally(() => setLoading(false));
  }, [statusFilter, debouncedSearch, pageNumber, refreshTick]);

  const handleLoan = async () => {
    if (!selected) return;
    setSubmitting(true);
    setLoanError("");
    try {
      await loansClient.createLoan(
        new CreateLoanCommand({
          bookId: selected.bookId ?? 0,
          memberId: selected.memberId ?? 0,
          reservationId: selected.id,
        })
      );
      setSelected(null);
      setRefreshTick((t) => t + 1);
      setSuccess("Préstamo creado exitosamente.");
    } catch (err) {
      console.error("Failed to create loan:", err);
      setLoanError("Error al crear el préstamo. Por favor intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (selected) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Reservaciones</h1>
        <div className="max-w-sm space-y-4">
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-sm space-y-1">
            <p><span className="font-medium text-slate-700">Libro:</span> <span className="text-stone-700">{selected.bookTitle}</span></p>
            <p><span className="font-medium text-slate-700">ISBN:</span> <span className="text-stone-700">{selected.bookISBN}</span></p>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-sm space-y-1">
            <p className="font-semibold text-slate-700 mb-1">Miembro</p>
            <p><span className="font-medium text-slate-700">Nombre:</span> <span className="text-stone-700">{selected.memberName}</span></p>
            {selected.memberEmail && (
              <p><span className="font-medium text-slate-700">Correo:</span> <span className="text-stone-700">{selected.memberEmail}</span></p>
            )}
          </div>
          {loanError && <ErrorAlert message={loanError} />}
          <div className="flex gap-2">
            <button
              onClick={handleLoan}
              disabled={submitting}
              className="px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 disabled:bg-stone-300 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {submitting ? "Creando préstamo..." : "Confirmar préstamo"}
            </button>
            <button
              type="button"
              onClick={() => { setSelected(null); setLoanError(""); }}
              className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-100 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Reservaciones</h1>

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
          <option value="1">Pendiente</option>
          <option value="2">Completada</option>
          <option value="3">Cancelada</option>
          <option value="4">Vencida</option>
        </select>
      </div>

      {success && <SuccessAlert message={success} className="mb-4" />}
      {error && <ErrorAlert message={error} className="mb-4" />}

      {loading ? (
        <p className="text-stone-500"><em>Cargando...</em></p>
      ) : items.length === 0 ? (
        <p className="text-stone-500">No hay reservaciones registradas.</p>
      ) : (
        <>
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-100">
                  <th className="px-4 py-3 font-semibold text-slate-700">Título</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">ISBN</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Miembro</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Reservado</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Vence</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Estado</th>
                  <th className="px-4 py-3 font-semibold text-slate-700"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((r) => {
                  const status = RESERVATION_STATUS_LABELS[r.status ?? -1] ?? {
                    label: "Desconocido",
                    className: "text-stone-500",
                  };
                  return (
                    <tr key={r.id} className="hover:bg-amber-50 transition-colors">
                      <td className="px-4 py-3 text-slate-800 font-medium">{r.bookTitle}</td>
                      <td className="px-4 py-3 text-stone-600">{r.bookISBN}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800">{r.memberName}</span>
                        {r.memberEmail && (
                          <>
                            <br />
                            <span className="text-stone-500 text-xs">{r.memberEmail}</span>
                          </>
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {r.reservedAt ? new Date(r.reservedAt).toLocaleDateString(DATE_LOCALE) : "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {r.expiresAt ? new Date(r.expiresAt).toLocaleDateString(DATE_LOCALE) : "—"}
                      </td>
                      <td className={`px-4 py-3 font-medium ${status.className}`}>
                        {status.label}
                      </td>
                      <td className="px-4 py-3">
                        {r.status === PENDING && (
                          <button
                            onClick={() => { setSuccess(""); setSelected(r); }}
                            className="px-3 py-1 bg-amber-700 text-white text-xs rounded-md hover:bg-amber-800 font-medium transition-colors"
                          >
                            Prestar
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
