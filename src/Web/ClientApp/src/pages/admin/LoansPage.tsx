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
      <h1 className="text-2xl font-semibold mb-6">Préstamos</h1>

      {error && <ErrorAlert message={error} className="mb-4" />}

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
            {loans.map((loan, i) => {
              const member = loan.memberId !== undefined ? memberMap[loan.memberId] : undefined;
              return (
                <tr key={loan.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2">
                    <span className="font-medium">{loan.memberName}</span>
                    {member?.email && (
                      <>
                        <br />
                        <span className="text-gray-500">{member.email}</span>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-2">{loan.bookTitle}</td>
                  <td className="px-4 py-2">{loan.copyNumber}</td>
                  <td className="px-4 py-2">{loan.borrowedAt ? new Date(loan.borrowedAt).toLocaleDateString(DATE_LOCALE) : "—"}</td>
                  <td className="px-4 py-2">{loan.dueAt ? new Date(loan.dueAt).toLocaleDateString(DATE_LOCALE) : "—"}</td>
                  <td className="px-4 py-2">{loan.returnedAt ? new Date(loan.returnedAt).toLocaleDateString(DATE_LOCALE) : "—"}</td>
                  <td className="px-4 py-2">{loan.status !== undefined ? (LOAN_STATUS_LABELS[loan.status] ?? loan.status) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
