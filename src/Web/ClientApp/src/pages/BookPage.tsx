import { Link, useLocation } from "react-router-dom";
import { BookDto } from "../web-api-client.ts";
import { BookDetail } from "../components/BookDetail";
import { SuccessAlert } from "../components/SuccessAlert";

interface BookPageState {
  book: BookDto;
  success?: string;
}

export function BookPage() {
  const { state } = useLocation();
  const bookState = state as BookPageState | null;

  if (!bookState?.book) {
    return (
      <div>
        <p className="text-stone-500 mb-4">Libro no encontrado.</p>
        <Link to="/" className="text-sm text-amber-700 hover:underline">
          &larr; Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div>
      {bookState.success && <SuccessAlert message={bookState.success} className="mb-4" />}
      <BookDetail book={bookState.book} />
    </div>
  );
}
