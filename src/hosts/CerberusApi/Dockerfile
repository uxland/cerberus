FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

# Install bash, ffmpeg, and Python with necessary packages, ensure non-interactive mode
RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip python3-numpy python3-opencv libx264-dev --fix-missing 

# TEMP: install debugging tools
RUN apt-get update && \
    apt-get install -y net-tools iproute2 curl && \
    rm -rf /var/lib/apt/lists/*

# Determine the installed Python version and set PYTHONNET_PYDLL
RUN python_version=$(python3 -c "import sys; version=sys.version_info[:2]; print(f'{version[0]}.{version[1]}')") && \
    echo "${python_version}" > /tmp/python_version

ENV LD_LIBRARY_PATH="/usr/local/lib:${LD_LIBRARY_PATH}"

# Check Python version
RUN python3 --version

# Build stage for .NET application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Debug
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["src/hosts/CerberusApi/CerberusApi.csproj", "src/hosts/CerberusApi/"]
COPY ["src/core/XabeFFMpegClient/XabeFFMpegClient.csproj", "src/core/XabeFFMpegClient/"]
COPY ["src/features/CerberusBackOffice/CerberusBackOffice.csproj", "src/features/CerberusBackOffice/"]
COPY ["src/core/DomainCore/DomainCore.csproj", "src/core/DomainCore/"]
COPY ["src/core/MvcUtilities/MvcUtilities.csproj", "src/core/MvcUtilities/"]
COPY ["src/core/BackOfficePersistence/BackOfficePersistence.csproj", "src/core/BackOfficePersistence/"]
COPY ["src/core/MartenPersistence/MartenPersistence.csproj", "src/core/MartenPersistence/"]
COPY ["src/core/image-processing/PythonImageProcessor/PythonImageProcessor.csproj", "src/core/image-processing/PythonImageProcessor/"]
COPY ["src/features/CerberusMaintenance/CerberusMaintenance.csproj", "src/features/CerberusMaintenance/"]
COPY ["src/core/MaintenancePerisistence/MaintenancePerisistence.csproj", "src/core/MaintenancePerisistence/"]
RUN dotnet restore "src/hosts/CerberusApi/CerberusApi.csproj"
COPY . .
WORKDIR "/src/src/hosts/CerberusApi"
RUN dotnet build "CerberusApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Debug
RUN dotnet publish "CerberusApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose ports
EXPOSE 8080
EXPOSE 8081
EXPOSE 443

# Entry point
ENTRYPOINT ["dotnet", "CerberusApi.dll"]
