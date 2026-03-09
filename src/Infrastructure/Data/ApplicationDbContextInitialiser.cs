using LibraryFlow.Domain.Constants;
using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;
using LibraryFlow.Infrastructure.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
            await _context.Database.MigrateAsync();
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
        var administrator = new ApplicationUser { UserName = "admin@localhost", Email = "admin@localhost" };

        if (_userManager.Users.All(u => u.UserName != administrator.UserName))
        {
            await _userManager.CreateAsync(administrator, "Admin123!");
            if (!string.IsNullOrWhiteSpace(administratorRole.Name))
            {
                await _userManager.AddToRolesAsync(administrator, new [] { administratorRole.Name });
            }
        }

        // Default data
        // Seed, if necessary
        if (!_context.Authors.Any())
        {
            // Autores
            var galeano = new Author { FirstName = "Eduardo", LastName = "Galeano", Bio = "Escritor y periodista uruguayo, conocido por Las venas abiertas de América Latina." };
            var marquez = new Author { FirstName = "Gabriel", LastName = "García Márquez", Bio = "Novelista y cuentista colombiano, ganador del Premio Nobel de Literatura en 1982." };
            var cortazar = new Author { FirstName = "Julio", LastName = "Cortázar", Bio = "Escritor argentino de cuentos y novelas, reconocido por Rayuela y sus relatos fantásticos." };
            var borges = new Author { FirstName = "Jorge Luis", LastName = "Borges", Bio = "Poeta, ensayista y cuentista argentino, considerado uno de los grandes maestros de la literatura universal." };
            var allende = new Author { FirstName = "Isabel", LastName = "Allende", Bio = "Novelista chilena, autora de La casa de los espíritus y una de las escritoras más leídas en español." };
            var fuentes = new Author { FirstName = "Carlos", LastName = "Fuentes", Bio = "Novelista y ensayista mexicano, figura clave del boom latinoamericano." };
            var vargas = new Author { FirstName = "Mario", LastName = "Vargas Llosa", Bio = "Escritor peruano ganador del Premio Nobel de Literatura en 2010, autor de La ciudad y los perros." };

            // Libros
            var venasAbiertas = new Book { Title = "Las venas abiertas de América Latina", ISBN = "978-84-323-0178-5", Genre = "Historia", PublishedYear = 1971, Author = galeano };
            var cienAnios = new Book { Title = "Cien años de soledad", ISBN = "978-84-376-0494-7", Genre = "Realismo mágico", PublishedYear = 1967, Author = marquez };
            var elAmor = new Book { Title = "El amor en los tiempos del cólera", ISBN = "978-84-376-0551-7", Genre = "Romance", PublishedYear = 1985, Author = marquez };
            var rayuela = new Book { Title = "Rayuela", ISBN = "978-84-663-0951-3", Genre = "Novela experimental", PublishedYear = 1963, Author = cortazar };
            var bestiario = new Book { Title = "Bestiario", ISBN = "978-84-204-2038-5", Genre = "Cuento", PublishedYear = 1951, Author = cortazar };
            var fictions = new Book { Title = "Ficciones", ISBN = "978-84-206-8482-7", Genre = "Cuento", PublishedYear = 1944, Author = borges };
            var aleph = new Book { Title = "El Aleph", ISBN = "978-84-206-8483-4", Genre = "Cuento", PublishedYear = 1949, Author = borges };
            var casaEspiritus = new Book { Title = "La casa de los espíritus", ISBN = "978-84-666-0184-4", Genre = "Realismo mágico", PublishedYear = 1982, Author = allende };
            var niebla = new Book { Title = "La niebla y la doncella", ISBN = "978-84-666-3521-4", Genre = "Misterio", PublishedYear = 2002, Author = allende };
            var artemio = new Book { Title = "La muerte de Artemio Cruz", ISBN = "978-84-376-0232-5", Genre = "Novela histórica", PublishedYear = 1962, Author = fuentes };
            var ciudadPerros = new Book { Title = "La ciudad y los perros", ISBN = "978-84-663-1987-1", Genre = "Novela", PublishedYear = 1963, Author = vargas };

            // Copias
            venasAbiertas.Copies.Add(new BookCopy { CopyNumber = "VEN-001", Condition = CopyCondition.Good, IsAvailable = true });
            venasAbiertas.Copies.Add(new BookCopy { CopyNumber = "VEN-002", Condition = CopyCondition.Fair, IsAvailable = true });

            cienAnios.Copies.Add(new BookCopy { CopyNumber = "CAS-001", Condition = CopyCondition.New, IsAvailable = true });
            cienAnios.Copies.Add(new BookCopy { CopyNumber = "CAS-002", Condition = CopyCondition.Good, IsAvailable = true });
            cienAnios.Copies.Add(new BookCopy { CopyNumber = "CAS-003", Condition = CopyCondition.Fair, IsAvailable = false });

            elAmor.Copies.Add(new BookCopy { CopyNumber = "AMO-001", Condition = CopyCondition.Good, IsAvailable = true });
            elAmor.Copies.Add(new BookCopy { CopyNumber = "AMO-002", Condition = CopyCondition.Poor, IsAvailable = true });

            rayuela.Copies.Add(new BookCopy { CopyNumber = "RAY-001", Condition = CopyCondition.New, IsAvailable = true });
            rayuela.Copies.Add(new BookCopy { CopyNumber = "RAY-002", Condition = CopyCondition.Good, IsAvailable = false });

            bestiario.Copies.Add(new BookCopy { CopyNumber = "BES-001", Condition = CopyCondition.Fair, IsAvailable = true });

            fictions.Copies.Add(new BookCopy { CopyNumber = "FIC-001", Condition = CopyCondition.Good, IsAvailable = true });
            fictions.Copies.Add(new BookCopy { CopyNumber = "FIC-002", Condition = CopyCondition.New, IsAvailable = true });

            aleph.Copies.Add(new BookCopy { CopyNumber = "ALE-001", Condition = CopyCondition.Good, IsAvailable = true });

            casaEspiritus.Copies.Add(new BookCopy { CopyNumber = "CSE-001", Condition = CopyCondition.New, IsAvailable = true });
            casaEspiritus.Copies.Add(new BookCopy { CopyNumber = "CSE-002", Condition = CopyCondition.Good, IsAvailable = false });

            niebla.Copies.Add(new BookCopy { CopyNumber = "NIE-001", Condition = CopyCondition.Good, IsAvailable = true });

            artemio.Copies.Add(new BookCopy { CopyNumber = "ART-001", Condition = CopyCondition.Fair, IsAvailable = true });
            artemio.Copies.Add(new BookCopy { CopyNumber = "ART-002", Condition = CopyCondition.Good, IsAvailable = true });

            ciudadPerros.Copies.Add(new BookCopy { CopyNumber = "CDP-001", Condition = CopyCondition.New, IsAvailable = true });
            ciudadPerros.Copies.Add(new BookCopy { CopyNumber = "CDP-002", Condition = CopyCondition.Good, IsAvailable = true });

            _context.Authors.AddRange(galeano, marquez, cortazar, borges, allende, fuentes, vargas);
            _context.Books.AddRange(venasAbiertas, cienAnios, elAmor, rayuela, bestiario, fictions, aleph, casaEspiritus, niebla, artemio, ciudadPerros);

            // Usuarios miembros
            var luciaUser = new ApplicationUser { UserName = "lucia@ejemplo.com", Email = "lucia@ejemplo.com" };
            var miguelUser = new ApplicationUser { UserName = "miguel@ejemplo.com", Email = "miguel@ejemplo.com" };
            var sofiaUser = new ApplicationUser { UserName = "sofia@ejemplo.com", Email = "sofia@ejemplo.com" };
            var carlosUser = new ApplicationUser { UserName = "carlos@ejemplo.com", Email = "carlos@ejemplo.com" };
            var anaUser = new ApplicationUser { UserName = "ana@ejemplo.com", Email = "ana@ejemplo.com" };
            await _userManager.CreateAsync(luciaUser, "Miembro1!");
            await _userManager.CreateAsync(miguelUser, "Miembro1!");
            await _userManager.CreateAsync(sofiaUser, "Miembro1!");
            await _userManager.CreateAsync(carlosUser, "Miembro1!");
            await _userManager.CreateAsync(anaUser, "Miembro1!");

            var lucia = new Member { UserId = luciaUser.Id, FirstName = "Lucía", LastName = "Fernández", Email = "lucia@ejemplo.com", MemberSince = new DateOnly(2023, 3, 10), Status = MembershipStatus.Active };
            var miguel = new Member { UserId = miguelUser.Id, FirstName = "Miguel", LastName = "Rodríguez", Email = "miguel@ejemplo.com", MemberSince = new DateOnly(2022, 8, 5), Status = MembershipStatus.Active };
            var sofia = new Member { UserId = sofiaUser.Id, FirstName = "Sofía", LastName = "López", Email = "sofia@ejemplo.com", MemberSince = new DateOnly(2021, 11, 20), Status = MembershipStatus.Suspended };
            var carlos = new Member { UserId = carlosUser.Id, FirstName = "Carlos", LastName = "Martínez", Email = "carlos@ejemplo.com", MemberSince = new DateOnly(2024, 1, 8), Status = MembershipStatus.Active };
            var ana = new Member { UserId = anaUser.Id, FirstName = "Ana", LastName = "González", Email = "ana@ejemplo.com", MemberSince = new DateOnly(2020, 5, 14), Status = MembershipStatus.Expired };

            _context.Members.AddRange(lucia, miguel, sofia, carlos, ana);

            await _context.SaveChangesAsync();

            // Préstamos (después de SaveChanges para que los IDs estén asignados)
            var cienAniosCopy2 = cienAnios.Copies[2]; // no disponible
            var rayuelaCopy2 = rayuela.Copies[1];      // no disponible
            var casaCopy2 = casaEspiritus.Copies[1];   // no disponible

            _context.Loans.AddRange(
                new Loan
                {
                    BookCopy = cienAniosCopy2,
                    Member = miguel,
                    BorrowedAt = DateTime.UtcNow.AddDays(-8),
                    DueAt = DateTime.UtcNow.AddDays(6),
                    Status = LoanStatus.Active
                },
                new Loan
                {
                    BookCopy = rayuelaCopy2,
                    Member = lucia,
                    BorrowedAt = DateTime.UtcNow.AddDays(-20),
                    DueAt = DateTime.UtcNow.AddDays(-6),
                    Status = LoanStatus.Active
                },
                new Loan
                {
                    BookCopy = casaCopy2,
                    Member = carlos,
                    BorrowedAt = DateTime.UtcNow.AddDays(-30),
                    DueAt = DateTime.UtcNow.AddDays(-16),
                    Status = LoanStatus.Returned
                }
            );

            await _context.SaveChangesAsync();
        }
    }
}
