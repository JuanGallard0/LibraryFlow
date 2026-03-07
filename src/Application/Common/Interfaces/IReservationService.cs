namespace LibraryFlow.Application.Common.Interfaces;

public interface IReservationService
{
    Task<int> ReserveBookAsync(int bookId, int memberId, CancellationToken cancellationToken);
}
