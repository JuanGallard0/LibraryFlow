using Ardalis.GuardClauses;
using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Security;

namespace LibraryFlow.Application.Reservations.Commands.ReserveBook;

[Authorize]
public record ReserveBookCommand(int BookId) : IRequest<int>;

public class ReserveBookCommandHandler(IApplicationDbContext context, IUser currentUser, IReservationService reservationService)
    : IRequestHandler<ReserveBookCommand, int>
{
    public async Task<int> Handle(ReserveBookCommand request, CancellationToken cancellationToken)
    {
        var member = await context.Members
            .FirstOrDefaultAsync(m => m.UserId == currentUser.Id, cancellationToken)
            ?? throw new NotFoundException("Member", currentUser.Id ?? "unknown");

        return await reservationService.ReserveBookAsync(request.BookId, member.Id, cancellationToken);
    }
}
