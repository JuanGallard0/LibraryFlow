using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Security;
using LibraryFlow.Application.Reservations.Queries.GetUserReservations;
using LibraryFlow.Domain.Constants;

namespace LibraryFlow.Application.Reservations.Queries.GetAllReservations;

[Authorize(Roles = Roles.Administrator)]
public record GetAllReservationsQuery : IRequest<List<ReservationDto>>;

public class GetAllReservationsQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetAllReservationsQuery, List<ReservationDto>>
{
    public async Task<List<ReservationDto>> Handle(GetAllReservationsQuery request, CancellationToken cancellationToken)
    {
        return await context.Reservations
            .Include(r => r.Book)
            .Include(r => r.Member)
            .OrderByDescending(r => r.ReservedAt)
            .ProjectTo<ReservationDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
