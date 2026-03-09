using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;

namespace LibraryFlow.Application.Reservations.Queries.GetUserReservations;

public class ReservationDto
{
    public int Id { get; init; }
    public int MemberId { get; init; }
    public string MemberName { get; init; } = string.Empty;
    public string MemberEmail { get; init; } = string.Empty;
    public int BookId { get; init; }
    public string BookTitle { get; init; } = string.Empty;
    public string BookISBN { get; init; } = string.Empty;
    public DateTime ReservedAt { get; init; }
    public DateTime ExpiresAt { get; init; }
    public ReservationStatus Status { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Reservation, ReservationDto>()
                .ForMember(d => d.MemberName, o => o.MapFrom(s => $"{s.Member.FirstName} {s.Member.LastName}"))
                .ForMember(d => d.MemberEmail, o => o.MapFrom(s => s.Member.Email))
                .ForMember(d => d.BookTitle, o => o.MapFrom(s => s.Book.Title))
                .ForMember(d => d.BookISBN, o => o.MapFrom(s => s.Book.ISBN));
        }
    }
}
