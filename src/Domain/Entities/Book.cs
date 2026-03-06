namespace LibraryFlow.Domain.Entities;

public class Book : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public string? Genre { get; set; }
    public int PublishedYear { get; set; }

    public int AuthorId { get; set; }
    public Author Author { get; set; } = null!;

    public IList<BookCopy> Copies { get; private set; } = new List<BookCopy>();
    public IList<Reservation> Reservations { get; private set; } = new List<Reservation>();
}
