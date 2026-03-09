using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Mappings;
using LibraryFlow.Application.Common.Models;
using LibraryFlow.Application.Common.Security;
using LibraryFlow.Domain.Constants;
using LibraryFlow.Domain.Enums;

namespace LibraryFlow.Application.Loans.Queries.GetLoans;

[Authorize(Roles = Roles.Administrator)]
public record GetLoansQuery : IRequest<PaginatedList<LoanDto>>
{
    public int? MemberId { get; init; }
    public LoanStatus? Status { get; init; }
    public string? Search { get; init; }
    public int? PageNumber { get; init; }
    public int? PageSize { get; init; }
}

public class GetLoansQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetLoansQuery, PaginatedList<LoanDto>>
{
    public async Task<PaginatedList<LoanDto>> Handle(GetLoansQuery request, CancellationToken cancellationToken)
    {
        return await context.Loans
            .Include(l => l.Member)
            .Include(l => l.BookCopy)
                .ThenInclude(c => c.Book)
            .Where(l => request.MemberId == null || l.MemberId == request.MemberId)
            .Where(l => request.Status == null || l.Status == request.Status)
            .Where(l => string.IsNullOrEmpty(request.Search) ||
                        l.BookCopy.Book.Title.Contains(request.Search) ||
                        (l.Member.FirstName + " " + l.Member.LastName).Contains(request.Search))
            .OrderByDescending(l => l.BorrowedAt)
            .ProjectTo<LoanDto>(mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber ?? 1, request.PageSize ?? 10, cancellationToken);
    }
}
