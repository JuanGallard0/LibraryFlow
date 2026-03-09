import { useLocation, useNavigate } from "react-router-dom";
import { BookDto } from "../web-api-client.ts";
import { BookDetail } from "../components/BookDetail";
import { SuccessAlert } from "../components/SuccessAlert";

interface BookPageState {
  book: BookDto;
  success?: string;
}

export function BookPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bookState = state as BookPageState;

  if (!bookState?.book) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div>
      {bookState.success && <SuccessAlert message={bookState.success} className="mb-4" />}
      <BookDetail book={bookState.book} />
    </div>
  );
}
