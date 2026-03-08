import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BooksClient, BookDto } from "../web-api-client.ts";
import { BookCard } from "./BookCard";
import { useAuth } from "./api-authorization/AuthContext";

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
      .catch(() => setError("Error al cargar los libros."))
      .finally(() => setLoading(false));
  }, [query, page]);

  const handleClear = () => {
    setSearch("");
    setPage(1);
    setQuery("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Catálogo de Libros</h1>
        {isAdmin && (
          <Link
            to="/admin/books/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
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
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Buscar
        </button>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Limpiar
          </button>
        )}
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p>
          <em>Cargando...</em>
        </p>
      ) : books.length === 0 ? (
        <p className="text-gray-500">No se encontraron libros.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
