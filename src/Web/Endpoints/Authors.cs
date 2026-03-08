using LibraryFlow.Application.Authors.Queries.GetAuthors;
using Microsoft.AspNetCore.Http.HttpResults;

namespace LibraryFlow.Web.Endpoints;

public class Authors : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetAuthors).RequireAuthorization();
    }

    [EndpointName(nameof(GetAuthors))]
    [EndpointSummary("Get all authors")]
    [EndpointDescription("Retrieves all authors. Optionally filter by name.")]
    public async Task<Ok<List<AuthorDto>>> GetAuthors(ISender sender, [AsParameters] GetAuthorsQuery query)
    {
        var result = await sender.Send(query);

        return TypedResults.Ok(result);
    }
}
