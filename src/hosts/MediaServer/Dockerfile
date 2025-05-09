FROM ubuntu

# Set environment variables to avoid interactive prompts during install
ENV DEBIAN_FRONTEND=noninteractive

# Base scientific and media tools
RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip python3-numpy python3-opencv libx264-dev --fix-missing && \
    rm -rf /var/lib/apt/lists/*

# GStreamer runtime and plugin support
RUN apt update && \
    apt install -y \
    gstreamer1.0-tools \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-rtsp \
    gstreamer1.0-libav


# GStreamer development headers + GObject Introspection bindings
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    g++ \
    libgirepository1.0-dev \
    gir1.2-glib-2.0 \
    gir1.2-gstreamer-1.0 \
    gir1.2-gst-plugins-base-1.0 \
    libgstreamer1.0-dev \
    libgstreamer-plugins-base1.0-dev


# Network utilities
RUN apt-get update && \
    apt-get install -y net-tools iputils-ping iproute2 curl

# Node.js 22 from NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

EXPOSE 3000
EXPOSE 20000-60000
EXPOSE 10000-10100
