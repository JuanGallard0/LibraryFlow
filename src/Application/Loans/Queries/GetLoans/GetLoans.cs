using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Security;
using LibraryFlow.Domain.Constants;
using LibraryFlow.Domain.Enums;

namespace LibraryFlow.Application.Loans.Queries.GetLoans;

[Authorize(Roles = Roles.Administrator)]
public record GetLoansQuery : IRequest<List<LoanDto>>
{
    public int? MemberId { get; init; }
    public LoanStatus? Status { get; init; }
}

public class GetLoansQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetLoansQuery, List<LoanDto>>
{
    public async Task<List<LoanDto>> Handle(GetLoansQuery request, CancellationToken cancellationToken)
    {
        return await context.Loans
            .Include(l => l.Member)
            .Include(l => l.BookCopy)
                .ThenInclude(c => c.Book)
            .Where(l => request.MemberId == null || l.MemberId == request.MemberId)
            .Where(l => request.Status == null || l.Status == request.Status)
            .OrderByDescending(l => l.BorrowedAt)
            .ProjectTo<LoanDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
