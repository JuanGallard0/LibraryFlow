import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookDto, ReservationsClient, ReserveBookCommand } from "../web-api-client.ts";

const client = new ReservationsClient();

interface BookDetailProps {
  book: BookDto;
}

export function BookDetail({ book }: BookDetailProps) {
  const navigate = useNavigate();
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState("");
  const available = (book.availableCopies ?? 0) > 0;

  const handleReserve = async () => {
    setReserving(true);
    setError("");
    try {
      await client.reserveBook(new ReserveBookCommand({ bookId: book.id ?? 0 }));
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

      <button
        onClick={handleReserve}
        disabled={!available || reserving}
        className="px-5 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {reserving ? "Reserving..." : "Reserve"}
      </button>
    </div>
  );
}
