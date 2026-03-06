namespace LibraryFlow.Domain.Entities;

public class Reservation : BaseAuditableEntity
{
    public DateTime ReservedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public ReservationStatus Status { get; set; } = ReservationStatus.Pending;

    public int BookId { get; set; }
    public Book Book { get; set; } = null!;

    public int MemberId { get; set; }
    public Member Member { get; set; } = null!;

    public void Expire()
    {
        Status = ReservationStatus.Expired;
        AddDomainEvent(new ReservationExpiredEvent(this));
    }
}
