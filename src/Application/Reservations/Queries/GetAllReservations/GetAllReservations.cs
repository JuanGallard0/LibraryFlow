using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Mappings;
using LibraryFlow.Application.Common.Models;
using LibraryFlow.Application.Common.Security;
using LibraryFlow.Application.Reservations.Queries.GetUserReservations;
using LibraryFlow.Domain.Constants;
using LibraryFlow.Domain.Enums;

namespace LibraryFlow.Application.Reservations.Queries.GetAllReservations;

[Authorize(Roles = Roles.Administrator)]
public record GetAllReservationsQuery : IRequest<PaginatedList<ReservationDto>>
{
    public ReservationStatus? Status { get; init; }
    public string? Search { get; init; }
    public int? PageNumber { get; init; }
    public int? PageSize { get; init; }
}

public class GetAllReservationsQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetAllReservationsQuery, PaginatedList<ReservationDto>>
{
    public async Task<PaginatedList<ReservationDto>> Handle(GetAllReservationsQuery request, CancellationToken cancellationToken)
    {
        return await context.Reservations
            .Include(r => r.Book)
            .Include(r => r.Member)
            .Where(r => request.Status == null || r.Status == request.Status)
            .Where(r => string.IsNullOrEmpty(request.Search) ||
                        r.Book.Title.Contains(request.Search) ||
                        r.Book.ISBN.Contains(request.Search))
            .OrderByDescending(r => r.ReservedAt)
            .ProjectTo<ReservationDto>(mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber ?? 1, request.PageSize ?? 10, cancellationToken);
    }
}
