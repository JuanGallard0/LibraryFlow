using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Security;

namespace LibraryFlow.Application.Reservations.Queries.GetUserReservations;

[Authorize]
public record GetUserReservationsQuery(string UserId) : IRequest<List<ReservationDto>>;

public class GetUserReservationsQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetUserReservationsQuery, List<ReservationDto>>
{
    public async Task<List<ReservationDto>> Handle(GetUserReservationsQuery request, CancellationToken cancellationToken)
    {
        return await context.Reservations
            .Include(r => r.Book)
            .Include(r => r.Member)
            .Where(r => r.Member.UserId == request.UserId)
            .OrderByDescending(r => r.ReservedAt)
            .ProjectTo<ReservationDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
