using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;
using ValidationException = LibraryFlow.Application.Common.Exceptions.ValidationException;
using ValidationFailure = FluentValidation.Results.ValidationFailure;

namespace LibraryFlow.Application.Loans.Commands.CreateLoan;

public record CreateLoanCommand(int BookId, int MemberId, int? ReservationId = null) : IRequest<int>;

public class CreateLoanCommandHandler(IApplicationDbContext context) : IRequestHandler<CreateLoanCommand, int>
{
    public async Task<int> Handle(CreateLoanCommand request, CancellationToken cancellationToken)
    {
        var member = await context.Members
            .FirstOrDefaultAsync(m => m.Id == request.MemberId, cancellationToken)
            ?? throw new NotFoundException(nameof(Member), request.MemberId.ToString());

        BookCopy copy;

        if (request.ReservationId.HasValue)
        {
            var reservation = await context.Reservations
                .Include(r => r.BookCopy)
                .FirstOrDefaultAsync(r => r.Id == request.ReservationId && r.BookId == request.BookId && r.MemberId == request.MemberId, cancellationToken)
                ?? throw new NotFoundException(nameof(Reservation), request.ReservationId.Value.ToString());

            if (reservation.Status != ReservationStatus.Pending)
                throw new ValidationException([new ValidationFailure("ReservationId", "Reservation is not in a pending state.")]);

            reservation.Status = ReservationStatus.Fulfilled;
            copy = reservation.BookCopy;
        }
        else
        {
            copy = await context.BookCopies
                .FirstOrDefaultAsync(c => c.BookId == request.BookId && c.IsAvailable, cancellationToken)
                ?? throw new ValidationException([new ValidationFailure("BookId", "No available copies for this book.")]);

            copy.IsAvailable = false;
        }

        var loan = new Loan
        {
            BookCopyId = copy.Id,
            MemberId = request.MemberId,
            ReservationId = request.ReservationId,
            BorrowedAt = DateTime.UtcNow,
            DueAt = DateTime.UtcNow.AddDays(14),
            Status = LoanStatus.Active,
        };

        context.Loans.Add(loan);
        await context.SaveChangesAsync(cancellationToken);

        return loan.Id;
    }
}
