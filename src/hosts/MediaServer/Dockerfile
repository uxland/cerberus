# Use Node.js 22 as base image
FROM node:22

# Install FFmpeg for RTSP streaming
RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip python3-numpy python3-opencv libx264-dev --fix-missing && rm -rf /var/lib/apt/lists/*

RUN apt-get update && \
    apt-get  install  -y net-tools tcpdump

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY src/hosts/MediaServer/package.json  ./
COPY src/hosts/MediaServer/package-lock.json  ./
RUN npm install

# Copy MediaSoup server files
COPY src/hosts/MediaServer/ .

COPY src/hosts/MediaServer/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose ports for WebRTC and RTP
EXPOSE 3000 5004 5005 6000-6200/udp

# Start MediaSoup server and FFmpeg at container startup
CMD ["/entrypoint.sh"]