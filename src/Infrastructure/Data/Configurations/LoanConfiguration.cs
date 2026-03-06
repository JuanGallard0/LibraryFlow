using LibraryFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LibraryFlow.Infrastructure.Data.Configurations;

public class LoanConfiguration : IEntityTypeConfiguration<Loan>
{
    public void Configure(EntityTypeBuilder<Loan> builder)
    {
        builder.Property(l => l.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.HasIndex(l => l.MemberId);

        builder.HasIndex(l => l.BookCopyId);

        builder.HasOne(l => l.Reservation)
            .WithMany()
            .HasForeignKey(l => l.ReservationId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
