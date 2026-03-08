using LibraryFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace LibraryFlow.Infrastructure.IntegrationTests.Data;

public abstract class IntegrationTestBase
{
    protected ApplicationDbContext Context = null!;

    private static readonly string ConnectionString = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build()
        .GetConnectionString("LibraryFlowDb")!;

    [OneTimeSetUp]
    public async Task OneTimeSetUp()
    {
        Context = CreateContext();
        await Context.Database.EnsureCreatedAsync();
    }

    [SetUp]
    public async Task SetUp()
    {
        // Clean in FK-safe order before each test
        await Context.Database.ExecuteSqlRawAsync("DELETE FROM Loans");
        await Context.Database.ExecuteSqlRawAsync("DELETE FROM Reservations");
        await Context.Database.ExecuteSqlRawAsync("DELETE FROM BookCopies");
        await Context.Database.ExecuteSqlRawAsync("DELETE FROM Books");
        await Context.Database.ExecuteSqlRawAsync("DELETE FROM Members");
        await Context.Database.ExecuteSqlRawAsync("DELETE FROM Authors");
        Context.ChangeTracker.Clear();
    }

    [OneTimeTearDown]
    public async Task OneTimeTearDown()
    {
        await Context.DisposeAsync();
    }

    protected static ApplicationDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlServer(ConnectionString)
            .Options;

        return new ApplicationDbContext(options);
    }
}
