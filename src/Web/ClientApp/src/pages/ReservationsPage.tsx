import { ReservationList } from "../components/ReservationList";
import { useAuth } from "../components/api-authorization/AuthContext";

export function ReservationsPage() {
  const { isAdmin } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">
        {isAdmin ? "Todas las Reservaciones" : "Mis Reservaciones"}
      </h1>
      <ReservationList />
    </div>
  );
}
