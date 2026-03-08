import { useLocation, useNavigate } from "react-router-dom";
import { BookDto } from "../web-api-client.ts";
import { BookDetail } from "../components/BookDetail";

interface BookPageState {
  book: BookDto;
}

export function BookPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bookState = state as BookPageState;

  if (!bookState?.book) {
    navigate("/", { replace: true });
    return null;
  }

  return <BookDetail book={bookState.book} />;
}
