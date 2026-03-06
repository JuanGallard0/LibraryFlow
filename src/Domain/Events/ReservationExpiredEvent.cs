namespace LibraryFlow.Domain.Events;

public class ReservationExpiredEvent : BaseEvent
{
    public ReservationExpiredEvent(Reservation reservation)
    {
        Reservation = reservation;
    }

    public Reservation Reservation { get; }
}
