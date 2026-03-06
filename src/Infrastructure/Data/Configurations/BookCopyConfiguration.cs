using LibraryFlow.Domain.Entities;
using LibraryFlow.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LibraryFlow.Infrastructure.Data.Configurations;

public class BookCopyConfiguration : IEntityTypeConfiguration<BookCopy>
{
    public void Configure(EntityTypeBuilder<BookCopy> builder)
    {
        builder.Property(c => c.CopyNumber)
            .HasMaxLength(50)
            .IsRequired();

        builder.HasIndex(c => new { c.BookId, c.CopyNumber })
            .IsUnique();

        builder.Property(c => c.Condition)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.HasMany(c => c.Loans)
            .WithOne(l => l.BookCopy)
            .HasForeignKey(l => l.BookCopyId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
