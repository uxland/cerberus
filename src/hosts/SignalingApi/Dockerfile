FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base

# Install system dependencies as root
USER root

RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-gi python3-gst-1.0 \
    gstreamer1.0-tools \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-libav \
    gir1.2-gst-plugins-base-1.0 gir1.2-gstreamer-1.0 \
    libgirepository1.0-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Now switch to your non-root user
ARG APP_UID
USER ${APP_UID}

WORKDIR /app
EXPOSE 8080
EXPOSE 8081
EXPOSE 3000
EXPOSE 20000-22000
EXPOSE 10000-10100

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Debug
WORKDIR /src
COPY ["src/hosts/SignalingApi/SignalingApi.csproj", "src/hosts/SignalingApi/"]
COPY ["src/core/DomainCore/DomainCore.csproj", "src/core/DomainCore/"]
RUN dotnet restore "src/hosts/SignalingApi/SignalingApi.csproj"
COPY . .
WORKDIR "/src/src/hosts/SignalingApi"
RUN dotnet build "SignalingApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Debug
RUN dotnet publish "SignalingApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SignalingApi.dll"]