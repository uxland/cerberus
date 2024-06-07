# Base stage for installing dependencies and Python
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# Install bash, ffmpeg, and Python with necessary packages, ensure non-interactive mode
RUN apt-get update && \
    apt-get install -y bash ffmpeg python3 python3-pip python3-numpy python3-opencv libx264-dev --fix-missing 

# Determine the installed Python version and set PYTHONNET_PYDLL
RUN python_version=$(python3 -c "import sys; version=sys.version_info[:2]; print(f'{version[0]}.{version[1]}')") && \
    if [ "$(uname -m)" = "aarch64" ]; then \
        export PYTHONNET_PYDLL="/usr/local/lib/libpython${python_version}.dylib"; \
    else \
        export PYTHONNET_PYDLL="/usr/lib/x86_64-linux-gnu/libpython${python_version}.so"; \
    fi && \
    echo "PYTHONNET_PYDLL=${PYTHONNET_PYDLL}" > /etc/environment

# Load the environment variables set in /etc/environment
ENV PYTHONNET_PYDLL=$PYTHONNET_PYDLL

# Ensure ffmpeg and python are available in PATH and set LD_LIBRARY_PATH
ENV PATH="/usr/bin/ffmpeg:/usr/local/bin/python3.11:/usr/local/bin:${PATH}"
ENV LD_LIBRARY_PATH="/usr/local/lib:${LD_LIBRARY_PATH}"
ENV PYTHONNET_PYDLL="/usr/lib/x86_64-linux-gnu/libpython3.11.so"

# Check Python version
RUN python3 --version

# Build stage for .NET application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Debug
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["src/hosts/BackOfficeApi/BackOfficeApi.csproj", "src/hosts/BackOfficeApi/"]
COPY ["src/core/XabeFFMpegClient/XabeFFMpegClient.csproj", "src/core/XabeFFMpegClient/"]
COPY ["src/features/CerverusFeatures/CerverusFeatures.csproj", "src/features/CerverusFeatures/"]
COPY ["src/core/DomainCore/DomainCore.csproj", "src/core/DomainCore/"]
COPY ["src/core/MvcUtilities/MvcUtilities.csproj", "src/core/MvcUtilities/"]
COPY ["src/core/BackOfficePersistence/BackOfficePersistence.csproj", "src/core/BackOfficePersistence/"]
COPY ["src/core/MartenPersistence/MartenPersistence.csproj", "src/core/MartenPersistence/"]
COPY ["src/core/image-processing/PythonImageProcessor/PythonImageProcessor.csproj", "src/core/image-processing/PythonImageProcessor/"]
COPY ["src/features/CerverusMaintenance/CerverusMaintenance.csproj", "src/features/CerverusMaintenance/"]
COPY ["src/core/MaintenancePerisistence/MaintenancePerisistence.csproj", "src/core/MaintenancePerisistence/"]
RUN dotnet restore "src/hosts/BackOfficeApi/BackOfficeApi.csproj"
COPY . .
WORKDIR "/src/src/hosts/BackOfficeApi"
RUN dotnet build "BackOfficeApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Debug
RUN dotnet publish "BackOfficeApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose ports
EXPOSE 8080
EXPOSE 8081

# Entry point
ENTRYPOINT ["dotnet", "BackOfficeApi.dll"]
