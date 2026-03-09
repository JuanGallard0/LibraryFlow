import { useState, useEffect } from "react";
import { LoansClient, MembersClient, LoanDto, MemberDto } from "../../web-api-client.ts";
import { LOAN_STATUS_LABELS, DATE_LOCALE } from "../../constants";
import { ErrorAlert } from "../../components/ErrorAlert";

const loansClient = new LoansClient();
const membersClient = new MembersClient();

export function LoansPage() {
  const [loans, setLoans] = useState<LoanDto[]>([]);
  const [memberMap, setMemberMap] = useState<Record<number, MemberDto>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loansClient
      .getLoans(undefined, undefined)
      .then((data) => {
        setLoans(data);
        const uniqueIds = [...new Set(data.map((l) => l.memberId).filter((id): id is number => id !== undefined))];
        Promise.all(uniqueIds.map((id) => membersClient.getMember(id)))
          .then((members) => {
            const map: Record<number, MemberDto> = {};
            members.forEach((m) => { if (m.id !== undefined) map[m.id] = m; });
            setMemberMap(map);
          })
          .catch((err) => console.error('Failed to load member details:', err));
      })
      .catch((err) => {
        console.error('Failed to load loans:', err);
        setError("Error al cargar los préstamos.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Préstamos</h1>

      {error && <ErrorAlert message={error} className="mb-4" />}

      {loading ? (
        <p className="text-stone-500"><em>Cargando...</em></p>
      ) : loans.length === 0 ? (
        <p className="text-stone-500">No hay préstamos registrados.</p>
      ) : (
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
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loans.map((loan) => {
                const member = loan.memberId !== undefined ? memberMap[loan.memberId] : undefined;
                return (
                  <tr key={loan.id} className="hover:bg-amber-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800">{loan.memberName}</span>
                      {member?.email && (
                        <>
                          <br />
                          <span className="text-stone-500 text-xs">{member.email}</span>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 text-stone-700">{loan.bookTitle}</td>
                    <td className="px-4 py-3 text-stone-600">{loan.copyNumber}</td>
                    <td className="px-4 py-3 text-stone-600">{loan.borrowedAt ? new Date(loan.borrowedAt).toLocaleDateString(DATE_LOCALE) : "—"}</td>
                    <td className="px-4 py-3 text-stone-600">{loan.dueAt ? new Date(loan.dueAt).toLocaleDateString(DATE_LOCALE) : "—"}</td>
                    <td className="px-4 py-3 text-stone-600">{loan.returnedAt ? new Date(loan.returnedAt).toLocaleDateString(DATE_LOCALE) : "—"}</td>
                    <td className="px-4 py-3 text-stone-600">{loan.status !== undefined ? (LOAN_STATUS_LABELS[loan.status] ?? loan.status) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
