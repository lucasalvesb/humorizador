# Use the official .NET 9 SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj file and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build the app
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# Use the official .NET 9 runtime image for running
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy the published app from the build stage
COPY --from=build /app/publish .

# Expose the port your app runs on (Render uses 10000)
EXPOSE 10000

# Set environment variables
ENV ASPNETCORE_URLS=http://0.0.0.0:10000
ENV ASPNETCORE_ENVIRONMENT=Production

# Run the application
ENTRYPOINT ["dotnet", "api.dll"]