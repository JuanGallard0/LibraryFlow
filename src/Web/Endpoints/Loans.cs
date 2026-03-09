using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Models;
using LibraryFlow.Application.Loans.Commands.CreateLoan;
using LibraryFlow.Application.Loans.Commands.ReturnBook;
using LibraryFlow.Application.Loans.Queries.GetLoans;
using LibraryFlow.Application.Loans.Queries.GetUserLoans;
using LibraryFlow.Domain.Constants;
using LibraryFlow.Domain.Enums;
using Microsoft.AspNetCore.Http.HttpResults;

namespace LibraryFlow.Web.Endpoints;

public class Loans : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetLoans).RequireAuthorization(p => p.RequireRole(Roles.Administrator));
        groupBuilder.MapGet(GetMyLoans, "me").RequireAuthorization();
        groupBuilder.MapPost(CreateLoan).RequireAuthorization(p => p.RequireRole(Roles.Administrator));
        groupBuilder.MapPost(ReturnBook, "{id}/return").RequireAuthorization(p => p.RequireRole(Roles.Administrator));
    }

    [EndpointName(nameof(GetLoans))]
    [EndpointSummary("Get all loans")]
    [EndpointDescription("Retrieves all loans. Optionally filter by member, status, or search by book title/member name. Requires Administrator role.")]
    public async Task<Ok<PaginatedList<LoanDto>>> GetLoans(ISender sender, [AsParameters] GetLoansQuery query)
    {
        var result = await sender.Send(query);

        return TypedResults.Ok(result);
    }

    [EndpointName(nameof(GetMyLoans))]
    [EndpointSummary("Get my loans")]
    [EndpointDescription("Returns paginated loans for the authenticated member. Optionally filter by status.")]
    public async Task<Ok<PaginatedList<LoanDto>>> GetMyLoans(ISender sender, IUser currentUser, LoanStatus? status, int? pageNumber, int? pageSize)
    {
        var result = await sender.Send(new GetUserLoansQuery
        {
            UserId = currentUser.Id!,
            Status = status,
            PageNumber = pageNumber,
            PageSize = pageSize
        });

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

    [EndpointName(nameof(ReturnBook))]
    [EndpointSummary("Return a book")]
    [EndpointDescription("Marks a loan as returned and makes the book copy available again. Requires Administrator role.")]
    public async Task<NoContent> ReturnBook(ISender sender, int id)
    {
        await sender.Send(new ReturnBookCommand(id));

        return TypedResults.NoContent();
    }
}
