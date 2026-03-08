using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Loans.Commands.CreateLoan;
using LibraryFlow.Application.Loans.Queries.GetLoans;
using LibraryFlow.Application.Loans.Queries.GetUserLoans;
using LibraryFlow.Domain.Constants;
using Microsoft.AspNetCore.Http.HttpResults;

namespace LibraryFlow.Web.Endpoints;

public class Loans : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetLoans).RequireAuthorization(p => p.RequireRole(Roles.Administrator));
        groupBuilder.MapGet(GetMyLoans, "me").RequireAuthorization();
        groupBuilder.MapPost(CreateLoan).RequireAuthorization(p => p.RequireRole(Roles.Administrator));
    }

    [EndpointName(nameof(GetLoans))]
    [EndpointSummary("Get all loans")]
    [EndpointDescription("Retrieves all loans. Optionally filter by member or status. Requires Administrator role.")]
    public async Task<Ok<List<LoanDto>>> GetLoans(ISender sender, [AsParameters] GetLoansQuery query)
    {
        var result = await sender.Send(query);

        return TypedResults.Ok(result);
    }

    [EndpointName(nameof(GetMyLoans))]
    [EndpointSummary("Get my loans")]
    [EndpointDescription("Returns all loans for the authenticated member, ordered by most recent first.")]
    public async Task<Ok<List<LoanDto>>> GetMyLoans(ISender sender, IUser currentUser)
    {
        var result = await sender.Send(new GetUserLoansQuery(currentUser.Id!));

        return TypedResults.Ok(result);
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
