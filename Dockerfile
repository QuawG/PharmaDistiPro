# Use the .NET SDK image for building the application
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy the project file and restore dependencies
COPY PharmaDistiPro/*.csproj ./PharmaDistiPro/
RUN dotnet restore PharmaDistiPro/PharmaDistiPro.csproj

# Copy the entire source code and build the application
COPY PharmaDistiPro/. ./PharmaDistiPro/
WORKDIR /app/PharmaDistiPro
RUN dotnet publish -c Release -o /app/publish

# Use the .NET runtime image for running the application
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Expose only port 7069
EXPOSE 7069

# Set environment variable for ASP.NET Core URLS
ENV ASPNETCORE_URLS=http://*:7069

# Run the application
ENTRYPOINT ["dotnet", "PharmaDistiPro.dll"]
