using LibraryFlow.Application.Common.Interfaces;

namespace LibraryFlow.Application.Reservations.Queries.GetUserReservations;

public record GetReservationsQuery(string? UserId = null) : IRequest<List<ReservationDto>>;

public class GetReservationsQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetReservationsQuery, List<ReservationDto>>
{
    public async Task<List<ReservationDto>> Handle(GetReservationsQuery request, CancellationToken cancellationToken)
    {
        return await context.Reservations
            .Include(r => r.Book)
            .Include(r => r.Member)
            .Where(r => request.UserId == null || r.Member.UserId == request.UserId)
            .OrderByDescending(r => r.ReservedAt)
            .ProjectTo<ReservationDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
