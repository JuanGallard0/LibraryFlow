using LibraryFlow.Application.Common.Exceptions;
using LibraryFlow.Application.Common.Security;
using LibraryFlow.Application.Loans.Commands.ReturnBook;
using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;

namespace LibraryFlow.Application.FunctionalTests.Loans.Commands;

using static Testing;

public class ReturnBookTests : BaseTestFixture
{
    [Test]
    public async Task ShouldDenyAnonymousUser()
    {
        var command = new ReturnBookCommand(1);

        command.GetType().ShouldSatisfyAllConditions(
            type => type.ShouldBeDecoratedWith<AuthorizeAttribute>()
        );

        var action = () => SendAsync(command);

        await Should.ThrowAsync<UnauthorizedAccessException>(action);
    }

    [Test]
    public async Task ShouldDenyNonAdministrator()
    {
        await RunAsDefaultUserAsync();

        var command = new ReturnBookCommand(1);

        var action = () => SendAsync(command);

        await Should.ThrowAsync<ForbiddenAccessException>(action);
    }

    [Test]
    public async Task ShouldThrowNotFoundException_WhenLoanDoesNotExist()
    {
        await RunAsAdministratorAsync();

        var action = () => SendAsync(new ReturnBookCommand(999999));

        await Should.ThrowAsync<NotFoundException>(action);
    }

    [Test]
    public async Task ShouldThrowValidationException_WhenLoanAlreadyReturned()
    {
        await RunAsAdministratorAsync();

        var (_, loan) = await SeedLoanAsync(LoanStatus.Returned);

        var action = () => SendAsync(new ReturnBookCommand(loan.Id));

        await Should.ThrowAsync<ValidationException>(action);
    }

    [Test]
    public async Task ShouldReturnLoan_WhenActive()
    {
        await RunAsAdministratorAsync();

        var (copy, loan) = await SeedLoanAsync(LoanStatus.Active);

        await SendAsync(new ReturnBookCommand(loan.Id));

        var updatedLoan = await FindAsync<Loan>(loan.Id);
        updatedLoan.ShouldNotBeNull();
        updatedLoan!.Status.ShouldBe(LoanStatus.Returned);
        updatedLoan.ReturnedAt.ShouldNotBeNull();

        var updatedCopy = await FindAsync<BookCopy>(copy.Id);
        updatedCopy!.IsAvailable.ShouldBeTrue();
    }

    [Test]
    public async Task ShouldReturnLoan_WhenOverdue()
    {
        await RunAsAdministratorAsync();

        var (_, loan) = await SeedLoanAsync(LoanStatus.Overdue);

        await SendAsync(new ReturnBookCommand(loan.Id));

        var updatedLoan = await FindAsync<Loan>(loan.Id);
        updatedLoan!.Status.ShouldBe(LoanStatus.Returned);
        updatedLoan.ReturnedAt.ShouldNotBeNull();
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private static async Task<(BookCopy copy, Loan loan)> SeedLoanAsync(LoanStatus status)
    {
        var author = new Author { FirstName = "Test", LastName = "Author" };
        await AddAsync(author);

        var book = new Book
        {
            Title = "Test Book",
            ISBN = $"ISBN-{Guid.NewGuid().ToString()[..8]}",
            PublishedYear = 2020,
            AuthorId = author.Id
        };
        await AddAsync(book);

        var copy = new BookCopy
        {
            BookId = book.Id,
            CopyNumber = $"COPY-{Guid.NewGuid().ToString()[..8]}",
            Condition = CopyCondition.Good,
            IsAvailable = false
        };
        await AddAsync(copy);

        var member = new Member
        {
            UserId = Guid.NewGuid().ToString(),
            FirstName = "Test",
            LastName = "Member",
            Email = $"test.{Guid.NewGuid()}@test.com",
            MemberSince = DateOnly.FromDateTime(DateTime.Today)
        };
        await AddAsync(member);

        var loan = new Loan
        {
            BookCopyId = copy.Id,
            MemberId = member.Id,
            BorrowedAt = DateTime.UtcNow.AddDays(-7),
            DueAt = DateTime.UtcNow.AddDays(7),
            Status = status,
            ReturnedAt = status == LoanStatus.Returned ? DateTime.UtcNow : null
        };
        await AddAsync(loan);

        return (copy, loan);
    }
}
