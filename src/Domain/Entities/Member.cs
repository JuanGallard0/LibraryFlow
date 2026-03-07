namespace LibraryFlow.Domain.Entities;

public class Member : BaseAuditableEntity
{
    public string UserId { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateOnly MemberSince { get; set; }
    public MembershipStatus Status { get; set; } = MembershipStatus.Active;

    public IList<Loan> Loans { get; private set; } = new List<Loan>();
    public IList<Reservation> Reservations { get; private set; } = new List<Reservation>();
}
