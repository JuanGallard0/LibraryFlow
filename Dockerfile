# ── Stage 1: Build (SDK + Node for SPA) ──────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

# Install Node.js 20 (needed for vite build + nswag code generation)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src

# Prevents DB init from running during build-time OpenAPI spec generation
ENV SKIP_DB_INIT=true

# Copy solution and project files first for better layer caching
COPY global.json Directory.Build.props Directory.Packages.props* ./
COPY src/Web/Web.csproj src/Web/
COPY src/Application/Application.csproj src/Application/
COPY src/Infrastructure/Infrastructure.csproj src/Infrastructure/
COPY src/Domain/Domain.csproj src/Domain/

RUN dotnet restore src/Web/Web.csproj

# Copy the rest of the source
COPY src/ src/

# dotnet publish:
#   1. Builds .NET → generates wwwroot/openapi/v1.json (OpenAPI spec)
#   2. PublishRunWebpack target → npm install + npm run build
#      - prebuild: nswag reads v1.json → generates web-api-client.ts
#      - vite build → compiles React SPA into ClientApp/build/
#   3. Copies SPA output into wwwroot/
RUN dotnet publish src/Web/Web.csproj -c Release -o /app/publish --no-self-contained

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "LibraryFlow.Web.dll"]
