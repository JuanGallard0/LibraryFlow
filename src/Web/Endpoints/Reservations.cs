using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Models;
using LibraryFlow.Application.Reservations.Commands.ReserveBook;
using LibraryFlow.Application.Reservations.Queries.GetAllReservations;
using LibraryFlow.Application.Reservations.Queries.GetUserReservations;
using LibraryFlow.Domain.Constants;
using LibraryFlow.Domain.Enums;
using Microsoft.AspNetCore.Http.HttpResults;

namespace LibraryFlow.Web.Endpoints;

public class Reservations : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetUserReservations, "me").RequireAuthorization();
        groupBuilder.MapGet(GetAllReservations, "all").RequireAuthorization(p => p.RequireRole(Roles.Administrator));
        groupBuilder.MapPost(ReserveBook).RequireAuthorization();
    }

    [EndpointName(nameof(GetUserReservations))]
    [EndpointSummary("Get my reservations")]
    [EndpointDescription("Returns paginated reservations for the authenticated member. Optionally filter by status.")]
    public async Task<Ok<PaginatedList<ReservationDto>>> GetUserReservations(ISender sender, IUser currentUser, ReservationStatus? status, int? pageNumber, int? pageSize)
    {
        var reservations = await sender.Send(new GetUserReservationsQuery
        {
            UserId = currentUser.Id!,
            Status = status,
            PageNumber = pageNumber,
            PageSize = pageSize
        });

        return TypedResults.Ok(reservations);
    }

    [EndpointName(nameof(GetAllReservations))]
    [EndpointSummary("Get all reservations")]
    [EndpointDescription("Returns paginated reservations across all members. Optionally filter by status or search by book title/ISBN. Requires Administrator role.")]
    public async Task<Ok<PaginatedList<ReservationDto>>> GetAllReservations(ISender sender, [AsParameters] GetAllReservationsQuery query)
    {
        var reservations = await sender.Send(query);

        return TypedResults.Ok(reservations);
    }

    [EndpointName(nameof(ReserveBook))]
    [EndpointSummary("Reserve a book")]
    [EndpointDescription("Reserves an available copy of the specified book for the authenticated member. Handles concurrent requests safely.")]
    public async Task<Created<int>> ReserveBook(ISender sender, ReserveBookCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/api/Reservations/{id}", id);
    }
}
