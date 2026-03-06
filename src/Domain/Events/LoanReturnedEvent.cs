namespace LibraryFlow.Domain.Events;

public class LoanReturnedEvent : BaseEvent
{
    public LoanReturnedEvent(Loan loan)
    {
        Loan = loan;
    }

    public Loan Loan { get; }
}
