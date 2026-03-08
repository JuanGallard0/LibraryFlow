using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Security;
using LibraryFlow.Application.Loans.Queries.GetLoans;

namespace LibraryFlow.Application.Loans.Queries.GetUserLoans;

[Authorize]
public record GetUserLoansQuery(string UserId) : IRequest<List<LoanDto>>;

public class GetUserLoansQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetUserLoansQuery, List<LoanDto>>
{
    public async Task<List<LoanDto>> Handle(GetUserLoansQuery request, CancellationToken cancellationToken)
    {
        return await context.Loans
            .Include(l => l.Member)
            .Include(l => l.BookCopy)
                .ThenInclude(c => c.Book)
            .Where(l => l.Member.UserId == request.UserId)
            .OrderByDescending(l => l.BorrowedAt)
            .ProjectTo<LoanDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
