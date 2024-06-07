FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/hosts/BackOfficeUI/BackOfficeUI.csproj", "src/hosts/BackOfficeUI/"]
COPY ["src/features/CerverusFeatures/CerverusFeatures.csproj", "src/features/CerverusFeatures/"]
COPY ["src/core/DomainCore/DomainCore.csproj", "src/core/DomainCore/"]
COPY ["src/core/MvcUtilities/MvcUtilities.csproj", "src/core/MvcUtilities/"]
COPY ["src/features/CerverusMaintenance/CerverusMaintenance.csproj", "src/features/CerverusMaintenance/"]
RUN dotnet restore "src/hosts/BackOfficeUI/BackOfficeUI.csproj"
COPY . .
WORKDIR "/src/src/hosts/BackOfficeUI"
RUN dotnet build "BackOfficeUI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "BackOfficeUI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BackOfficeUI.dll"]
