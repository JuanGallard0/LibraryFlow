using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Security;

namespace LibraryFlow.Application.Authors.Queries.GetAuthors;

[Authorize]
public record GetAuthorsQuery : IRequest<List<AuthorDto>>
{
    public string? Search { get; init; }
}

public class GetAuthorsQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetAuthorsQuery, List<AuthorDto>>
{
    public async Task<List<AuthorDto>> Handle(GetAuthorsQuery request, CancellationToken cancellationToken)
    {
        return await context.Authors
            .Include(a => a.Books)
            .Where(a => string.IsNullOrEmpty(request.Search) ||
                        a.FirstName.Contains(request.Search) ||
                        a.LastName.Contains(request.Search))
            .OrderBy(a => a.LastName)
            .ThenBy(a => a.FirstName)
            .ProjectTo<AuthorDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
