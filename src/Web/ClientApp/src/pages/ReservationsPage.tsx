import { ReservationList } from "../components/ReservationList";

export function ReservationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Mis Reservaciones</h1>
      <ReservationList />
    </div>
  );
}
