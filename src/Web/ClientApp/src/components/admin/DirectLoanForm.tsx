import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoansClient, BooksClient, MembersClient, CreateLoanCommand } from "../../web-api-client.ts";
import { SearchSelect } from "../SearchSelect";

const loansClient = new LoansClient();
const booksClient = new BooksClient();
const membersClient = new MembersClient();

export function DirectLoanForm() {
  const navigate = useNavigate();
  const [bookId, setBookId] = useState(0);
  const [memberId, setMemberId] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await loansClient.createLoan(new CreateLoanCommand({ bookId, memberId }));
      navigate("/admin/loans");
    } catch {
      setError("Failed to create loan. Verify the book has available copies and the member exists.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm space-y-4">
      <SearchSelect
        label="Book"
        placeholder="Search by title or author..."
        onSearch={(q) => booksClient.getBooksWithPagination(q, 1, 10).then((r) => r.items)}
        getOptionLabel={(b) => `${b.title} — ${b.authorName} (${b.availableCopies} available)`}
        getOptionValue={(b) => b.id!}
        onSelect={setBookId}
      />

      <SearchSelect
        label="Member"
        placeholder="Search by name or email..."
        onSearch={(q) => membersClient.getMembers(q)}
        getOptionLabel={(m) => `${m.firstName} ${m.lastName} — ${m.email}`}
        getOptionValue={(m) => m.id!}
        onSelect={setMemberId}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!bookId || !memberId || submitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {submitting ? "Creating loan..." : "Create Loan"}
      </button>
    </div>
  );
}
