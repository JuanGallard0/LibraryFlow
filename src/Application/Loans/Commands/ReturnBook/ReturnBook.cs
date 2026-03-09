using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Security;
using LibraryFlow.Domain.Constants;
using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;
using ValidationException = LibraryFlow.Application.Common.Exceptions.ValidationException;
using ValidationFailure = FluentValidation.Results.ValidationFailure;

namespace LibraryFlow.Application.Loans.Commands.ReturnBook;

[Authorize(Roles = Roles.Administrator)]
public record ReturnBookCommand(int LoanId) : IRequest;

public class ReturnBookCommandHandler(IApplicationDbContext context) : IRequestHandler<ReturnBookCommand>
{
    public async Task Handle(ReturnBookCommand request, CancellationToken cancellationToken)
    {
        var loan = await context.Loans
            .Include(l => l.BookCopy)
            .FirstOrDefaultAsync(l => l.Id == request.LoanId, cancellationToken)
            ?? throw new NotFoundException(nameof(Loan), request.LoanId.ToString());

        if (loan.Status != LoanStatus.Active && loan.Status != LoanStatus.Overdue)
            throw new ValidationException([new ValidationFailure("LoanId", "Loan is not in an active or overdue state.")]);

        loan.Return(DateTime.UtcNow);

        await context.SaveChangesAsync(cancellationToken);
    }
}
