using System.Runtime.CompilerServices;
using AutoMapper;
using LibraryFlow.Application.Authors.Queries.GetAuthors;
using LibraryFlow.Application.BookCopies.Queries.GetBookCopies;
using LibraryFlow.Application.Books.Queries.GetBooksWithPagination;
using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Application.Common.Models;
using LibraryFlow.Application.Loans.Queries.GetLoans;
using LibraryFlow.Application.Members.Queries.GetMembers;
using LibraryFlow.Application.Reservations.Queries.GetUserReservations;
using LibraryFlow.Application.TodoItems.Queries.GetTodoItemsWithPagination;
using LibraryFlow.Application.TodoLists.Queries.GetTodos;
using LibraryFlow.Domain.Entities;
using Microsoft.Extensions.Logging;
using NUnit.Framework;

namespace LibraryFlow.Application.UnitTests.Common.Mappings;

public class MappingTests
{
    private ILoggerFactory? _loggerFactory;
    private MapperConfiguration? _configuration;
    private IMapper? _mapper;

    [OneTimeSetUp]
    public void OneTimeSetUp()
    {
        // Minimal logger factory for tests
        _loggerFactory = LoggerFactory.Create(b => b.AddDebug().SetMinimumLevel(LogLevel.Debug));

        _configuration = new MapperConfiguration(cfg =>
            cfg.AddMaps(typeof(IApplicationDbContext).Assembly),
            loggerFactory: _loggerFactory);

        _mapper = _configuration.CreateMapper();
    }

    [Test]
    public void ShouldHaveValidConfiguration()
    {
        _configuration!.AssertConfigurationIsValid();
    }

    [Test]
    [TestCase(typeof(TodoList), typeof(TodoListDto))]
    [TestCase(typeof(TodoItem), typeof(TodoItemDto))]
    [TestCase(typeof(TodoList), typeof(LookupDto))]
    [TestCase(typeof(TodoItem), typeof(LookupDto))]
    [TestCase(typeof(TodoItem), typeof(TodoItemBriefDto))]
    [TestCase(typeof(Loan), typeof(LoanDto))]
    [TestCase(typeof(Reservation), typeof(ReservationDto))]
    [TestCase(typeof(Book), typeof(BookDto))]
    [TestCase(typeof(Member), typeof(MemberDto))]
    [TestCase(typeof(Author), typeof(AuthorDto))]
    [TestCase(typeof(BookCopy), typeof(BookCopyDto))]
    public void ShouldSupportMappingFromSourceToDestination(Type source, Type destination)
    {
        var instance = GetInstanceOf(source);

        _mapper!.Map(instance, source, destination);
    }

    private static object GetInstanceOf(Type type)
    {
        if (type.GetConstructor(Type.EmptyTypes) != null)
            return Activator.CreateInstance(type)!;

        // Type without parameterless constructor
        return RuntimeHelpers.GetUninitializedObject(type);
    }


    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        _loggerFactory?.Dispose();
    }
}
