using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Security;
using LibraryFlow.Domain.Constants;
using LibraryFlow.Domain.Entities;

namespace LibraryFlow.Application.Books.Commands.CreateBook;

[Authorize(Roles = Roles.Administrator)]
public record CreateBookCommand : IRequest<int>
{
    public string Title { get; init; } = string.Empty;
    public string ISBN { get; init; } = string.Empty;
    public string? Genre { get; init; }
    public int PublishedYear { get; init; }
    public int AuthorId { get; init; }
}

public class CreateBookCommandHandler(IApplicationDbContext context) : IRequestHandler<CreateBookCommand, int>
{
    public async Task<int> Handle(CreateBookCommand request, CancellationToken cancellationToken)
    {
        var newBook = new Book
        {
            Title = request.Title,
            ISBN = request.ISBN,
            Genre = request.Genre,
            PublishedYear = request.PublishedYear,
            AuthorId = request.AuthorId
        };

        context.Books.Add(newBook);

        await context.SaveChangesAsync(cancellationToken);

        return newBook.Id;
    }
}
