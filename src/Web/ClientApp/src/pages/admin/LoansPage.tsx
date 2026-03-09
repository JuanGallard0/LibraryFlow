import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  LoansClient,
  MembersClient,
  LoanDto,
  MemberDto,
} from "../../web-api-client.ts";
import { LOAN_STATUS_LABELS, DATE_LOCALE } from "../../constants";
import { ErrorAlert } from "../../components/ErrorAlert";
import { SuccessAlert } from "../../components/SuccessAlert";

const loansClient = new LoansClient();
const membersClient = new MembersClient();

export function LoansPage() {
  const { state } = useLocation();
  const [loans, setLoans] = useState<LoanDto[]>([]);
  const [memberMap, setMemberMap] = useState<Record<number, MemberDto>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState((state as { success?: string })?.success ?? "");
  const [returning, setReturning] = useState<number | null>(null);
  const [showReturned, setShowReturned] = useState(false);

  const loadLoans = () => {
    return loansClient.getLoans(undefined, undefined).then((data) => {
      setLoans(data);
      const uniqueIds = [
        ...new Set(
          data
            .map((l) => l.memberId)
            .filter((id): id is number => id !== undefined),
        ),
      ];
      Promise.all(uniqueIds.map((id) => membersClient.getMember(id)))
        .then((members) => {
          const map: Record<number, MemberDto> = {};
          members.forEach((m) => {
            if (m.id !== undefined) map[m.id] = m;
          });
          setMemberMap(map);
        })
        .catch((err) => console.error("Failed to load member details:", err));
    });
  };

  useEffect(() => {
    loadLoans()
      .catch((err) => {
        console.error("Failed to load loans:", err);
        setError("Error al cargar los préstamos.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleReturn = async (loanId: number) => {
    setReturning(loanId);
    setError("");
    setSuccess("");
    try {
      await loansClient.returnBook(loanId);
      await loadLoans();
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Préstamos</h1>
        <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showReturned}
            onChange={(e) => setShowReturned(e.target.checked)}
            className="accent-amber-700"
          />
          Mostrar devueltos
        </label>
      </div>

      {success && <SuccessAlert message={success} className="mb-4" />}
      {error && <ErrorAlert message={error} className="mb-4" />}

      {loading ? (
        <p className="text-stone-500">
          <em>Cargando...</em>
        </p>
      ) : loans.length === 0 ? (
        <p className="text-stone-500">No hay préstamos registrados.</p>
      ) : (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-100">
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Miembro
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Libro
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Ejemplar
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
                <th className="px-4 py-3 font-semibold text-slate-700"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loans
                .filter((loan) => showReturned || loan.status !== 2)
                .map((loan) => {
                  const member =
                    loan.memberId !== undefined
                      ? memberMap[loan.memberId]
                      : undefined;
                  const isActive = loan.status === 1 || loan.status === 3;
                  return (
                    <tr
                      key={loan.id}
                      className="hover:bg-amber-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800">
                          {loan.memberName}
                        </span>
                        {member?.email && (
                          <>
                            <br />
                            <span className="text-stone-500 text-xs">
                              {member.email}
                            </span>
                          </>
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-700">
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
                      <td className="px-4 py-3 text-stone-600">
                        {loan.status !== undefined
                          ? (LOAN_STATUS_LABELS[loan.status] ?? loan.status)
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {isActive && (
                          <button
                            onClick={() => handleReturn(loan.id!)}
                            disabled={returning === loan.id}
                            className="px-3 py-1 text-xs rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {returning === loan.id
                              ? "..."
                              : "Marcar como devuelto"}
                          </button>
                        )}
                      </td>
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
