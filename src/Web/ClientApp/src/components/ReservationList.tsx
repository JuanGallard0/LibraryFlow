import { useState, useEffect } from "react";
import { ReservationsClient, MembersClient, ReservationDto, MemberDto } from "../web-api-client.ts";
import { RESERVATION_STATUS_LABELS, DATE_LOCALE } from "../constants";
import { useAuth } from "./api-authorization/AuthContext";
import { ErrorAlert } from "./ErrorAlert";

const client = new ReservationsClient();
const membersClient = new MembersClient();

export function ReservationList() {
  const { isAdmin } = useAuth();
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [memberMap, setMemberMap] = useState<Record<number, MemberDto>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = isAdmin ? client.getAllReservations() : client.getUserReservations();
    fetch
      .then((data) => {
        setReservations(data);
        if (isAdmin) {
          const uniqueIds = [...new Set(data.map((r) => r.memberId).filter((id): id is number => id !== undefined))];
          Promise.all(uniqueIds.map((id) => membersClient.getMember(id)))
            .then((members) => {
              const map: Record<number, MemberDto> = {};
              members.forEach((m) => { if (m.id !== undefined) map[m.id] = m; });
              setMemberMap(map);
            })
            .catch((err) => console.error('Failed to load member details:', err));
        }
      })
      .catch((err) => {
        console.error('Failed to load reservations:', err);
        setError("Error al cargar las reservaciones.");
      })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (loading)
    return (
      <p className="text-stone-500">
        <em>Cargando...</em>
      </p>
    );
  if (error) return <ErrorAlert message={error} />;
  if (reservations.length === 0)
    return (
      <p className="text-stone-500">
        {isAdmin ? "No hay reservaciones registradas." : "No tienes reservaciones."}
      </p>
    );

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-100">
            <th className="px-4 py-3 font-semibold text-slate-700">Título</th>
            <th className="px-4 py-3 font-semibold text-slate-700">ISBN</th>
            {isAdmin && <th className="px-4 py-3 font-semibold text-slate-700">Miembro</th>}
            <th className="px-4 py-3 font-semibold text-slate-700">Reservado</th>
            <th className="px-4 py-3 font-semibold text-slate-700">Vence</th>
            <th className="px-4 py-3 font-semibold text-slate-700">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {reservations.map((r) => {
            const status = RESERVATION_STATUS_LABELS[r.status ?? -1] ?? {
              label: "Desconocido",
              className: "text-stone-500",
            };
            const member = r.memberId !== undefined ? memberMap[r.memberId] : undefined;
            return (
              <tr key={r.id} className="hover:bg-amber-50 transition-colors">
                <td className="px-4 py-3 text-slate-800 font-medium">{r.bookTitle}</td>
                <td className="px-4 py-3 text-stone-600">{r.bookISBN}</td>
                {isAdmin && (
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
                )}
                <td className="px-4 py-3 text-stone-600">
                  {r.reservedAt
                    ? new Date(r.reservedAt).toLocaleDateString(DATE_LOCALE)
                    : "—"}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {r.expiresAt ? new Date(r.expiresAt).toLocaleDateString(DATE_LOCALE) : "—"}
                </td>
                <td className={`px-4 py-3 font-medium ${status.className}`}>
                  {status.label}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
