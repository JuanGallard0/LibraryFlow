import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReservationsClient, LoansClient, MembersClient, ReservationDto, MemberDto, CreateLoanCommand } from "../../web-api-client.ts";
import { DATE_LOCALE } from "../../constants";
import { ErrorAlert } from "../ErrorAlert";

const reservationsClient = new ReservationsClient();
const loansClient = new LoansClient();
const membersClient = new MembersClient();

const PENDING_STATUS = 1;

export function LoanFromReservationForm() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [memberMap, setMemberMap] = useState<Record<number, MemberDto>>({});
  const [selected, setSelected] = useState<ReservationDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    reservationsClient
      .getAllReservations()
      .then((data) => {
        const pending = data.filter((r) => r.status === PENDING_STATUS);
        setReservations(pending);
        const uniqueIds = [...new Set(pending.map((r) => r.memberId).filter((id): id is number => id !== undefined))];
        Promise.all(uniqueIds.map((id) => membersClient.getMember(id)))
          .then((members) => {
            const map: Record<number, MemberDto> = {};
            members.forEach((m) => { if (m.id !== undefined) map[m.id] = m; });
            setMemberMap(map);
          })
          .catch((err) => console.error('Failed to load member details:', err));
      })
      .catch((err) => {
        console.error('Failed to load reservations:', err);
        setFetchError("Error al cargar las reservaciones.");
      })
      .finally(() => setLoading(false));
  }, []);

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
      navigate("/admin/loans", { state: { success: "Préstamo creado exitosamente." } });
    } catch (err) {
      console.error('Failed to create loan from reservation:', err);
      setError("Error al crear el préstamo. Por favor intenta de nuevo.");
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-stone-500"><em>Cargando reservaciones...</em></p>;
  if (fetchError) return <ErrorAlert message={fetchError} />;
  if (reservations.length === 0) return <p className="text-stone-500">No hay reservaciones pendientes.</p>;

  const selectedMember = selected?.memberId !== undefined ? memberMap[selected.memberId] : undefined;

  return (
    <div className="space-y-6">
      {!selected ? (
        <>
          <p className="text-sm text-stone-600">Selecciona una reservación pendiente para completar:</p>
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-100">
                  <th className="px-4 py-3 font-semibold text-slate-700">Libro</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">ISBN</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Miembro</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Reservado</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Vence</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {reservations.map((r) => {
                  const member = r.memberId !== undefined ? memberMap[r.memberId] : undefined;
                  return (
                    <tr key={r.id} className="hover:bg-amber-50 transition-colors">
                      <td className="px-4 py-3 text-slate-800 font-medium">{r.bookTitle}</td>
                      <td className="px-4 py-3 text-stone-600">{r.bookISBN}</td>
                      <td className="px-4 py-3">
                        {member ? (
                          <>
                            <span className="font-medium text-slate-800">{member.firstName} {member.lastName}</span>
                            <br />
                            <span className="text-stone-500 text-xs">{member.email}</span>
                          </>
                        ) : (
                          <span className="text-stone-400">#{r.memberId}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-600">{r.reservedAt ? new Date(r.reservedAt).toLocaleDateString(DATE_LOCALE) : "—"}</td>
                      <td className="px-4 py-3 text-stone-600">{r.expiresAt ? new Date(r.expiresAt).toLocaleDateString(DATE_LOCALE) : "—"}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(r)}
                          className="px-3 py-1 bg-amber-700 text-white text-xs rounded-md hover:bg-amber-800 font-medium transition-colors"
                        >
                          Seleccionar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="max-w-sm space-y-4">
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-sm space-y-1">
            <p><span className="font-medium text-slate-700">Libro:</span> <span className="text-stone-700">{selected.bookTitle}</span></p>
            <p><span className="font-medium text-slate-700">ISBN:</span> <span className="text-stone-700">{selected.bookISBN}</span></p>
            <p><span className="font-medium text-slate-700">ID Reservación:</span> <span className="text-stone-700">{selected.id}</span></p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-sm space-y-1">
            <p className="font-semibold text-slate-700 mb-1">Miembro</p>
            {selectedMember ? (
              <>
                <p><span className="font-medium text-slate-700">Nombre:</span> <span className="text-stone-700">{selectedMember.firstName} {selectedMember.lastName}</span></p>
                <p><span className="font-medium text-slate-700">Correo:</span> <span className="text-stone-700">{selectedMember.email}</span></p>
              </>
            ) : (
              <p className="text-stone-400">Cargando información del miembro...</p>
            )}
          </div>

          {error && <ErrorAlert message={error} />}

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 disabled:bg-stone-300 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {submitting ? "Creando préstamo..." : "Crear Préstamo"}
            </button>
            <button
              type="button"
              onClick={() => { setSelected(null); setError(""); }}
              className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-100 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
