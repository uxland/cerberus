#!/bin/bash
set -e

# Function to retry commands
retry() {
    local n=1
    local max=5
    local delay=5
    while true; do
        "$@" && break || {
            if [[ $n -lt $max ]]; then
                ((n++))
                echo "Command failed. Attempt $n/$max:"
                sleep $delay;
            else
                echo "The command has failed after $n attempts."
                return 1
            fi
        }
    done
}

# Use a different Debian mirror
sed -i 's|http://deb.debian.org/debian|http://ftp.debian.org/debian|g' /etc/apt/sources.list

# Update and install packages with retries
retry apt-get update
retry DEBIAN_FRONTEND=noninteractive apt-get install -y ffmpeg python3 python3-pip --fix-missing

# Install Python packages
retry pip3 install numpy opencv-python-headless
