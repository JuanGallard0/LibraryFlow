import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookDto, BookCopyDto, BooksClient, ReservationsClient, ReserveBookCommand } from "../web-api-client.ts";
import { useAuth } from "./api-authorization/AuthContext";
import { CONDITION_LABELS } from "../constants";
import { ErrorAlert } from "./ErrorAlert";

const reservationsClient = new ReservationsClient();
const booksClient = new BooksClient();

interface BookDetailProps {
  book: BookDto;
}

export function BookDetail({ book }: BookDetailProps) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState("");
  const [copies, setCopies] = useState<BookCopyDto[]>([]);
  const [copiesLoading, setCopiesLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin || !book.id) return;
    setCopiesLoading(true);
    booksClient.getBookCopies(book.id)
      .then(setCopies)
      .catch((err) => console.error('Failed to load book copies:', err))
      .finally(() => setCopiesLoading(false));
  }, [isAdmin, book.id]);

  const available = (book.availableCopies ?? 0) > 0;

  const handleReserve = async () => {
    setReserving(true);
    setError("");
    try {
      await reservationsClient.reserveBook(new ReserveBookCommand({ bookId: book.id ?? 0 }));
      navigate("/reservations");
    } catch (err) {
      console.error('Failed to reserve book:', err);
      setError("Error al reservar el libro. Por favor intenta de nuevo.");
      setReserving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <button
        onClick={() => navigate("/")}
        className="text-sm text-amber-700 hover:text-amber-900 hover:underline mb-5 inline-flex items-center gap-1"
      >
        &larr; Volver al catálogo
      </button>

      <h1 className="text-2xl font-bold text-slate-800 mb-1">{book.title}</h1>
      <p className="text-stone-500 mb-5">{book.authorName}</p>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-6 bg-white border border-stone-200 rounded-lg p-4">
        {book.isbn && (
          <>
            <dt className="font-medium text-slate-700">ISBN</dt>
            <dd className="text-stone-600">{book.isbn}</dd>
          </>
        )}
        {book.genre && (
          <>
            <dt className="font-medium text-slate-700">Género</dt>
            <dd className="text-stone-600">{book.genre}</dd>
          </>
        )}
        {book.publishedYear && (
          <>
            <dt className="font-medium text-slate-700">Publicado</dt>
            <dd className="text-stone-600">{book.publishedYear}</dd>
          </>
        )}
        <dt className="font-medium text-slate-700">Disponibilidad</dt>
        <dd>
          {available ? (
            <span className="text-emerald-700 font-medium">{book.availableCopies} de {book.totalCopies} disponibles</span>
          ) : (
            <span className="text-red-500">Sin ejemplares disponibles</span>
          )}
        </dd>
      </dl>

      {error && <ErrorAlert message={error} className="mb-4" />}

      <div className="flex items-center gap-3">
        <button
          onClick={handleReserve}
          disabled={!available || reserving}
          className="px-5 py-2 rounded-md text-white bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {reserving ? "Reservando..." : "Reservar"}
        </button>
        {isAdmin && (
          <Link
            to={`/admin/books/${book.id}/copies/new`}
            state={{ book }}
            className="px-5 py-2 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm transition-colors"
          >
            + Agregar Ejemplar
          </Link>
        )}
      </div>

      {isAdmin && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Ejemplares</h2>
          {copiesLoading ? (
            <p className="text-sm text-stone-500">Cargando...</p>
          ) : copies.length === 0 ? (
            <p className="text-sm text-stone-500">No se encontraron ejemplares.</p>
          ) : (
            <table className="w-full text-sm border border-stone-200 rounded-lg overflow-hidden">
              <thead className="bg-stone-100 text-slate-700">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Nº Ejemplar</th>
                  <th className="text-left px-4 py-2 font-medium">Estado</th>
                  <th className="text-left px-4 py-2 font-medium">Disponibilidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {copies.map((copy) => (
                  <tr key={copy.id} className="bg-white">
                    <td className="px-4 py-2 text-stone-700">{copy.copyNumber}</td>
                    <td className="px-4 py-2 text-stone-700">{CONDITION_LABELS[copy.condition ?? -1] ?? copy.condition}</td>
                    <td className="px-4 py-2">
                      {copy.isAvailable ? (
                        <span className="text-emerald-700 font-medium">Disponible</span>
                      ) : (
                        <span className="text-red-500">En préstamo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
