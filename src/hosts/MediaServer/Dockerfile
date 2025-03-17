# Use Node.js 22 as base image
FROM node:22

# Install FFmpeg for RTSP streaming
RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip python3-numpy python3-opencv libx264-dev --fix-missing 

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY src/hosts/MediaServer/package.json  ./
COPY src/hosts/MediaServer/package-lock.json  ./
RUN npm install

# Copy MediaSoup server files
COPY src/hosts/MediaServer/ .

# Expose ports for WebRTC and RTP
EXPOSE 3000 5004 5005 6000-6200/udp

# Start MediaSoup server and FFmpeg at container startup
CMD ["sh", "-c", "node server.js & ffmpeg -rtsp_transport tcp -i 'rtsp://test:Test2025@80.37.229.214:39887/Streaming/Channels/102?transportmode=unicast' -vf 'scale=1280:720' -vcodec libx264 -preset ultrafast -tune zerolatency -g 30 -r 30 -pix_fmt yuv420p -b:v 1500k -bufsize 1500k -acodec opus -ar 48000 -b:a 64k -ac 2 -f rtp rtp://127.0.0.1:5004"]
