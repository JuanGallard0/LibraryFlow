using Ardalis.GuardClauses;
using LibraryFlow.Application.Common.Interfaces;

namespace LibraryFlow.Application.Reservations.Commands.ReserveBook;

public record ReserveBookCommand(int BookId) : IRequest<int>;

public class ReserveBookCommandHandler : IRequestHandler<ReserveBookCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IUser _currentUser;
    private readonly IReservationService _reservationService;

    public ReserveBookCommandHandler(IApplicationDbContext context, IUser currentUser, IReservationService reservationService)
    {
        _context = context;
        _currentUser = currentUser;
        _reservationService = reservationService;
    }

    public async Task<int> Handle(ReserveBookCommand request, CancellationToken cancellationToken)
    {
        var member = await _context.Members
            .FirstOrDefaultAsync(m => m.UserId == _currentUser.Id, cancellationToken)
            ?? throw new NotFoundException("Member", _currentUser.Id ?? "unknown");

        return await _reservationService.ReserveBookAsync(request.BookId, member.Id, cancellationToken);
    }
}
