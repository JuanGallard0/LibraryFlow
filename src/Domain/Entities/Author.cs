namespace LibraryFlow.Domain.Entities;

public class Author : BaseAuditableEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Bio { get; set; }

    public IList<Book> Books { get; private set; } = new List<Book>();
}
