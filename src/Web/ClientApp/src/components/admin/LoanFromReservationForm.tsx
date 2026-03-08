import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReservationsClient, LoansClient, ReservationDto, CreateLoanCommand } from "../../web-api-client.ts";

const reservationsClient = new ReservationsClient();
const loansClient = new LoansClient();

// Status 1 = Pending (see ReservationList.tsx)
const PENDING_STATUS = 1;

export function LoanFromReservationForm() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [selected, setSelected] = useState<ReservationDto | null>(null);
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    reservationsClient
      .getAllReservations()
      .then((data) => setReservations(data.filter((r) => r.status === PENDING_STATUS)))
      .catch(() => setFetchError("Failed to load reservations."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!selected || !memberId) return;
    setSubmitting(true);
    setError("");
    try {
      await loansClient.createLoan(
        new CreateLoanCommand({
          bookId: selected.bookId!,
          memberId: parseInt(memberId, 10),
          reservationId: selected.id,
        })
      );
      navigate("/admin/loans");
    } catch {
      setError("Failed to create loan. Check that the member ID matches the reservation.");
      setSubmitting(false);
    }
  };

  if (loading) return <p><em>Loading reservations...</em></p>;
  if (fetchError) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{fetchError}</div>
  );
  if (reservations.length === 0) return <p className="text-gray-500">No pending reservations.</p>;

  return (
    <div className="space-y-6">
      {!selected ? (
        <>
          <p className="text-sm text-gray-600">Select a pending reservation to fulfill:</p>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-2 font-semibold text-gray-700">Book</th>
                <th className="px-4 py-2 font-semibold text-gray-700">ISBN</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Reserved</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Expires</th>
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
                      Select
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
            <p><span className="font-medium">Book:</span> {selected.bookTitle}</p>
            <p><span className="font-medium">ISBN:</span> {selected.bookISBN}</p>
            <p><span className="font-medium">Reservation ID:</span> {selected.id}</p>
          </div>

          <div>
            <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 mb-1">
              Member ID
            </label>
            {/* memberId is not returned by the reservations API — the admin must enter it */}
            <input
              type="number"
              id="memberId"
              min={1}
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter member ID"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              The member ID must match the one who made the reservation.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!memberId || submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating loan..." : "Create Loan"}
            </button>
            <button
              type="button"
              onClick={() => { setSelected(null); setMemberId(""); setError(""); }}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
