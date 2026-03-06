using LibraryFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LibraryFlow.Infrastructure.Data.Configurations;

public class MemberConfiguration : IEntityTypeConfiguration<Member>
{
    public void Configure(EntityTypeBuilder<Member> builder)
    {
        builder.Property(m => m.FirstName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(m => m.LastName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(m => m.Email)
            .HasMaxLength(256)
            .IsRequired();

        builder.HasIndex(m => m.Email)
            .IsUnique();

        builder.Property(m => m.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.HasMany(m => m.Loans)
            .WithOne(l => l.Member)
            .HasForeignKey(l => l.MemberId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(m => m.Reservations)
            .WithOne(r => r.Member)
            .HasForeignKey(r => r.MemberId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
