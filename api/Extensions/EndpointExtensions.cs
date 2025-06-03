using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Models;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Extensions
{
    public static class EndpointExtensions
    {
        public static void MapAuthorEndpoints(this WebApplication app)
        {
            app.MapGet("/authors", async (MoodQuotesDbContext db) =>
            {
                var authors = await db.Authors.Include(a => a.Quotes).ToListAsync();

                var response = authors.Select(a => new AuthorResponse(
                    a.Id,
                    a.Name,
                    a.Bio,
                    a.CreatedAt,
                    a.Quotes.Where(q => q.IsActive).Select(q => new QuoteResponse(
                        q.Id,
                        q.Text,
                        q.MoodType,
                        q.MoodType.GetDisplayName(),
                        q.CreatedAt,
                        a.Name
                    )).ToList()
                )).ToList();

                return Results.Ok(response);
            })
            .WithName("GetAllAuthors");

            app.MapGet("/authors/{id}", async (int id, MoodQuotesDbContext db) =>
            {
                var author = await db.Authors.Include(a => a.Quotes).FirstOrDefaultAsync(a => a.Id == id);
                if (author is null) return Results.NotFound();

                var response = new AuthorResponse(
                    author.Id,
                    author.Name,
                    author.Bio,
                    author.CreatedAt,
                    author.Quotes.Where(q => q.IsActive).Select(q => new QuoteResponse(
                        q.Id,
                        q.Text,
                        q.MoodType,
                        q.MoodType.GetDisplayName(),
                        q.CreatedAt,
                        author.Name
                    )).ToList()
                );

                return Results.Ok(response);
            })
            .WithName("GetAuthorById");

            app.MapPost("/authors", async (CreateAuthorRequest request, MoodQuotesDbContext db) =>
            {
                var author = new Author
                {
                    Name = request.Name,
                    Bio = request.Bio,
                    CreatedAt = DateTime.UtcNow
                };

                db.Authors.Add(author);
                await db.SaveChangesAsync();

                var response = new AuthorResponse(author.Id, author.Name, author.Bio, author.CreatedAt, new List<QuoteResponse>());
                return Results.Created($"/authors/{author.Id}", response);
            })
            .WithName("CreateAuthor");

            app.MapPut("/authors/{id}", async (int id, UpdateAuthorRequest request, MoodQuotesDbContext db) =>
            {
                var author = await db.Authors.Include(a => a.Quotes).FirstOrDefaultAsync(a => a.Id == id);
                if (author is null) return Results.NotFound();

                author.Name = request.Name;
                author.Bio = request.Bio;

                await db.SaveChangesAsync();

                var response = new AuthorResponse(
                    author.Id,
                    author.Name,
                    author.Bio,
                    author.CreatedAt,
                    author.Quotes.Where(q => q.IsActive).Select(q => new QuoteResponse(
                        q.Id,
                        q.Text,
                        q.MoodType,
                        q.MoodType.GetDisplayName(),
                        q.CreatedAt,
                        author.Name
                    )).ToList()
                );

                return Results.Ok(response);
            })
            .WithName("UpdateAuthor");

            app.MapDelete("/authors/{id}", async (int id, MoodQuotesDbContext db) =>
            {
                var author = await db.Authors.FindAsync(id);
                if (author is null) return Results.NotFound();

                db.Authors.Remove(author);
                await db.SaveChangesAsync();
                return Results.NoContent();
            })
            .WithName("DeleteAuthor");
        }

        public static void MapQuoteEndpoints(this WebApplication app)
        {
            app.MapGet("/quotes", async (MoodQuotesDbContext db) =>
            {
                var quotes = await db.Quotes
                    .Include(q => q.Author)
                    .Where(q => q.IsActive)
                    .ToListAsync();

                var response = quotes.Select(q => new QuoteResponse(
                    q.Id,
                    q.Text,
                    q.MoodType,
                    q.MoodType.GetDisplayName(),
                    q.CreatedAt,
                    q.Author.Name
                )).ToList();

                return Results.Ok(response);
            })
            .WithName("GetAllQuotes");

            app.MapGet("/quotes/{id}", async (int id, MoodQuotesDbContext db) =>
            {
                var quote = await db.Quotes
                    .Include(q => q.Author)
                    .FirstOrDefaultAsync(q => q.Id == id && q.IsActive);

                if (quote is null) return Results.NotFound();

                var response = new QuoteResponse(
                    quote.Id,
                    quote.Text,
                    quote.MoodType,
                    quote.MoodType.GetDisplayName(),
                    quote.CreatedAt,
                    quote.Author.Name
                );

                return Results.Ok(response);
            })
            .WithName("GetQuoteById");

            app.MapGet("/quotes/mood/{moodType}", async (MoodType moodType, MoodQuotesDbContext db) =>
            {
                var quotes = await db.Quotes
                    .Include(q => q.Author)
                    .Where(q => q.MoodType == moodType && q.IsActive)
                    .ToListAsync();

                if (!quotes.Any())
                    return Results.NotFound($"No quotes found for mood type: {moodType}");

                var response = quotes.Select(q => new QuoteResponse(
                    q.Id,
                    q.Text,
                    q.MoodType,
                    q.MoodType.GetDisplayName(),
                    q.CreatedAt,
                    q.Author.Name
                )).ToList();

                return Results.Ok(response);
            })
            .WithName("GetQuotesByMoodType");

            app.MapGet("/quotes/mood/{moodType}/random", async (MoodType moodType, MoodQuotesDbContext db) =>
            {
                var quotes = await db.Quotes
                    .Include(q => q.Author)
                    .Where(q => q.MoodType == moodType && q.IsActive)
                    .ToListAsync();

                if (!quotes.Any())
                    return Results.NotFound($"No quotes found for mood type: {moodType}");

                var randomQuote = quotes[Random.Shared.Next(quotes.Count)];
                var response = new QuoteResponse(
                    randomQuote.Id,
                    randomQuote.Text,
                    randomQuote.MoodType,
                    randomQuote.MoodType.GetDisplayName(),
                    randomQuote.CreatedAt,
                    randomQuote.Author.Name
                );

                return Results.Ok(response);
            })
            .WithName("GetRandomQuoteByMoodType");

            app.MapPost("/quotes", async (CreateQuoteRequest request, MoodQuotesDbContext db) =>
            {
                var author = await db.Authors.FindAsync(request.AuthorId);
                if (author is null) return Results.BadRequest("Author not found");

                var quote = new Quote
                {
                    Text = request.Text,
                    AuthorId = request.AuthorId,
                    MoodType = request.MoodType,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                db.Quotes.Add(quote);
                await db.SaveChangesAsync();

                var response = new QuoteResponse(
                    quote.Id,
                    quote.Text,
                    quote.MoodType,
                    quote.MoodType.GetDisplayName(),
                    quote.CreatedAt,
                    author.Name
                );

                return Results.Created($"/quotes/{quote.Id}", response);
            })
            .WithName("CreateQuote");

            app.MapPut("/quotes/{id}", async (int id, UpdateQuoteRequest request, MoodQuotesDbContext db) =>
            {
                var quote = await db.Quotes.Include(q => q.Author).FirstOrDefaultAsync(q => q.Id == id);
                if (quote is null) return Results.NotFound();

                if (request.AuthorId != quote.AuthorId)
                {
                    var author = await db.Authors.FindAsync(request.AuthorId);
                    if (author is null) return Results.BadRequest("Author not found");
                    quote.Author = author;
                }

                quote.Text = request.Text;
                quote.AuthorId = request.AuthorId;
                quote.MoodType = request.MoodType;

                await db.SaveChangesAsync();

                var response = new QuoteResponse(
                    quote.Id,
                    quote.Text,
                    quote.MoodType,
                    quote.MoodType.GetDisplayName(),
                    quote.CreatedAt,
                    quote.Author.Name
                );

                return Results.Ok(response);
            })
            .WithName("UpdateQuote");

            app.MapDelete("/quotes/{id}", async (int id, MoodQuotesDbContext db) =>
            {
                var quote = await db.Quotes.FindAsync(id);
                if (quote is null) return Results.NotFound();

                quote.IsActive = false; // Soft delete
                await db.SaveChangesAsync();
                return Results.NoContent();
            })
            .WithName("DeleteQuote");
        }

        public static void MapMoodTypeEndpoints(this WebApplication app)
        {
            app.MapGet("/mood-types", () =>
            {
                return Enum.GetValues<MoodType>().Select(m => new
                {
                    Name = m.ToString(),
                    Value = (int)m,
                    DisplayName = m.GetDisplayName()
                });
            })
            .WithName("GetMoodTypes");
        }
    }
}