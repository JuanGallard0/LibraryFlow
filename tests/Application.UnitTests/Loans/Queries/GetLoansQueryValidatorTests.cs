using LibraryFlow.Application.Loans.Queries.GetLoans;
using NUnit.Framework;
using Shouldly;

namespace LibraryFlow.Application.UnitTests.Loans.Queries;

public class GetLoansQueryValidatorTests
{
    private GetLoansQueryValidator _validator = null!;

    [SetUp]
    public void SetUp()
    {
        _validator = new GetLoansQueryValidator();
    }

    [Test]
    public async Task NullPageValues_Pass()
    {
        var query = new GetLoansQuery { PageNumber = null, PageSize = null };

        var result = await _validator.ValidateAsync(query);

        result.IsValid.ShouldBeTrue();
    }

    [Test]
    public async Task Valid_Query_Passes()
    {
        var query = new GetLoansQuery { PageNumber = 1, PageSize = 10 };

        var result = await _validator.ValidateAsync(query);

        result.IsValid.ShouldBeTrue();
    }

    [Test]
    public async Task PageNumber_Zero_Fails()
    {
        var query = new GetLoansQuery { PageNumber = 0 };

        var result = await _validator.ValidateAsync(query);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(query.PageNumber));
    }

    [Test]
    public async Task PageNumber_Negative_Fails()
    {
        var query = new GetLoansQuery { PageNumber = -1 };

        var result = await _validator.ValidateAsync(query);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(query.PageNumber));
    }

    [Test]
    public async Task PageSize_Zero_Fails()
    {
        var query = new GetLoansQuery { PageSize = 0 };

        var result = await _validator.ValidateAsync(query);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(query.PageSize));
    }

    [Test]
    public async Task PageSize_Exceeds100_Fails()
    {
        var query = new GetLoansQuery { PageSize = 101 };

        var result = await _validator.ValidateAsync(query);

        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(query.PageSize));
    }

    [Test]
    public async Task PageSize_100_Passes()
    {
        var query = new GetLoansQuery { PageSize = 100 };

        var result = await _validator.ValidateAsync(query);

        result.IsValid.ShouldBeTrue();
    }
}
