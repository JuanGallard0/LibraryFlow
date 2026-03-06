namespace LibraryFlow.Domain.Entities;

public class Loan : BaseAuditableEntity
{
    public DateTime BorrowedAt { get; set; }
    public DateTime DueAt { get; set; }
    public DateTime? ReturnedAt { get; set; }
    public LoanStatus Status { get; set; } = LoanStatus.Active;

    public int BookCopyId { get; set; }
    public BookCopy BookCopy { get; set; } = null!;

    public int MemberId { get; set; }
    public Member Member { get; set; } = null!;

    public int? ReservationId { get; set; }
    public Reservation? Reservation { get; set; }

    public void Return(DateTime returnedAt)
    {
        ReturnedAt = returnedAt;
        Status = LoanStatus.Returned;
        BookCopy.IsAvailable = true;
        AddDomainEvent(new LoanReturnedEvent(this));
    }

    public void MarkOverdue()
    {
        Status = LoanStatus.Overdue;
    }
}
