using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace LibraryFlow.Infrastructure.IntegrationTests.Data;

[TestFixture]
public class ApplicationDbContextTests : IntegrationTestBase
{
    // ── Authors ──────────────────────────────────────────────────────────

    [Test]
    public async Task CanSaveAndRetrieveAuthor()
    {
        var author = new Author { FirstName = "Robert", LastName = "Martin", Bio = "Software engineer." };
        Context.Authors.Add(author);
        await Context.SaveChangesAsync();

        var retrieved = await Context.Authors.FindAsync(author.Id);

        retrieved.ShouldNotBeNull();
        retrieved!.FirstName.ShouldBe("Robert");
        retrieved.LastName.ShouldBe("Martin");
    }

    // ── Books ─────────────────────────────────────────────────────────────

    [Test]
    public async Task CanSaveAndRetrieveBook()
    {
        var author = new Author { FirstName = "Martin", LastName = "Fowler" };
        Context.Authors.Add(author);
        await Context.SaveChangesAsync();

        var book = new Book { Title = "Refactoring", ISBN = "978-0201485677", PublishedYear = 1999, AuthorId = author.Id };
        Context.Books.Add(book);
        await Context.SaveChangesAsync();

        var retrieved = await Context.Books.FindAsync(book.Id);

        retrieved.ShouldNotBeNull();
        retrieved!.Title.ShouldBe("Refactoring");
        retrieved.ISBN.ShouldBe("978-0201485677");
    }

    [Test]
    public async Task DuplicateISBN_ThrowsDbUpdateException()
    {
        var author = new Author { FirstName = "A", LastName = "B" };
        Context.Authors.Add(author);
        await Context.SaveChangesAsync();

        Context.Books.Add(new Book { Title = "Book 1", ISBN = "UNIQUE-ISBN-001", PublishedYear = 2000, AuthorId = author.Id });
        await Context.SaveChangesAsync();

        Context.Books.Add(new Book { Title = "Book 2", ISBN = "UNIQUE-ISBN-001", PublishedYear = 2001, AuthorId = author.Id });

        await Should.ThrowAsync<DbUpdateException>(() => Context.SaveChangesAsync());
    }

    // ── BookCopies ────────────────────────────────────────────────────────

    [Test]
    public async Task CanSaveAndRetrieveBookCopy()
    {
        var author = new Author { FirstName = "C", LastName = "D" };
        Context.Authors.Add(author);
        await Context.SaveChangesAsync();

        var book = new Book { Title = "Some Book", ISBN = "ISBN-COPY-001", PublishedYear = 2010, AuthorId = author.Id };
        Context.Books.Add(book);
        await Context.SaveChangesAsync();

        var copy = new BookCopy { BookId = book.Id, CopyNumber = "COPY-001", Condition = CopyCondition.Good, IsAvailable = true };
        Context.BookCopies.Add(copy);
        await Context.SaveChangesAsync();

        var retrieved = await Context.BookCopies.FindAsync(copy.Id);

        retrieved.ShouldNotBeNull();
        retrieved!.CopyNumber.ShouldBe("COPY-001");
        retrieved.IsAvailable.ShouldBeTrue();
    }

    [Test]
    public async Task DuplicateCopyNumber_ForSameBook_ThrowsDbUpdateException()
    {
        var author = new Author { FirstName = "E", LastName = "F" };
        Context.Authors.Add(author);
        await Context.SaveChangesAsync();

        var book = new Book { Title = "Dup Copy Book", ISBN = "ISBN-DUP-COPY", PublishedYear = 2010, AuthorId = author.Id };
        Context.Books.Add(book);
        await Context.SaveChangesAsync();

        Context.BookCopies.Add(new BookCopy { BookId = book.Id, CopyNumber = "COPY-DUP", Condition = CopyCondition.New });
        await Context.SaveChangesAsync();

        Context.BookCopies.Add(new BookCopy { BookId = book.Id, CopyNumber = "COPY-DUP", Condition = CopyCondition.Good });

        await Should.ThrowAsync<DbUpdateException>(() => Context.SaveChangesAsync());
    }

    // ── Members ───────────────────────────────────────────────────────────

