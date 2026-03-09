import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BooksClient, AuthorsClient, CreateBookCommand } from "../../web-api-client.ts";
import { SearchSelect } from "../../components/SearchSelect";
import { ErrorAlert } from "../../components/ErrorAlert";

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
    } catch (err) {
      console.error('Failed to create book:', err);
      setError("Error al crear el libro. Por favor verifica los datos e intenta de nuevo.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Agregar Nuevo Libro</h1>
      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-slate-700 mb-1">
            ISBN
          </label>
          <input
            type="text"
            id="isbn"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
            className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-slate-700 mb-1">
            Género <span className="text-stone-400 font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        <div>
          <label htmlFor="publishedYear" className="block text-sm font-medium text-slate-700 mb-1">
            Año de Publicación <span className="text-stone-400 font-normal">(opcional)</span>
          </label>
          <input
            type="number"
            id="publishedYear"
            min={1}
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
            className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        <SearchSelect
          label="Autor"
          placeholder="Buscar por nombre..."
          onSearch={(q) => authorsClient.getAuthors(q)}
          getOptionLabel={(a) => `${a.firstName} ${a.lastName}`}
          getOptionValue={(a) => a.id!}
          onSelect={setAuthorId}
        />

        {error && <ErrorAlert message={error} />}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={!authorId || submitting}
            className="px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 disabled:bg-stone-300 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {submitting ? "Creando..." : "Crear Libro"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-100 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
