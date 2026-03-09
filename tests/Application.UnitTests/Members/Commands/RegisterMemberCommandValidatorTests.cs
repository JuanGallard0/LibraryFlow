using LibraryFlow.Application.Members.Commands.RegisterMember;
using NUnit.Framework;
using Shouldly;

namespace LibraryFlow.Application.UnitTests.Members.Commands;

public class RegisterMemberCommandValidatorTests
{
    private RegisterMemberCommandValidator _validator = null!;

    [SetUp]
    public void SetUp()
    {
        _validator = new RegisterMemberCommandValidator();
    }

    [Test]
    public async Task Valid_Command_Passes()
    {
        var command = new RegisterMemberCommand("Juan", "Pérez", "juan@example.com", "SecurePass1!");

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeTrue();
    }

    [Test]
    public async Task EmptyFirstName_Fails()
    {
        var command = new RegisterMemberCommand("", "Pérez", "juan@example.com", "SecurePass1!");

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.FirstName));
    }

    [Test]
    public async Task FirstNameExceedingMaxLength_Fails()
    {
        var command = new RegisterMemberCommand(new string('A', 101), "Pérez", "juan@example.com", "SecurePass1!");

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.FirstName));
    }

    [Test]
    public async Task EmptyLastName_Fails()
    {
        var command = new RegisterMemberCommand("Juan", "", "juan@example.com", "SecurePass1!");

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.LastName));
    }

    [Test]
    public async Task LastNameExceedingMaxLength_Fails()
    {
        var command = new RegisterMemberCommand("Juan", new string('A', 101), "juan@example.com", "SecurePass1!");

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.LastName));
    }

    [Test]
    public async Task EmptyEmail_Fails()
    {
        var command = new RegisterMemberCommand("Juan", "Pérez", "", "SecurePass1!");

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.Email));
    }

    [Test]
    public async Task InvalidEmail_Fails()
    {
        var command = new RegisterMemberCommand("Juan", "Pérez", "not-an-email", "SecurePass1!");

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.Email));
    }

    [Test]
    public async Task EmptyPassword_Fails()
    {
        var command = new RegisterMemberCommand("Juan", "Pérez", "juan@example.com", "");

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.Password));
    }

    [Test]
    public async Task ShortPassword_Fails()
    {
        var command = new RegisterMemberCommand("Juan", "Pérez", "juan@example.com", "Short1!");

        var result = await _validator.ValidateAsync(command);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(command.Password));
    }
}
