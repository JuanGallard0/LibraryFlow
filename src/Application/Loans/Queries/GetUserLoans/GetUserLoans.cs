using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Mappings;
using LibraryFlow.Application.Common.Models;
using LibraryFlow.Application.Common.Security;
using LibraryFlow.Application.Loans.Queries.GetLoans;
using LibraryFlow.Domain.Enums;

namespace LibraryFlow.Application.Loans.Queries.GetUserLoans;

public record GetUserLoansQuery : IRequest<PaginatedList<LoanDto>>
{
    public string UserId { get; init; } = string.Empty;
    public LoanStatus? Status { get; init; }
    public int? PageNumber { get; init; }
    public int? PageSize { get; init; }
}

public class GetUserLoansQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetUserLoansQuery, PaginatedList<LoanDto>>
{
    public async Task<PaginatedList<LoanDto>> Handle(GetUserLoansQuery request, CancellationToken cancellationToken)
    {
        return await context.Loans
            .Include(l => l.Member)
            .Include(l => l.BookCopy)
                .ThenInclude(c => c.Book)
            .Where(l => l.Member.UserId == request.UserId)
            .Where(l => request.Status == null || l.Status == request.Status)
            .OrderByDescending(l => l.BorrowedAt)
            .ProjectTo<LoanDto>(mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber ?? 1, request.PageSize ?? 10, cancellationToken);
    }
}
