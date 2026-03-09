using LibraryFlow.Application.BookCopies.Commands.CreateBookCopy;
using LibraryFlow.Domain.Enums;
using NUnit.Framework;
using Shouldly;

namespace LibraryFlow.Application.UnitTests.BookCopies.Commands;

public class CreateBookCopyCommandValidatorTests
{
    private CreateBookCopyCommandValidator _validator = null!;

    [SetUp]
    public void SetUp()
    {
        _validator = new CreateBookCopyCommandValidator();
    }

    [Test]
    public async Task Valid_Command_Passes()
    {
        var command = new CreateBookCopyCommand(1, "CAS-001", CopyCondition.New);

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeTrue();
    }

    [Test]
    public async Task EmptyCopyNumber_Fails()
    {
        var command = new CreateBookCopyCommand(1, "", CopyCondition.Good);

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.CopyNumber));
    }

    [Test]
    public async Task CopyNumberExceedingMaxLength_Fails()
    {
        var command = new CreateBookCopyCommand(1, new string('A', 51), CopyCondition.Good);

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.CopyNumber));
    }
}
