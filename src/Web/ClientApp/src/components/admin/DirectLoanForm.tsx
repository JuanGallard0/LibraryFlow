import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoansClient, CreateLoanCommand } from "../../web-api-client.ts";

const loansClient = new LoansClient();

export function DirectLoanForm() {
  const navigate = useNavigate();
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await loansClient.createLoan(
        new CreateLoanCommand({
          bookId: parseInt(bookId, 10),
          memberId: parseInt(memberId, 10),
        })
      );
      navigate("/admin/loans");
    } catch {
      setError("Failed to create loan. Verify the book has available copies and the member exists.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm space-y-4">
      <div>
        <label htmlFor="bookId" className="block text-sm font-medium text-gray-700 mb-1">
          Book ID
        </label>
        <input
          type="number"
          id="bookId"
          min={1}
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter book ID"
          required
        />
      </div>

      <div>
        <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 mb-1">
          Member ID
        </label>
        <input
          type="number"
          id="memberId"
          min={1}
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter member ID"
          required
        />
      </div>

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
