using System.Data;
using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;
using LibraryFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using ValidationException = LibraryFlow.Application.Common.Exceptions.ValidationException;
using ValidationFailure = FluentValidation.Results.ValidationFailure;

namespace LibraryFlow.Infrastructure.Reservations;

public class ReservationService : IReservationService
{
    private readonly ApplicationDbContext _context;

    public ReservationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> ReserveBookAsync(int bookId, int memberId, CancellationToken cancellationToken)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.Serializable, cancellationToken);

        var bookExists = await _context.Books.AnyAsync(b => b.Id == bookId, cancellationToken);
        if (!bookExists)
            throw new NotFoundException(nameof(Book), $"Book with id {bookId} was not found.");

        var alreadyReserved = await _context.Reservations
            .AnyAsync(r => r.BookId == bookId && r.MemberId == memberId && r.Status == ReservationStatus.Pending, cancellationToken);

        if (alreadyReserved)
            throw new ValidationException([new ValidationFailure("BookId", "You already have a pending reservation for this book.")]);

        var copy = await _context.BookCopies
            .FirstOrDefaultAsync(c => c.BookId == bookId && c.IsAvailable, cancellationToken)
            ?? throw new ValidationException([new ValidationFailure("BookId", "No available copies for this book.")]);

        copy.IsAvailable = false;

        var reservation = new Reservation
        {
            BookId = bookId,
            MemberId = memberId,
            BookCopyId = copy.Id,
            ReservedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            Status = ReservationStatus.Pending,
        };

        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return reservation.Id;
    }
}
