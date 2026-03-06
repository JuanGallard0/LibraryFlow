using LibraryFlow.Domain.Entities;

namespace LibraryFlow.Application.Books.Queries.GetBooksWithPagination;

public class BookDto
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string ISBN { get; init; } = string.Empty;
    public string? Genre { get; init; }
    public int PublishedYear { get; init; }
    public string AuthorName { get; init; } = string.Empty;
    public int AvailableCopies { get; init; }
    public int TotalCopies { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Book, BookDto>()
                .ForMember(d => d.AuthorName, o => o.MapFrom(s => $"{s.Author.FirstName} {s.Author.LastName}"))
                .ForMember(d => d.AvailableCopies, o => o.MapFrom(s => s.Copies.Count(c => c.IsAvailable)))
                .ForMember(d => d.TotalCopies, o => o.MapFrom(s => s.Copies.Count));
        }
    }
}
