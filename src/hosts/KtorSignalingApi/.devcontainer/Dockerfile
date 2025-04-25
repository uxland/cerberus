FROM mcr.microsoft.com/devcontainers/base:debian

# Update package lists and install required packages
RUN apt-get update && apt-get -y install apt-transport-https ca-certificates && apt-get clean

# Install GStreamer core and basic plugins
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    gstreamer1.0-tools \
    gstreamer1.0-plugins-base \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install additional GStreamer plugins
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install more GStreamer plugins and development libraries
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-libav \
    libgstreamer1.0-dev \
    libgstreamer-plugins-base1.0-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Note: Development packages for GStreamer plugins-good and plugins-bad
# are not available in standard Debian repositories
# The runtime packages are already installed above

# Install additional development tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    build-essential \
    pkg-config \
    git \
    curl \
    wget \
    unzip \
    zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a symbolic link for /bin/java to ensure compatibility
RUN mkdir -p /bin && ln -sf /usr/lib/jvm/msopenjdk-current/bin/java /bin/java

# Set up a non-root user
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Create the user if it doesn't exist
RUN if ! id -u $USERNAME > /dev/null 2>&1; then \
    groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* ; \
    fi
