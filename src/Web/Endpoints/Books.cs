using LibraryFlow.Application.BookCopies.Commands.CreateBookCopy;
using LibraryFlow.Application.BookCopies.Queries.GetBookCopies;
using LibraryFlow.Application.Books.Commands.CreateBook;
using LibraryFlow.Application.Books.Queries.GetBooksWithPagination;
using LibraryFlow.Application.Common.Models;
using LibraryFlow.Domain.Constants;
using LibraryFlow.Domain.Enums;
using Microsoft.AspNetCore.Http.HttpResults;

namespace LibraryFlow.Web.Endpoints;

public class Books : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetBooksWithPagination).RequireAuthorization();
        groupBuilder.MapPost(CreateBook).RequireAuthorization(p => p.RequireRole(Roles.Administrator));
        groupBuilder.MapGet(GetBookCopies, "{bookId}/copies").RequireAuthorization();
        groupBuilder.MapPost(CreateBookCopy, "{bookId}/copies").RequireAuthorization(p => p.RequireRole(Roles.Administrator));
    }

    [EndpointName(nameof(GetBooksWithPagination))]
    [EndpointSummary("Get books with pagination")]
    [EndpointDescription("Retrieves a paginated list of books. Optionally filter by genre or author name.")]
    public async Task<Ok<PaginatedList<BookDto>>> GetBooksWithPagination(
        ISender sender,
        [AsParameters] GetBooksWithPaginationQuery query)
    {
        var result = await sender.Send(query);

        return TypedResults.Ok(result);
    }

    [EndpointName(nameof(CreateBook))]
    [EndpointSummary("Create a new book")]
    [EndpointDescription("Creates a new book. Requires Administrator role.")]
    public async Task<Created<int>> CreateBook(ISender sender, CreateBookCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/{nameof(Books)}/{id}", id);
    }

    [EndpointName(nameof(GetBookCopies))]
    [EndpointSummary("Get copies of a book")]
    [EndpointDescription("Retrieves all physical copies for a given book.")]
    public async Task<Ok<List<BookCopyDto>>> GetBookCopies(ISender sender, int bookId)
    {
        var result = await sender.Send(new GetBookCopiesQuery(bookId));

        return TypedResults.Ok(result);
    }

    [EndpointName(nameof(CreateBookCopy))]
    [EndpointSummary("Add a copy to a book")]
    [EndpointDescription("Creates a new physical copy for a book. Requires Administrator role.")]
    public async Task<Created<int>> CreateBookCopy(ISender sender, int bookId, CreateBookCopyRequest request)
    {
        var id = await sender.Send(new CreateBookCopyCommand(bookId, request.CopyNumber, request.Condition));

        return TypedResults.Created($"/api/{nameof(Books)}/{bookId}/copies/{id}", id);
    }
}

public record CreateBookCopyRequest(string CopyNumber, CopyCondition Condition);
