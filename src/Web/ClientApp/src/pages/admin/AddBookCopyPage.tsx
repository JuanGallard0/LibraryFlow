import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { BooksClient, BookDto, CreateBookCopyRequest } from "../../web-api-client.ts";

const booksClient = new BooksClient();

interface LocationState {
  book: BookDto;
}

export function AddBookCopyPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const book = (state as LocationState)?.book;
  const bookId = parseInt(id!, 10);

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
    } catch {
      setError("Failed to add copy. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Add Book Copy</h1>
      {book && <p className="text-gray-600 mb-6">{book.title}</p>}
      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
        <div>
          <label htmlFor="copyNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Copy Number
          </label>
          <input
            type="text"
            id="copyNumber"
            value={copyNumber}
            onChange={(e) => setCopyNumber(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {submitting ? "Adding..." : "Add Copy"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
