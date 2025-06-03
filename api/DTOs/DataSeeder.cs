using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Api.Models;

namespace api.DTOs
{
    public static class DataSeeder
    {
        public static void SeedData(MoodQuotesDbContext context)
        {
            if (context.Authors.Any()) return;

            var now = DateTime.UtcNow;

            var authors = new[]
            {
            new Author { Name = "Maya Angelou", Bio = "American poet, memoirist, and civil rights activist", CreatedAt = now },
            new Author { Name = "Viktor Frankl", Bio = "Austrian neurologist, psychiatrist, and Holocaust survivor", CreatedAt = now },
            new Author { Name = "Rumi", Bio = "13th-century Persian poet, Islamic scholar, and Sufi mystic", CreatedAt = now },
            new Author { Name = "Buddha", Bio = "Spiritual teacher and founder of Buddhism", CreatedAt = now },
            new Author { Name = "Marcus Aurelius", Bio = "Roman emperor and Stoic philosopher", CreatedAt = now }
        };

            context.Authors.AddRange(authors);
            context.SaveChanges();

            var quotes = new[]
            {
            new Quote { Text = "You are braver than you believe, stronger than you seem, and smarter than you think.", AuthorId = 1, MoodType = MoodType.LowSelfEsteem, IsActive = true, CreatedAt = now },
            new Quote { Text = "When we can no longer change a situation, we are challenged to change ourselves.", AuthorId = 2, MoodType = MoodType.Depression, IsActive = true, CreatedAt = now },
            new Quote { Text = "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", AuthorId = 3, MoodType = MoodType.Overwhelmed, IsActive = true, CreatedAt = now },
            new Quote { Text = "Peace comes from within. Do not seek it without.", AuthorId = 4, MoodType = MoodType.Anxiety, IsActive = true, CreatedAt = now },
            new Quote { Text = "You have power over your mind - not outside events. Realize this, and you will find strength.", AuthorId = 5, MoodType = MoodType.Stress, IsActive = true, CreatedAt = now },
            new Quote { Text = "The darkest moments are to be cherished, for they are the greatest teachers.", AuthorId = 3, MoodType = MoodType.Sadness, IsActive = true, CreatedAt = now },
            new Quote { Text = "Focus on the step in front of you, not the whole staircase.", AuthorId = 5, MoodType = MoodType.LackOfFocus, IsActive = true, CreatedAt = now },
            new Quote { Text = "You yourself, as much as anybody in the entire universe, deserve your love and affection.", AuthorId = 4, MoodType = MoodType.Loneliness, IsActive = true, CreatedAt = now }
        };

            context.Quotes.AddRange(quotes);
            context.SaveChanges();
        }
    }
}