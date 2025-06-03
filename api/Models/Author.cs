using System.ComponentModel.DataAnnotations;
using api.Models;

namespace Api.Models;

public class Author
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<Quote> Quotes { get; set; } = new();
}