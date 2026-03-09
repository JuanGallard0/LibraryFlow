namespace LibraryFlow.Application.BookCopies.Commands.CreateBookCopy;

public class CreateBookCopyCommandValidator : AbstractValidator<CreateBookCopyCommand>
{
    public CreateBookCopyCommandValidator()
    {
        RuleFor(x => x.CopyNumber)
            .NotEmpty()
            .MaximumLength(50);
    }
}
