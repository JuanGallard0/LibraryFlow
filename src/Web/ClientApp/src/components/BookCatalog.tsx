import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BooksClient, BookDto } from "../web-api-client.ts";
import { BookCard } from "./BookCard";
import { useAuth } from "./api-authorization/AuthContext";
import { ErrorAlert } from "./ErrorAlert";

const client = new BooksClient();

const PAGE_SIZE = 9;

export function BookCatalog() {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState<BookDto[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    client
      .getBooksWithPagination(query || undefined, page, PAGE_SIZE)
      .then((data) => {
        setBooks(data.items);
        setTotalPages(data.totalPages ?? 1);
      })
      .catch((err) => {
        console.error('Failed to load books:', err);
        setError("Error al cargar los libros.");
      })
      .finally(() => setLoading(false));
  }, [query, page]);

  const handleClear = () => {
    setSearch("");
    setPage(1);
    setQuery("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-slate-800">Catálogo de Libros</h1>
        {isAdmin && (
          <Link
            to="/admin/books/new"
            className="px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 text-sm font-medium transition-colors"
          >
            + Agregar Libro
          </Link>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setQuery(search);
        }}
        className="flex gap-2 mb-6"
      >
        <input
          type="text"
          placeholder="Buscar por título o autor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 font-medium transition-colors"
        >
          Buscar
        </button>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-100 transition-colors"
          >
            Limpiar
          </button>
        )}
      </form>

      {error && <ErrorAlert message={error} className="mb-4" />}

      {loading ? (
        <p className="text-stone-500">
          <em>Cargando...</em>
        </p>
      ) : books.length === 0 ? (
        <p className="text-stone-500">No se encontraron libros.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="px-4 py-1.5 border border-stone-300 rounded-md text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <span className="text-sm text-stone-600 px-2">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="px-4 py-1.5 border border-stone-300 rounded-md text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
