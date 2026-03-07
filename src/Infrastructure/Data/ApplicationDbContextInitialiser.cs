using LibraryFlow.Domain.Constants;
using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;
using LibraryFlow.Infrastructure.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace LibraryFlow.Infrastructure.Data;

public static class InitialiserExtensions
{
    public static async Task InitialiseDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();

        await initialiser.InitialiseAsync();
        await initialiser.SeedAsync();
    }
}

public class ApplicationDbContextInitialiser
{
    private readonly ILogger<ApplicationDbContextInitialiser> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public ApplicationDbContextInitialiser(ILogger<ApplicationDbContextInitialiser> logger, ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task InitialiseAsync()
    {
        try
        {
            // See https://jasontaylor.dev/ef-core-database-initialisation-strategies
            await _context.Database.EnsureDeletedAsync();
            await _context.Database.EnsureCreatedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initialising the database.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    public async Task TrySeedAsync()
    {
        // Default roles
        var administratorRole = new IdentityRole(Roles.Administrator);

        if (_roleManager.Roles.All(r => r.Name != administratorRole.Name))
        {
            await _roleManager.CreateAsync(administratorRole);
        }

        // Default users
        var administrator = new ApplicationUser { UserName = "administrator@localhost", Email = "administrator@localhost" };

        if (_userManager.Users.All(u => u.UserName != administrator.UserName))
        {
            await _userManager.CreateAsync(administrator, "Administrator1!");
            if (!string.IsNullOrWhiteSpace(administratorRole.Name))
            {
                await _userManager.AddToRolesAsync(administrator, new [] { administratorRole.Name });
            }
        }

        // Default data
        // Seed, if necessary
        if (!_context.Authors.Any())
        {
            var tolkien = new Author { FirstName = "J.R.R.", LastName = "Tolkien", Bio = "English author and philologist, best known for The Lord of the Rings." };
            var orwell = new Author { FirstName = "George", LastName = "Orwell", Bio = "English novelist and essayist, known for Nineteen Eighty-Four and Animal Farm." };
            var rowling = new Author { FirstName = "J.K.", LastName = "Rowling", Bio = "British author, best known for the Harry Potter fantasy series." };

            var lotr = new Book { Title = "The Lord of the Rings", ISBN = "978-0-261-10235-4", Genre = "Fantasy", PublishedYear = 1954, Author = tolkien };
            var hobbit = new Book { Title = "The Hobbit", ISBN = "978-0-261-10221-7", Genre = "Fantasy", PublishedYear = 1937, Author = tolkien };
            var nineteenEightyFour = new Book { Title = "Nineteen Eighty-Four", ISBN = "978-0-141-18776-1", Genre = "Dystopian", PublishedYear = 1949, Author = orwell };
            var animalFarm = new Book { Title = "Animal Farm", ISBN = "978-0-141-18750-1", Genre = "Satire", PublishedYear = 1945, Author = orwell };
            var harryPotter = new Book { Title = "Harry Potter and the Philosopher's Stone", ISBN = "978-0-7475-3269-9", Genre = "Fantasy", PublishedYear = 1997, Author = rowling };

            lotr.Copies.Add(new BookCopy { CopyNumber = "LOTR-001", Condition = CopyCondition.Good, IsAvailable = true });
            lotr.Copies.Add(new BookCopy { CopyNumber = "LOTR-002", Condition = CopyCondition.Fair, IsAvailable = true });
            hobbit.Copies.Add(new BookCopy { CopyNumber = "HOB-001", Condition = CopyCondition.New, IsAvailable = true });
            nineteenEightyFour.Copies.Add(new BookCopy { CopyNumber = "1984-001", Condition = CopyCondition.Good, IsAvailable = true });
            animalFarm.Copies.Add(new BookCopy { CopyNumber = "AF-001", Condition = CopyCondition.Good, IsAvailable = false });
            harryPotter.Copies.Add(new BookCopy { CopyNumber = "HP-001", Condition = CopyCondition.New, IsAvailable = true });
            harryPotter.Copies.Add(new BookCopy { CopyNumber = "HP-002", Condition = CopyCondition.Good, IsAvailable = true });

            _context.Authors.AddRange(tolkien, orwell, rowling);
            _context.Books.AddRange(lotr, hobbit, nineteenEightyFour, animalFarm, harryPotter);

            var aliceUser = new ApplicationUser { UserName = "alice@example.com", Email = "alice@example.com" };
            var bobUser = new ApplicationUser { UserName = "bob@example.com", Email = "bob@example.com" };
            var carolUser = new ApplicationUser { UserName = "carol@example.com", Email = "carol@example.com" };
            await _userManager.CreateAsync(aliceUser, "Member1!");
            await _userManager.CreateAsync(bobUser, "Member1!");
            await _userManager.CreateAsync(carolUser, "Member1!");

            var alice = new Member { UserId = aliceUser.Id, FirstName = "Alice", LastName = "Smith", Email = "alice@example.com", MemberSince = new DateOnly(2023, 1, 15), Status = MembershipStatus.Active };
            var bob = new Member { UserId = bobUser.Id, FirstName = "Bob", LastName = "Johnson", Email = "bob@example.com", MemberSince = new DateOnly(2022, 6, 10), Status = MembershipStatus.Active };
            var carol = new Member { UserId = carolUser.Id, FirstName = "Carol", LastName = "Williams", Email = "carol@example.com", MemberSince = new DateOnly(2021, 3, 22), Status = MembershipStatus.Suspended };

            _context.Members.AddRange(alice, bob, carol);

            await _context.SaveChangesAsync();

            // Loans (after SaveChanges so IDs are assigned)
            var afCopy = animalFarm.Copies.First();
            _context.Loans.Add(new Loan
            {
                BookCopy = afCopy,
                Member = bob,
                BorrowedAt = DateTime.UtcNow.AddDays(-10),
                DueAt = DateTime.UtcNow.AddDays(4),
                Status = LoanStatus.Active
            });

            await _context.SaveChangesAsync();
        }
    }
}
