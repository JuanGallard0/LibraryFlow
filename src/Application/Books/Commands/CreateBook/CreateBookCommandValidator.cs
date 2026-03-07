namespace LibraryFlow.Application.Books.Commands.CreateBook;

public class CreateBookCommandValidator : AbstractValidator<CreateBookCommand>
{
    public CreateBookCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.ISBN)
            .NotEmpty()
            .MaximumLength(20);

        RuleFor(x => x.PublishedYear)
            .GreaterThan(0);

        RuleFor(x => x.AuthorId)
            .GreaterThan(0);
    }
}
