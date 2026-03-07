import { useState, useEffect } from "react";
import { ReservationsClient, ReservationDto } from "../web-api-client.ts";

const client = new ReservationsClient();

interface StatusLabel {
  label: string;
  className: string;
}

const STATUS_LABELS: Record<number, StatusLabel> = {
  1: { label: "Pending", className: "text-yellow-600" },
  2: { label: "Fulfilled", className: "text-green-600" },
  3: { label: "Cancelled", className: "text-red-500" },
  4: { label: "Expired", className: "text-orange-500" },
};

export function ReservationList() {
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .getUserReservations()
      .then(setReservations)
      .catch(() => setError("Failed to load reservations."))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <p>
        <em>Loading...</em>
      </p>
    );
  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  if (reservations.length === 0)
    return <p className="text-gray-500">You have no reservations.</p>;

  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b bg-gray-50">
          <th className="px-4 py-2 font-semibold text-gray-700">Title</th>
          <th className="px-4 py-2 font-semibold text-gray-700">ISBN</th>
          <th className="px-4 py-2 font-semibold text-gray-700">Reserved</th>
          <th className="px-4 py-2 font-semibold text-gray-700">Expires</th>
          <th className="px-4 py-2 font-semibold text-gray-700">Status</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((r, i) => {
          const status = STATUS_LABELS[r.status ?? -1] ?? {
            label: "Unknown",
            className: "text-gray-500",
          };
          return (
            <tr key={r.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-2">{r.bookTitle}</td>
              <td className="px-4 py-2">{r.bookISBN}</td>
              <td className="px-4 py-2">
                {r.reservedAt
                  ? new Date(r.reservedAt).toLocaleDateString()
                  : "—"}
              </td>
              <td className="px-4 py-2">
                {r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : "—"}
              </td>
              <td className={`px-4 py-2 font-medium ${status.className}`}>
                {status.label}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
