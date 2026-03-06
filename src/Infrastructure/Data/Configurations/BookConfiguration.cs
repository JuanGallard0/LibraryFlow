using LibraryFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LibraryFlow.Infrastructure.Data.Configurations;

public class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.Property(b => b.Title)
            .HasMaxLength(300)
            .IsRequired();

        builder.Property(b => b.ISBN)
            .HasMaxLength(20)
            .IsRequired();

        builder.HasIndex(b => b.ISBN)
            .IsUnique();

        builder.Property(b => b.Genre)
            .HasMaxLength(100);

        builder.HasMany(b => b.Copies)
            .WithOne(c => c.Book)
            .HasForeignKey(c => c.BookId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(b => b.Reservations)
            .WithOne(r => r.Book)
            .HasForeignKey(r => r.BookId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
