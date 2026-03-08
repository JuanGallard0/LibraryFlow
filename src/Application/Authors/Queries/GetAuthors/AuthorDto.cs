using LibraryFlow.Domain.Entities;

namespace LibraryFlow.Application.Authors.Queries.GetAuthors;

public class AuthorDto
{
    public int Id { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string? Bio { get; init; }
    public int BookCount { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Author, AuthorDto>()
                .ForMember(d => d.BookCount, o => o.MapFrom(s => s.Books.Count));
        }
    }
}
