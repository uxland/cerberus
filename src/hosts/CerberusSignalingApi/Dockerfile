FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

# 3. Now install Ubuntu Python + GStreamer normally
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-gi python3-gst-1.0 \
    gstreamer1.0-tools \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-libav \
    libgirepository1.0-dev \
    gir1.2-gstreamer-1.0 \
    gir1.2-gst-plugins-base-1.0 \
    gir1.2-gst-plugins-bad-1.0 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Stage 1: Build .NET app
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Debug
WORKDIR /src
COPY ["src/hosts/CerberusSignalingApi/CerberusSignalingApi.csproj", "src/hosts/CerberusSignalingApi/"]
COPY ["src/core/DomainCore/DomainCore.csproj", "src/core/DomainCore/"]
COPY ["src/core/KeycloakClient/KeycloakClient.csproj", "src/core/KeycloakClient/"]
RUN dotnet restore "src/hosts/CerberusSignalingApi/CerberusSignalingApi.csproj"
COPY . .
WORKDIR "/src/src/hosts/CerberusSignalingApi"
RUN dotnet build "CerberusSignalingApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Debug
RUN dotnet publish "CerberusSignalingApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false


FROM base AS final
# App directory
WORKDIR /app
# Copy published app from build stage
COPY --from=publish /app/publish .
COPY src/hosts/CerberusSignalingApi/webrtcbin_worker.py .
ENTRYPOINT ["dotnet", "CerberusSignalingApi.dll"]