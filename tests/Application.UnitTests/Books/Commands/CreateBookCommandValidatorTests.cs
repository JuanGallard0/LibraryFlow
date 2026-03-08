using LibraryFlow.Application.Books.Commands.CreateBook;
using NUnit.Framework;
using Shouldly;

namespace LibraryFlow.Application.UnitTests.Books.Commands;

public class CreateBookCommandValidatorTests
{
    private CreateBookCommandValidator _validator = null!;

    [SetUp]
    public void SetUp()
    {
        _validator = new CreateBookCommandValidator();
    }

    [Test]
    public async Task Valid_Command_Passes()
    {
        var command = new CreateBookCommand
        {
            Title = "Clean Architecture",
            ISBN = "978-0134494166",
            PublishedYear = 2017,
            AuthorId = 1,
        };

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeTrue();
    }

    [Test]
    public async Task EmptyTitle_Fails()
    {
        var command = new CreateBookCommand { Title = "", ISBN = "123", PublishedYear = 2000, AuthorId = 1 };

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.Title));
    }

    [Test]
    public async Task TitleExceedingMaxLength_Fails()
    {
        var command = new CreateBookCommand
        {
            Title = new string('A', 201),
            ISBN = "123",
            PublishedYear = 2000,
            AuthorId = 1
        };

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.Title));
    }

    [Test]
    public async Task EmptyISBN_Fails()
    {
        var command = new CreateBookCommand { Title = "Title", ISBN = "", PublishedYear = 2000, AuthorId = 1 };

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.ISBN));
    }

    [Test]
    public async Task ISBNExceedingMaxLength_Fails()
    {
        var command = new CreateBookCommand
        {
            Title = "Title",
            ISBN = new string('1', 21),
            PublishedYear = 2000,
            AuthorId = 1
        };

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.ISBN));
    }

    [Test]
    public async Task PublishedYear_Zero_Fails()
    {
        var command = new CreateBookCommand { Title = "Title", ISBN = "123", PublishedYear = 0, AuthorId = 1 };

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.PublishedYear));
    }

    [Test]
    public async Task PublishedYear_Negative_Fails()
    {
        var command = new CreateBookCommand { Title = "Title", ISBN = "123", PublishedYear = -1, AuthorId = 1 };

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.PublishedYear));
    }

    [Test]
    public async Task AuthorId_Zero_Fails()
    {
        var command = new CreateBookCommand { Title = "Title", ISBN = "123", PublishedYear = 2000, AuthorId = 0 };

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.AuthorId));
    }

    [Test]
    public async Task AuthorId_Negative_Fails()
    {
        var command = new CreateBookCommand { Title = "Title", ISBN = "123", PublishedYear = 2000, AuthorId = -5 };

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.AuthorId));
    }
}
