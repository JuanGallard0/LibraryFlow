using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;
using LibraryFlow.Domain.Events;
using NUnit.Framework;
using Shouldly;

namespace LibraryFlow.Domain.UnitTests.Entities;

public class ReservationTests
{
    private static Reservation BuildPendingReservation() => new()
    {
        BookId = 1,
        MemberId = 1,
        BookCopyId = 1,
        ReservedAt = DateTime.UtcNow,
        ExpiresAt = DateTime.UtcNow.AddDays(7),
        Status = ReservationStatus.Pending,
    };

    [Test]
    public void DefaultStatus_IsPending()
    {
        var reservation = new Reservation();

        reservation.Status.ShouldBe(ReservationStatus.Pending);
    }

    [Test]
    public void Expire_SetsStatusToExpired()
    {
        var reservation = BuildPendingReservation();

        reservation.Expire();

        reservation.Status.ShouldBe(ReservationStatus.Expired);
    }

    [Test]
    public void Expire_RaisesReservationExpiredEvent()
    {
        var reservation = BuildPendingReservation();

        reservation.Expire();

        reservation.DomainEvents.ShouldContain(e => e is ReservationExpiredEvent);
    }
}
