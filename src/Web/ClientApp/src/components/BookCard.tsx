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
      className="border border-gray-200 rounded p-4 flex flex-col gap-2 cursor-pointer hover:border-blue-400 hover:shadow-sm transition-shadow"
    >
      <div>
        <h2 className="font-semibold text-lg">{book.title}</h2>
        <p className="text-sm text-gray-600">{book.authorName}</p>
      </div>
      <div className="text-sm text-gray-500 flex gap-4">
        {book.genre && <span>{book.genre}</span>}
        {book.publishedYear && <span>{book.publishedYear}</span>}
      </div>
      <p className="text-sm mt-auto">
        {available ? (
          <span className="text-green-600">{book.availableCopies} of {book.totalCopies} available</span>
        ) : (
          <span className="text-red-500">No copies available</span>
        )}
      </p>
    </div>
  );
}
