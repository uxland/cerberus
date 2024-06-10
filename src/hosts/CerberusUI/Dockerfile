FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/hosts/CerberusUI/CerberusUI.csproj", "src/hosts/CerberusUI/"]
COPY ["src/features/CerberusBackOffice/CerberusBackOffice.csproj", "src/features/CerberusBackOffice/"]
COPY ["src/core/DomainCore/DomainCore.csproj", "src/core/DomainCore/"]
COPY ["src/core/MvcUtilities/MvcUtilities.csproj", "src/core/MvcUtilities/"]
COPY ["src/features/CerberusMaintenance/CerberusMaintenance.csproj", "src/features/CerberusMaintenance/"]
RUN dotnet restore "src/hosts/CerberusUI/CerberusUI.csproj"
COPY . .
WORKDIR "/src/src/hosts/CerberusUI"
RUN dotnet build "CerberusUI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "CerberusUI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CerberusUI.dll"]
