using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.DTOs
{
    // Author DTOs
    public record CreateAuthorRequest([Required] string Name, string? Bio);
    public record UpdateAuthorRequest([Required] string Name, string? Bio);

    // Quote DTOs
    public record CreateQuoteRequest([Required] string Text, int AuthorId, MoodType MoodType);
    public record UpdateQuoteRequest([Required] string Text, int AuthorId, MoodType MoodType);

    // Response DTOs (to avoid circular references)
    public record AuthorResponse(
        int Id,
        string Name,
        string? Bio,
        DateTime CreatedAt,
        List<QuoteResponse> Quotes
    );

    public record QuoteResponse(
        int Id,
        string Text,
        MoodType MoodType,
        string MoodTypeDisplay,
        DateTime CreatedAt,
        string AuthorName
    );

    public record SimpleAuthorResponse(
        int Id,
        string Name,
        string? Bio,
        DateTime CreatedAt,
        int QuoteCount
    );
}