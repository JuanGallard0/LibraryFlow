import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BooksClient, AuthorsClient, CreateBookCommand } from "../../web-api-client.ts";
import { SearchSelect } from "../../components/SearchSelect";

const booksClient = new BooksClient();
const authorsClient = new AuthorsClient();

export function CreateBookPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [genre, setGenre] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [authorId, setAuthorId] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await booksClient.createBook(
        new CreateBookCommand({
          title,
          isbn,
          genre: genre || undefined,
          publishedYear: publishedYear ? parseInt(publishedYear, 10) : undefined,
          authorId,
        })
      );
      navigate("/");
    } catch {
      setError("Failed to create book. Please check the details and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Add New Book</h1>
      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
            ISBN
          </label>
          <input
            type="text"
            id="isbn"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
            Genre <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 mb-1">
            Published Year <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="number"
            id="publishedYear"
            min={1}
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <SearchSelect
          label="Author"
          placeholder="Search by name..."
          onSearch={(q) => authorsClient.getAuthors(q)}
          getOptionLabel={(a) => `${a.firstName} ${a.lastName}`}
          getOptionValue={(a) => a.id!}
          onSelect={setAuthorId}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={!authorId || submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create Book"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
