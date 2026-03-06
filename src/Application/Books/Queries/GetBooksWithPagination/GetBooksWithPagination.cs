using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Mappings;
using LibraryFlow.Application.Common.Models;

namespace LibraryFlow.Application.Books.Queries.GetBooksWithPagination;

public record GetBooksWithPaginationQuery : IRequest<PaginatedList<BookDto>>
{
    public string? Search { get; init; }
    public string? Genre { get; init; }
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
}

public class GetBooksWithPaginationQueryHandler : IRequestHandler<GetBooksWithPaginationQuery, PaginatedList<BookDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBooksWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<BookDto>> Handle(GetBooksWithPaginationQuery request, CancellationToken cancellationToken)
    {
        return await _context.Books
            .Include(b => b.Author)
            .Include(b => b.Copies)
            .Where(b => string.IsNullOrEmpty(request.Search) ||
                        b.Title.Contains(request.Search) ||
                        b.ISBN.Contains(request.Search) ||
                        (b.Author.FirstName + " " + b.Author.LastName).Contains(request.Search))
            .Where(b => string.IsNullOrEmpty(request.Genre) || b.Genre == request.Genre)
            .OrderBy(b => b.Title)
            .ProjectTo<BookDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize, cancellationToken);
    }
}
