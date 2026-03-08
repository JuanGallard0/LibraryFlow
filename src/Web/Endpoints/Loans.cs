using LibraryFlow.Application.Loans.Commands.CreateLoan;
using LibraryFlow.Domain.Constants;
using Microsoft.AspNetCore.Http.HttpResults;

namespace LibraryFlow.Web.Endpoints;

public class Loans : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost(CreateLoan).RequireAuthorization(Roles.Administrator);
    }

    [EndpointName(nameof(CreateLoan))]
    [EndpointSummary("Create a loan")]
    [EndpointDescription("Creates a loan for a member. If a ReservationId is provided the reserved copy is used and the reservation is fulfilled; otherwise an available copy is assigned. Requires Administrator role.")]
    public async Task<Created<int>> CreateLoan(ISender sender, CreateLoanCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/api/Loans/{id}", id);
    }
}