    [Test]
    public async Task CanSaveAndRetrieveMember()
    {
        var member = new Member
        {
            UserId = Guid.NewGuid().ToString(),
            FirstName = "Jane",
            LastName = "Doe",
            Email = $"jane.doe.{Guid.NewGuid()}@test.com",
            MemberSince = DateOnly.FromDateTime(DateTime.Today),
        };
        Context.Members.Add(member);
        await Context.SaveChangesAsync();

        var retrieved = await Context.Members.FindAsync(member.Id);

        retrieved.ShouldNotBeNull();
        retrieved!.FirstName.ShouldBe("Jane");
        retrieved.Status.ShouldBe(MembershipStatus.Active);
    }

    [Test]
    public async Task DuplicateMemberEmail_ThrowsDbUpdateException()
    {
        var email = $"dup.{Guid.NewGuid()}@test.com";

        Context.Members.Add(new Member { UserId = Guid.NewGuid().ToString(), FirstName = "A", LastName = "B", Email = email, MemberSince = DateOnly.FromDateTime(DateTime.Today) });
        await Context.SaveChangesAsync();

        Context.Members.Add(new Member { UserId = Guid.NewGuid().ToString(), FirstName = "C", LastName = "D", Email = email, MemberSince = DateOnly.FromDateTime(DateTime.Today) });

        await Should.ThrowAsync<DbUpdateException>(() => Context.SaveChangesAsync());
    }

    [Test]
    public async Task DuplicateMemberUserId_ThrowsDbUpdateException()
    {
        var userId = Guid.NewGuid().ToString();

        Context.Members.Add(new Member { UserId = userId, FirstName = "A", LastName = "B", Email = $"a.{Guid.NewGuid()}@test.com", MemberSince = DateOnly.FromDateTime(DateTime.Today) });
        await Context.SaveChangesAsync();

        Context.Members.Add(new Member { UserId = userId, FirstName = "C", LastName = "D", Email = $"c.{Guid.NewGuid()}@test.com", MemberSince = DateOnly.FromDateTime(DateTime.Today) });

        await Should.ThrowAsync<DbUpdateException>(() => Context.SaveChangesAsync());
    }

    // ── Loans ─────────────────────────────────────────────────────────────

    [Test]
    public async Task CanSaveAndRetrieveLoan()
    {
        var (member, copy) = await SeedMemberAndCopyAsync();

        var loan = new Loan
        {
            MemberId = member.Id,
            BookCopyId = copy.Id,
            BorrowedAt = DateTime.UtcNow,
            DueAt = DateTime.UtcNow.AddDays(14),
            Status = LoanStatus.Active,
        };
        Context.Loans.Add(loan);
        await Context.SaveChangesAsync();

        var retrieved = await Context.Loans.FindAsync(loan.Id);

        retrieved.ShouldNotBeNull();
        retrieved!.Status.ShouldBe(LoanStatus.Active);
        retrieved.MemberId.ShouldBe(member.Id);
    }

    // ── Reservations ──────────────────────────────────────────────────────

    [Test]
    public async Task CanSaveAndRetrieveReservation()
    {
        var (member, copy) = await SeedMemberAndCopyAsync();

        var reservation = new Reservation
        {
            BookId = copy.BookId,
            MemberId = member.Id,
            BookCopyId = copy.Id,
            ReservedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            Status = ReservationStatus.Pending,
        };
        Context.Reservations.Add(reservation);
        await Context.SaveChangesAsync();

        var retrieved = await Context.Reservations.FindAsync(reservation.Id);

        retrieved.ShouldNotBeNull();
        retrieved!.Status.ShouldBe(ReservationStatus.Pending);
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private async Task<(Member member, BookCopy copy)> SeedMemberAndCopyAsync()
    {
        var author = new Author { FirstName = "Seed", LastName = "Author" };
        Context.Authors.Add(author);
        await Context.SaveChangesAsync();

        var book = new Book { Title = "Seed Book", ISBN = $"SEED-{Guid.NewGuid().ToString()[..8]}", PublishedYear = 2020, AuthorId = author.Id };
        Context.Books.Add(book);

        var member = new Member
        {
            UserId = Guid.NewGuid().ToString(),
            FirstName = "Seed",
            LastName = "Member",
            Email = $"seed.{Guid.NewGuid()}@test.com",
            MemberSince = DateOnly.FromDateTime(DateTime.Today),
        };
        Context.Members.Add(member);
        await Context.SaveChangesAsync();

        var copy = new BookCopy { BookId = book.Id, CopyNumber = $"COPY-{Guid.NewGuid().ToString()[..8]}", Condition = CopyCondition.Good, IsAvailable = true };
        Context.BookCopies.Add(copy);
        await Context.SaveChangesAsync();

        return (member, copy);
    }
}
