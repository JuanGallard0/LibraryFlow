using FluentValidation.Results;
using LibraryFlow.Application.Common.Exceptions;
using LibraryFlow.Application.Common.Interfaces;
using LibraryFlow.Domain.Entities;
using ValidationException = LibraryFlow.Application.Common.Exceptions.ValidationException;

namespace LibraryFlow.Application.Members.Commands.RegisterMember;

public record RegisterMemberCommand(
    string FirstName,
    string LastName,
    string Email,
    string Password) : IRequest<int>;

public class RegisterMemberCommandHandler(IApplicationDbContext context, IIdentityService identityService)
    : IRequestHandler<RegisterMemberCommand, int>
{
    public async Task<int> Handle(RegisterMemberCommand request, CancellationToken cancellationToken)
    {
        var (result, userId) = await identityService.CreateUserAsync(request.Email, request.Password);

        if (!result.Succeeded)
            throw new ValidationException(result.Errors.Select(e => new ValidationFailure("", e)));

        var member = new Member
        {
            UserId = userId,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            MemberSince = DateOnly.FromDateTime(DateTime.UtcNow),
        };

        context.Members.Add(member);
        await context.SaveChangesAsync(cancellationToken);

        return member.Id;
    }
}
