using LibraryFlow.Application.Books.Queries.GetBooksWithPagination;
using LibraryFlow.Application.Common.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace LibraryFlow.Web.Endpoints;

public class Books : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetBooksWithPagination).RequireAuthorization();
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
}
