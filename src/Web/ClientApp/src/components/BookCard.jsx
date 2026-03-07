export function BookCard({ book }) {
  const available = book.availableCopies > 0;

  return (
    <div className="border border-gray-200 rounded p-4 flex flex-col gap-2">
      <div>
        <h2 className="font-semibold text-lg">{book.title}</h2>
        <p className="text-sm text-gray-600">{book.authorName}</p>
      </div>
      <div className="text-sm text-gray-500 flex gap-4">
        {book.genre && <span>{book.genre}</span>}
        {book.publishedYear && <span>{book.publishedYear}</span>}
      </div>
      <p className="text-sm">
        {available ? (
          <span className="text-green-600">{book.availableCopies} of {book.totalCopies} available</span>
        ) : (
          <span className="text-red-500">No copies available</span>
        )}
      </p>
      <button
        disabled={!available}
        className="mt-auto px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Reserve
      </button>
    </div>
  );
}
