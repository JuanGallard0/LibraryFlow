import { useLocation, useNavigate } from "react-router-dom";
import { BookDetail } from "../components/BookDetail";

export function BookPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.book) {
    navigate("/", { replace: true });
    return null;
  }

  return <BookDetail book={state.book} />;
}
