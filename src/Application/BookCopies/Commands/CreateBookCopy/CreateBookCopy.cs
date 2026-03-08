using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Security;
using LibraryFlow.Domain.Constants;
using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;

namespace LibraryFlow.Application.BookCopies.Commands.CreateBookCopy;

[Authorize(Roles = Roles.Administrator)]
public record CreateBookCopyCommand(int BookId, string CopyNumber, CopyCondition Condition) : IRequest<int>;

public class CreateBookCopyCommandHandler(IApplicationDbContext context)
    : IRequestHandler<CreateBookCopyCommand, int>
{
    public async Task<int> Handle(CreateBookCopyCommand request, CancellationToken cancellationToken)
    {
        _ = await context.Books.FindAsync([request.BookId], cancellationToken)
            ?? throw new NotFoundException(nameof(Book), request.BookId.ToString());

        var copy = new BookCopy
        {
            BookId = request.BookId,
            CopyNumber = request.CopyNumber,
            Condition = request.Condition,
            IsAvailable = true,
        };

        context.BookCopies.Add(copy);
        await context.SaveChangesAsync(cancellationToken);

        return copy.Id;
    }
}
