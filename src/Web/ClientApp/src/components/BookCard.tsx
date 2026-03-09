import { useNavigate } from "react-router-dom";
import { BookDto } from "../web-api-client.ts";

interface BookCardProps {
  book: BookDto;
}

export function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();
  const available = (book.availableCopies ?? 0) > 0;

  return (
    <div
      onClick={() => navigate(`/books/${book.id}`, { state: { book } })}
      className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col gap-3 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all"
    >
      <div>
        <h2 className="font-semibold text-lg text-slate-800 leading-snug">{book.title}</h2>
        <p className="text-sm text-stone-500 mt-0.5">{book.authorName}</p>
      </div>
      <div className="text-xs text-stone-400 flex gap-3">
        {book.genre && (
          <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{book.genre}</span>
        )}
        {book.publishedYear && <span>{book.publishedYear}</span>}
      </div>
      <p className="text-sm mt-auto">
        {available ? (
          <span className="text-emerald-700 font-medium">{book.availableCopies} de {book.totalCopies} disponibles</span>
        ) : (
          <span className="text-red-500">Sin ejemplares disponibles</span>
        )}
      </p>
    </div>
  );
}
