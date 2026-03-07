using LibraryFlow.Application.Members.Commands.RegisterMember;
using Microsoft.AspNetCore.Http.HttpResults;

namespace LibraryFlow.Web.Endpoints;

public class Members : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost(RegisterMember, "register");
    }

    [EndpointName(nameof(RegisterMember))]
    [EndpointSummary("Register a new member")]
    [EndpointDescription("Creates an identity user and a library member profile in one step.")]
    public async Task<Created<int>> RegisterMember(ISender sender, RegisterMemberCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/api/Members/{id}", id);
    }
}
