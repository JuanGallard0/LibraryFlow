import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { BooksClient, BookDto, CreateBookCopyRequest } from "../../web-api-client.ts";
import { ErrorAlert } from "../../components/ErrorAlert";

const booksClient = new BooksClient();

interface LocationState {
  book: BookDto;
}

export function AddBookCopyPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const book = (state as LocationState)?.book;
  const bookId = parseInt(id ?? "", 10);

  const [copyNumber, setCopyNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await booksClient.createBookCopy(bookId, new CreateBookCopyRequest({ copyNumber }));
      navigate(`/books/${bookId}`, { state: { book } });
    } catch (err) {
      console.error('Failed to add book copy:', err);
      setError("Error al agregar el ejemplar. Por favor intenta de nuevo.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Agregar Ejemplar</h1>
      {book && <p className="text-stone-500 mb-6">{book.title}</p>}
      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
        <div>
          <label htmlFor="copyNumber" className="block text-sm font-medium text-slate-700 mb-1">
            Número de Ejemplar
          </label>
          <input
            type="text"
            id="copyNumber"
            value={copyNumber}
            onChange={(e) => setCopyNumber(e.target.value)}
            required
            className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 disabled:bg-stone-300 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {submitting ? "Agregando..." : "Agregar Ejemplar"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-100 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
