using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;

namespace LibraryFlow.Application.Members.Queries.GetMembers;

public class MemberDto
{
    public int Id { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public DateOnly MemberSince { get; init; }
    public MembershipStatus Status { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Member, MemberDto>();
        }
    }
}
