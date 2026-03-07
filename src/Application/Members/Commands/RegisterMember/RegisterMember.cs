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

public class RegisterMemberCommandHandler : IRequestHandler<RegisterMemberCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;

    public RegisterMemberCommandHandler(IApplicationDbContext context, IIdentityService identityService)
    {
        _context = context;
        _identityService = identityService;
    }

    public async Task<int> Handle(RegisterMemberCommand request, CancellationToken cancellationToken)
    {
        var (result, userId) = await _identityService.CreateUserAsync(request.Email, request.Password);

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

        _context.Members.Add(member);
        await _context.SaveChangesAsync(cancellationToken);

        return member.Id;
    }
}
