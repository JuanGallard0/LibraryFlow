using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;

namespace LibraryFlow.Application.BookCopies.Queries.GetBookCopies;

public class BookCopyDto
{
    public int Id { get; init; }
    public string CopyNumber { get; init; } = string.Empty;
    public CopyCondition Condition { get; init; }
    public bool IsAvailable { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<BookCopy, BookCopyDto>();
        }
    }
}
