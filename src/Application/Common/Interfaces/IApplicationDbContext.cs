using LibraryFlow.Domain.Entities;

namespace LibraryFlow.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Author> Authors { get; }
    DbSet<Book> Books { get; }
    DbSet<BookCopy> BookCopies { get; }
    DbSet<Member> Members { get; }
    DbSet<Loan> Loans { get; }
    DbSet<Reservation> Reservations { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
