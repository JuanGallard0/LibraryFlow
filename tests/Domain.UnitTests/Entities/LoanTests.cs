using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;
using LibraryFlow.Domain.Events;
using NUnit.Framework;
using Shouldly;

namespace LibraryFlow.Domain.UnitTests.Entities;

public class LoanTests
{
    private Loan BuildActiveLoan()
    {
        var copy = new BookCopy { Id = 1, IsAvailable = false };
        return new Loan
        {
            BookCopy = copy,
            BookCopyId = copy.Id,
            MemberId = 1,
            BorrowedAt = DateTime.UtcNow.AddDays(-7),
            DueAt = DateTime.UtcNow.AddDays(7),
            Status = LoanStatus.Active,
        };
    }

    [Test]
    public void Return_SetsReturnedAtToProvidedTime()
    {
        var loan = BuildActiveLoan();
        var returnTime = DateTime.UtcNow;

        loan.Return(returnTime);

        loan.ReturnedAt.ShouldBe(returnTime);
    }

    [Test]
    public void Return_SetsStatusToReturned()
    {
        var loan = BuildActiveLoan();

        loan.Return(DateTime.UtcNow);

        loan.Status.ShouldBe(LoanStatus.Returned);
    }

    [Test]
    public void Return_MakesBookCopyAvailable()
    {
        var loan = BuildActiveLoan();

        loan.Return(DateTime.UtcNow);

        loan.BookCopy.IsAvailable.ShouldBeTrue();
    }

    [Test]
    public void Return_RaisesLoanReturnedEvent()
    {
        var loan = BuildActiveLoan();

        loan.Return(DateTime.UtcNow);

        loan.DomainEvents.ShouldContain(e => e is LoanReturnedEvent);
    }

    [Test]
    public void MarkOverdue_SetsStatusToOverdue()
    {
        var loan = BuildActiveLoan();

        loan.MarkOverdue();

        loan.Status.ShouldBe(LoanStatus.Overdue);
    }

    [Test]
    public void DefaultStatus_IsActive()
    {
        var loan = new Loan();

        loan.Status.ShouldBe(LoanStatus.Active);
    }
}
