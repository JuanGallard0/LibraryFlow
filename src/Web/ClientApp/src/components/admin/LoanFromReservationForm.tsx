import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReservationsClient, LoansClient, MembersClient, ReservationDto, MemberDto, CreateLoanCommand } from "../../web-api-client.ts";

const reservationsClient = new ReservationsClient();
const loansClient = new LoansClient();
const membersClient = new MembersClient();

// Status 1 = Pending (see ReservationList.tsx)
const PENDING_STATUS = 1;

export function LoanFromReservationForm() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [selected, setSelected] = useState<ReservationDto | null>(null);
  const [member, setMember] = useState<MemberDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    reservationsClient
      .getAllReservations()
      .then((data) => setReservations(data.filter((r) => r.status === PENDING_STATUS)))
      .catch(() => setFetchError("Error al cargar las reservaciones."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected?.memberId) { setMember(null); return; }
    membersClient.getMember(selected.memberId).then(setMember).catch(() => setMember(null));
  }, [selected]);

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError("");
    try {
      await loansClient.createLoan(
        new CreateLoanCommand({
          bookId: selected.bookId!,
          memberId: selected.memberId!,
          reservationId: selected.id,
        })
      );
      navigate("/admin/loans");
    } catch {
      setError("Error al crear el préstamo. Por favor intenta de nuevo.");
      setSubmitting(false);
    }
  };

  if (loading) return <p><em>Cargando reservaciones...</em></p>;
  if (fetchError) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{fetchError}</div>
  );
  if (reservations.length === 0) return <p className="text-gray-500">No hay reservaciones pendientes.</p>;

  return (
    <div className="space-y-6">
      {!selected ? (
        <>
          <p className="text-sm text-gray-600">Selecciona una reservación pendiente para completar:</p>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-2 font-semibold text-gray-700">Libro</th>
                <th className="px-4 py-2 font-semibold text-gray-700">ISBN</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Reservado</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Vence</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r, i) => (
                <tr key={r.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2">{r.bookTitle}</td>
                  <td className="px-4 py-2">{r.bookISBN}</td>
                  <td className="px-4 py-2">{r.reservedAt ? new Date(r.reservedAt).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-2">{r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelected(r)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      Seleccionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="max-w-sm space-y-4">
          <div className="bg-gray-50 border rounded p-4 text-sm space-y-1">
            <p><span className="font-medium">Libro:</span> {selected.bookTitle}</p>
            <p><span className="font-medium">ISBN:</span> {selected.bookISBN}</p>
            <p><span className="font-medium">ID Reservación:</span> {selected.id}</p>
          </div>

          <div className="bg-gray-50 border rounded p-4 text-sm space-y-1">
            <p className="font-medium text-gray-700 mb-1">Miembro</p>
            {member ? (
              <>
                <p><span className="font-medium">Nombre:</span> {member.firstName} {member.lastName}</p>
                <p><span className="font-medium">Correo:</span> {member.email}</p>
              </>
            ) : (
              <p className="text-gray-400">Cargando información del miembro...</p>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {submitting ? "Creando préstamo..." : "Crear Préstamo"}
            </button>
            <button
              type="button"
              onClick={() => { setSelected(null); setMember(null); setError(""); }}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
