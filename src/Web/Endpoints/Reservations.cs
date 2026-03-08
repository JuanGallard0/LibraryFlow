using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Reservations.Commands.ReserveBook;
using LibraryFlow.Application.Reservations.Queries.GetAllReservations;
using LibraryFlow.Application.Reservations.Queries.GetUserReservations;
using LibraryFlow.Domain.Constants;
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
    [EndpointDescription("Returns all reservations for the authenticated member, ordered by most recent first.")]
    public async Task<Ok<List<ReservationDto>>> GetUserReservations(ISender sender, IUser currentUser)
    {
        var reservations = await sender.Send(new GetUserReservationsQuery(currentUser.Id!));

        return TypedResults.Ok(reservations);
    }

    [EndpointName(nameof(GetAllReservations))]
    [EndpointSummary("Get all reservations")]
    [EndpointDescription("Returns all reservations across all members, ordered by most recent first. Requires Administrator role.")]
    public async Task<Ok<List<ReservationDto>>> GetAllReservations(ISender sender)
    {
        var reservations = await sender.Send(new GetAllReservationsQuery());

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
