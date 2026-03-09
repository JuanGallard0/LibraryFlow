import { useState, useEffect } from "react";
import { ReservationsClient, ReservationDto } from "../web-api-client.ts";
import { RESERVATION_STATUS_LABELS, DATE_LOCALE } from "../constants";
import { ErrorAlert } from "./ErrorAlert";
import { Pagination } from "./Pagination";

const client = new ReservationsClient();

const PAGE_SIZE = 10;

export function ReservationList() {
  const [items, setItems] = useState<ReservationDto[]>([]);
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
    client
      .getUserReservations(statusFilter, pageNumber, PAGE_SIZE)
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
  }, [statusFilter, pageNumber]);

  return (
    <div>
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
          <option value="1">Pendiente</option>
          <option value="2">Completada</option>
          <option value="3">Cancelada</option>
          <option value="4">Vencida</option>
        </select>
      </div>

      {error && <ErrorAlert message={error} className="mb-4" />}

      {loading ? (
        <p className="text-stone-500">
          <em>Cargando...</em>
        </p>
      ) : items.length === 0 ? (
        <p className="text-stone-500">No tienes reservaciones.</p>
      ) : (
        <>
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-100">
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Título
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    ISBN
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Reservado
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Vence
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((r) => {
                  const status = RESERVATION_STATUS_LABELS[r.status ?? -1] ?? {
                    label: "Desconocido",
                    className: "text-stone-500",
                  };
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-amber-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-800 font-medium">
                        {r.bookTitle}
                      </td>
                      <td className="px-4 py-3 text-stone-600">{r.bookISBN}</td>
                      <td className="px-4 py-3 text-stone-600">
                        {r.reservedAt
                          ? new Date(r.reservedAt).toLocaleDateString(
                              DATE_LOCALE,
                            )
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {r.expiresAt
                          ? new Date(r.expiresAt).toLocaleDateString(
                              DATE_LOCALE,
                            )
                          : "—"}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${status.className}`}
                      >
                        {status.label}
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
