namespace LibraryFlow.Application.Loans.Queries.GetUserLoans;

public class GetUserLoansQueryValidator : AbstractValidator<GetUserLoansQuery>
{
    public GetUserLoansQueryValidator()
    {
        RuleFor(x => x.PageNumber)
            .GreaterThanOrEqualTo(1).WithMessage("PageNumber must be at least 1.");

        RuleFor(x => x.PageSize)
            .GreaterThanOrEqualTo(1).WithMessage("PageSize must be at least 1.")
            .LessThanOrEqualTo(100).WithMessage("PageSize must not exceed 100.");
    }
}
