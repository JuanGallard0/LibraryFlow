using Ardalis.GuardClauses;
using LibraryFlow.Application.Common.Exceptions;
using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;
using LibraryFlow.Infrastructure.IntegrationTests.Data;
using LibraryFlow.Infrastructure.Reservations;

namespace LibraryFlow.Infrastructure.IntegrationTests.Reservations;

[TestFixture]
public class ReservationServiceTests : IntegrationTestBase
{
    private ReservationService _service = null!;

    [SetUp]
    public new async Task SetUp()
    {
        await base.SetUp();
        _service = new ReservationService(Context);
    }

    [Test]
    public async Task ReserveBook_WithAvailableCopy_ReturnsNewReservationId()
    {
        var (member, copy) = await SeedMemberAndCopyAsync(isAvailable: true);

        var id = await _service.ReserveBookAsync(copy.BookId, member.Id, CancellationToken.None);

        id.ShouldBeGreaterThan(0);
    }

    [Test]
    public async Task ReserveBook_WithAvailableCopy_MarksCopyUnavailable()
    {
        var (member, copy) = await SeedMemberAndCopyAsync(isAvailable: true);

        await _service.ReserveBookAsync(copy.BookId, member.Id, CancellationToken.None);

        Context.ChangeTracker.Clear();
        var updatedCopy = await Context.BookCopies.FindAsync(copy.Id);
        updatedCopy!.IsAvailable.ShouldBeFalse();
    }

    [Test]
    public async Task ReserveBook_WithAvailableCopy_CreatesReservationWithPendingStatus()
    {
        var (member, copy) = await SeedMemberAndCopyAsync(isAvailable: true);

        var id = await _service.ReserveBookAsync(copy.BookId, member.Id, CancellationToken.None);

        Context.ChangeTracker.Clear();
        var reservation = await Context.Reservations.FindAsync(id);
        reservation.ShouldNotBeNull();
        reservation!.Status.ShouldBe(ReservationStatus.Pending);
        reservation.BookId.ShouldBe(copy.BookId);
        reservation.MemberId.ShouldBe(member.Id);
    }

    [Test]
    public async Task ReserveBook_WithNonExistentBook_ThrowsNotFoundException()
    {
        var member = await SeedMemberAsync();
        const int nonExistentBookId = 999999;

        await Should.ThrowAsync<NotFoundException>(() =>
            _service.ReserveBookAsync(nonExistentBookId, member.Id, CancellationToken.None));
    }

    [Test]
    public async Task ReserveBook_WithNoAvailableCopies_ThrowsValidationException()
    {
        var (member, copy) = await SeedMemberAndCopyAsync(isAvailable: false);

        await Should.ThrowAsync<ValidationException>(() =>
            _service.ReserveBookAsync(copy.BookId, member.Id, CancellationToken.None));
    }

    [Test]
    public async Task ReserveBook_WhenAlreadyHasPendingReservation_ThrowsValidationException()
    {
        var (member, copy) = await SeedMemberAndCopyAsync(isAvailable: true);

        // First reservation succeeds
        await _service.ReserveBookAsync(copy.BookId, member.Id, CancellationToken.None);

        // Add another available copy so the 2nd attempt doesn't fail on "no copies"
        var secondCopy = new BookCopy { BookId = copy.BookId, CopyNumber = $"COPY2-{Guid.NewGuid().ToString()[..6]}", Condition = CopyCondition.Good, IsAvailable = true };
        Context.ChangeTracker.Clear();
        Context.BookCopies.Add(secondCopy);
        await Context.SaveChangesAsync();

        // Second reservation should fail: already pending
        await Should.ThrowAsync<ValidationException>(() =>
            _service.ReserveBookAsync(copy.BookId, member.Id, CancellationToken.None));
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private async Task<Member> SeedMemberAsync()
    {
        var member = new Member
        {
            UserId = Guid.NewGuid().ToString(),
            FirstName = "Test",
            LastName = "User",
            Email = $"test.{Guid.NewGuid()}@test.com",
            MemberSince = DateOnly.FromDateTime(DateTime.Today),
        };
        Context.Members.Add(member);
        await Context.SaveChangesAsync();
        return member;
    }

    private async Task<(Member member, BookCopy copy)> SeedMemberAndCopyAsync(bool isAvailable)
    {
        var author = new Author { FirstName = "Test", LastName = "Author" };
        Context.Authors.Add(author);
        await Context.SaveChangesAsync();

        var book = new Book { Title = "Test Book", ISBN = $"ISBN-{Guid.NewGuid().ToString()[..8]}", PublishedYear = 2020, AuthorId = author.Id };
        Context.Books.Add(book);
        await Context.SaveChangesAsync();

        var member = await SeedMemberAsync();

        var copy = new BookCopy { BookId = book.Id, CopyNumber = $"COPY-{Guid.NewGuid().ToString()[..8]}", Condition = CopyCondition.Good, IsAvailable = isAvailable };
        Context.BookCopies.Add(copy);
        await Context.SaveChangesAsync();

        return (member, copy);
    }
}
