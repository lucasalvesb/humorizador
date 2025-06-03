using Microsoft.EntityFrameworkCore;

using api.Extensions;
using api.DTOs;

var builder = WebApplication.CreateBuilder(args);

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Information);

// Add services to the container
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure JSON options to handle circular references
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.SerializerOptions.WriteIndented = true;
});

// Get database configuration from environment variables
var dbHost = Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost";
var dbPort = Environment.GetEnvironmentVariable("DB_PORT") ?? "5432";
var dbName = Environment.GetEnvironmentVariable("DB_NAME") ?? "MoodQuotesDb";
var dbUser = Environment.GetEnvironmentVariable("DB_USER") ?? "postgres";
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "yourpassword123";

var connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPassword};";

builder.Services.AddDbContext<MoodQuotesDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// Database initialization with improved retry logic
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<MoodQuotesDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    logger.LogInformation("🚀 Starting database initialization...");

    var retryCount = 0;
    const int maxRetries = 15;

    while (retryCount < maxRetries)
    {
        try
        {
            logger.LogInformation("📡 Attempting to connect to database (attempt {RetryCount}/{MaxRetries})", retryCount + 1, maxRetries);

            // Test connection first
            await context.Database.CanConnectAsync();
            logger.LogInformation("✅ Database connection successful!");

            // Create database if needed
            var created = await context.Database.EnsureCreatedAsync();
            if (created)
            {
                logger.LogInformation("🗄️ Database created successfully");
            }
            else
            {
                logger.LogInformation("🗄️ Database already exists");
            }

            // Seed data
            DataSeeder.SeedData(context);
            logger.LogInformation("🌱 Database seeded successfully");

            break;
        }
        catch (Exception ex)
        {
            retryCount++;
            logger.LogWarning("❌ Database connection failed (attempt {RetryCount}/{MaxRetries}): {Error}",
                retryCount, maxRetries, ex.Message);

            if (retryCount >= maxRetries)
            {
                logger.LogError(ex, "💥 Failed to connect to database after {MaxRetries} attempts", maxRetries);
                throw;
            }

            logger.LogInformation("⏳ Waiting 3 seconds before retry...");
            await Task.Delay(3000);
        }
    }
}

// Map endpoints
app.MapAuthorEndpoints();
app.MapQuoteEndpoints();
app.MapMoodTypeEndpoints();

// Add a health check endpoint
app.MapGet("/health", () => new { Status = "Healthy", Timestamp = DateTime.UtcNow })
   .WithName("HealthCheck");

Console.WriteLine("🌟 Mood Quotes API is starting...");
Console.WriteLine($"📍 API will be available at: http://localhost:5102");
Console.WriteLine($"📖 Swagger UI: http://localhost:5102/swagger");

app.Run();