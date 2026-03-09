using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Security;
using LibraryFlow.Domain.Entities;

namespace LibraryFlow.Application.BookCopies.Queries.GetBookCopies;

[Authorize]
public record GetBookCopiesQuery(int BookId) : IRequest<List<BookCopyDto>>;

public class GetBookCopiesQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetBookCopiesQuery, List<BookCopyDto>>
{
    public async Task<List<BookCopyDto>> Handle(GetBookCopiesQuery request, CancellationToken cancellationToken)
    {
        _ = await context.Books.FindAsync([request.BookId], cancellationToken)
            ?? throw new NotFoundException(nameof(Book), request.BookId.ToString());

        return await context.BookCopies
            .Where(c => c.BookId == request.BookId)
            .OrderBy(c => c.CopyNumber)
            .ProjectTo<BookCopyDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
