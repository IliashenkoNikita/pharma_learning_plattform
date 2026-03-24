FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY PharmaTraining.slnx ./
COPY src/PharmaTraining.Api/PharmaTraining.Api.csproj src/PharmaTraining.Api/
COPY src/PharmaTraining.Application/PharmaTraining.Application.csproj src/PharmaTraining.Application/
COPY src/PharmaTraining.Domain/PharmaTraining.Domain.csproj src/PharmaTraining.Domain/
COPY src/PharmaTraining.Infrastructure/PharmaTraining.Infrastructure.csproj src/PharmaTraining.Infrastructure/
RUN dotnet restore src/PharmaTraining.Api/PharmaTraining.Api.csproj

COPY . .
RUN dotnet publish src/PharmaTraining.Api/PharmaTraining.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "PharmaTraining.Api.dll"]
