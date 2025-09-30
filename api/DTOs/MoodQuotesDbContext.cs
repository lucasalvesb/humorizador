using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.DTOs
{
    public class MoodQuotesDbContext : DbContext
    {
        public MoodQuotesDbContext(DbContextOptions<MoodQuotesDbContext> options) : base(options) { }

        public DbSet<Quote> Quotes { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<ClientSeenQuote> ClientSeenQuotes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Author>(entity =>
            {
                entity.ToTable("authors");
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Id).HasColumnName("id");
                entity.Property(a => a.Name).HasColumnName("name").IsRequired().HasMaxLength(200);
                entity.Property(a => a.Bio).HasColumnName("bio").HasMaxLength(1000);
                entity.Property(a => a.CreatedAt).HasColumnName("created_at").HasColumnType("timestamp with time zone");
                entity.HasMany(a => a.Quotes).WithOne(q => q.Author).HasForeignKey(q => q.AuthorId);
            });

            modelBuilder.Entity<Quote>(entity =>
            {
                entity.ToTable("quotes");
                entity.HasKey(q => q.Id);
                entity.Property(q => q.Id).HasColumnName("id");
                entity.Property(q => q.Text).HasColumnName("text").IsRequired().HasMaxLength(2000);
                entity.Property(q => q.AuthorId).HasColumnName("author_id");
                entity.Property(q => q.MoodType).HasColumnName("mood_type").HasConversion<int>();
                entity.Property(q => q.CreatedAt).HasColumnName("created_at").HasColumnType("timestamp with time zone");
                entity.Property(q => q.IsActive).HasColumnName("is_active").HasDefaultValue(true);
                entity.HasOne(q => q.Author).WithMany(a => a.Quotes).HasForeignKey(q => q.AuthorId);
            });
        }
    }
}