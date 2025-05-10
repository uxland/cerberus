FROM ubuntu

# Set environment variables to avoid interactive prompts during install
ENV DEBIAN_FRONTEND=noninteractive

# GStreamer runtime and plugin support
RUN apt update && \
    apt install -y \
    gstreamer1.0-tools \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-rtsp \
    gstreamer1.0-libav




# Network utilities
RUN apt-get update && \
    apt-get install -y net-tools iputils-ping iproute2 curl

# Node.js 22 from NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

EXPOSE 3000
EXPOSE 20000-60000
EXPOSE 10000-10100
