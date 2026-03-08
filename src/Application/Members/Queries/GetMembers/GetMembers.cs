using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Security;
using LibraryFlow.Domain.Constants;

namespace LibraryFlow.Application.Members.Queries.GetMembers;

[Authorize(Roles = Roles.Administrator)]
public record GetMembersQuery : IRequest<List<MemberDto>>
{
    public int? Id { get; init; }
    public string? Search { get; init; }
}

public class GetMembersQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetMembersQuery, List<MemberDto>>
{
    public async Task<List<MemberDto>> Handle(GetMembersQuery request, CancellationToken cancellationToken)
    {
        return await context.Members
            .Where(m => request.Id == null || m.Id == request.Id)
            .Where(m => string.IsNullOrEmpty(request.Search) ||
                        m.FirstName.Contains(request.Search) ||
                        m.LastName.Contains(request.Search) ||
                        m.Email.Contains(request.Search))
            .OrderBy(m => m.LastName)
            .ThenBy(m => m.FirstName)
            .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
