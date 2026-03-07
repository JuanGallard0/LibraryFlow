import { ReservationList } from "../components/ReservationList";

export function ReservationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Reservations</h1>
      <ReservationList />
    </div>
  );
}
