using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;

namespace LibraryFlow.Application.Loans.Queries.GetLoans;

public class LoanDto
{
    public int Id { get; init; }
    public int MemberId { get; init; }
    public string MemberName { get; init; } = string.Empty;
    public int BookCopyId { get; init; }
    public string CopyNumber { get; init; } = string.Empty;
    public string BookTitle { get; init; } = string.Empty;
    public DateTime BorrowedAt { get; init; }
    public DateTime DueAt { get; init; }
    public DateTime? ReturnedAt { get; init; }
    public LoanStatus Status { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Loan, LoanDto>()
                .ForMember(d => d.MemberName, o => o.MapFrom(s => $"{s.Member.FirstName} {s.Member.LastName}"))
                .ForMember(d => d.CopyNumber, o => o.MapFrom(s => s.BookCopy.CopyNumber))
                .ForMember(d => d.BookTitle, o => o.MapFrom(s => s.BookCopy.Book.Title));
        }
    }
}
