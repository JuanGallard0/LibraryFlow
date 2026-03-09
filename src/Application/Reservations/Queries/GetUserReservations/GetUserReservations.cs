using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Mappings;
using LibraryFlow.Application.Common.Models;
using LibraryFlow.Application.Common.Security;
using LibraryFlow.Domain.Enums;

namespace LibraryFlow.Application.Reservations.Queries.GetUserReservations;

[Authorize]
public record GetUserReservationsQuery : IRequest<PaginatedList<ReservationDto>>
{
    public string UserId { get; init; } = string.Empty;
    public ReservationStatus? Status { get; init; }
    public int? PageNumber { get; init; }
    public int? PageSize { get; init; }
}

public class GetUserReservationsQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetUserReservationsQuery, PaginatedList<ReservationDto>>
{
    public async Task<PaginatedList<ReservationDto>> Handle(GetUserReservationsQuery request, CancellationToken cancellationToken)
    {
        return await context.Reservations
            .Include(r => r.Book)
            .Include(r => r.Member)
            .Where(r => r.Member.UserId == request.UserId)
            .Where(r => request.Status == null || r.Status == request.Status)
            .OrderByDescending(r => r.ReservedAt)
            .ProjectTo<ReservationDto>(mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber ?? 1, request.PageSize ?? 10, cancellationToken);
    }
}
