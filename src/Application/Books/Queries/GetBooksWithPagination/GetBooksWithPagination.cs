using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Mappings;
using LibraryFlow.Application.Common.Models;

namespace LibraryFlow.Application.Books.Queries.GetBooksWithPagination;

public record GetBooksWithPaginationQuery : IRequest<PaginatedList<BookDto>>
{
    public string? Search { get; init; }
    public string? Genre { get; init; }
    public int? PageNumber { get; init; }
    public int? PageSize { get; init; }
}

public class GetBooksWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetBooksWithPaginationQuery, PaginatedList<BookDto>>
{
    public async Task<PaginatedList<BookDto>> Handle(GetBooksWithPaginationQuery request, CancellationToken cancellationToken)
    {
        return await context.Books
            .Include(b => b.Author)
            .Include(b => b.Copies)
            .Where(b => string.IsNullOrEmpty(request.Search) ||
                        b.Title.Contains(request.Search) ||
                        b.ISBN.Contains(request.Search) ||
                        (b.Author.FirstName + " " + b.Author.LastName).Contains(request.Search))
            .Where(b => string.IsNullOrEmpty(request.Genre) || b.Genre == request.Genre)
            .OrderBy(b => b.Title)
            .ProjectTo<BookDto>(mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber ?? 1, request.PageSize ?? 10, cancellationToken);
    }
}
