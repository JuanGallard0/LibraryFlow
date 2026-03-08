import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookDto, BookCopyDto, BooksClient, ReservationsClient, ReserveBookCommand } from "../web-api-client.ts";
import { useAuth } from "./api-authorization/AuthContext";

const reservationsClient = new ReservationsClient();
const booksClient = new BooksClient();

const CONDITION_LABELS: Record<number, string> = {
  0: "New",
  1: "Good",
  2: "Fair",
  3: "Poor",
};

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
      .finally(() => setCopiesLoading(false));
  }, [isAdmin, book.id]);
  const available = (book.availableCopies ?? 0) > 0;

  const handleReserve = async () => {
    setReserving(true);
    setError("");
    try {
      await reservationsClient.reserveBook(new ReserveBookCommand({ bookId: book.id ?? 0 }));
      navigate("/reservations");
    } catch {
      setError("Failed to reserve the book. Please try again.");
      setReserving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; Back to catalog
      </button>

      <h1 className="text-2xl font-semibold mb-1">{book.title}</h1>
      <p className="text-gray-600 mb-4">{book.authorName}</p>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-6">
        {book.isbn && (
          <>
            <dt className="font-medium text-gray-700">ISBN</dt>
            <dd>{book.isbn}</dd>
          </>
        )}
        {book.genre && (
          <>
            <dt className="font-medium text-gray-700">Genre</dt>
            <dd>{book.genre}</dd>
          </>
        )}
        {book.publishedYear && (
          <>
            <dt className="font-medium text-gray-700">Published</dt>
            <dd>{book.publishedYear}</dd>
          </>
        )}
        <dt className="font-medium text-gray-700">Availability</dt>
        <dd>
          {available ? (
            <span className="text-green-600">{book.availableCopies} of {book.totalCopies} available</span>
          ) : (
            <span className="text-red-500">No copies available</span>
          )}
        </dd>
      </dl>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleReserve}
          disabled={!available || reserving}
          className="px-5 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {reserving ? "Reserving..." : "Reserve"}
        </button>
        {isAdmin && (
          <Link
            to={`/admin/books/${book.id}/copies/new`}
            state={{ book }}
            className="px-5 py-2 rounded border border-gray-300 hover:bg-gray-100 text-sm"
          >
            + Add Copy
          </Link>
        )}
      </div>

      {isAdmin && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Copies</h2>
          {copiesLoading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : copies.length === 0 ? (
            <p className="text-sm text-gray-500">No copies found.</p>
          ) : (
            <table className="w-full text-sm border border-gray-200 rounded overflow-hidden">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Copy #</th>
                  <th className="text-left px-4 py-2 font-medium">Condition</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {copies.map((copy) => (
                  <tr key={copy.id}>
                    <td className="px-4 py-2">{copy.copyNumber}</td>
                    <td className="px-4 py-2">{CONDITION_LABELS[copy.condition ?? -1] ?? copy.condition}</td>
                    <td className="px-4 py-2">
                      {copy.isAvailable ? (
                        <span className="text-green-600">Available</span>
                      ) : (
                        <span className="text-red-500">On loan</span>
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
