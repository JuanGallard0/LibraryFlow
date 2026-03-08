using LibraryFlow.Application.Members.Commands.RegisterMember;
using LibraryFlow.Application.Members.Queries.GetMembers;
using LibraryFlow.Domain.Constants;
using Microsoft.AspNetCore.Http.HttpResults;

namespace LibraryFlow.Web.Endpoints;

public class Members : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetMembers).RequireAuthorization(p => p.RequireRole(Roles.Administrator));
        groupBuilder.MapPost(RegisterMember, "register");
    }

    [EndpointName(nameof(GetMembers))]
    [EndpointSummary("Get all members")]
    [EndpointDescription("Retrieves all library members. Requires Administrator role.")]
    public async Task<Ok<List<MemberDto>>> GetMembers(ISender sender, [AsParameters] GetMembersQuery query)
    {
        var result = await sender.Send(query);

        return TypedResults.Ok(result);
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
