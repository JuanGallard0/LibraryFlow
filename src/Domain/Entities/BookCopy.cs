namespace LibraryFlow.Domain.Entities;

public class BookCopy : BaseAuditableEntity
{
    public string CopyNumber { get; set; } = string.Empty;
    public CopyCondition Condition { get; set; } = CopyCondition.Good;
    public bool IsAvailable { get; set; } = true;

    public int BookId { get; set; }
    public Book Book { get; set; } = null!;

    public IList<Loan> Loans { get; private set; } = new List<Loan>();
}
