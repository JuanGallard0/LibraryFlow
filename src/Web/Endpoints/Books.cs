using LibraryFlow.Application.Books.Commands.CreateBook;
using LibraryFlow.Application.Books.Queries.GetBooksWithPagination;
using LibraryFlow.Application.Common.Models;
using LibraryFlow.Domain.Constants;
using Microsoft.AspNetCore.Http.HttpResults;

namespace LibraryFlow.Web.Endpoints;

public class Books : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetBooksWithPagination).RequireAuthorization();
        groupBuilder.MapPost(CreateBook).RequireAuthorization(p => p.RequireRole(Roles.Administrator));
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
}
