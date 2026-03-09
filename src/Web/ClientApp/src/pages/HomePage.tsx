import { useLocation } from "react-router-dom";
import { BookCatalog } from "../components/BookCatalog";
import { SuccessAlert } from "../components/SuccessAlert";

export function HomePage() {
  const { state } = useLocation();
  const success = (state as { success?: string })?.success;

  return (
    <div>
      {success && <SuccessAlert message={success} className="mb-4" />}
      <BookCatalog />
    </div>
  );
}
