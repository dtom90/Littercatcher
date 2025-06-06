#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Building LitterCatcher Docker image...${NC}"
docker build -t littercatcher .

# Check if build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Build successful!${NC}"
    
    # Check if container is already running
    if [ "$(docker ps -q -f name=littercatcher)" ]; then
        echo -e "${RED}Container is already running. Stopping it first...${NC}"
        docker stop littercatcher
        docker rm littercatcher
    fi
    
    echo -e "${GREEN}Starting LitterCatcher container...${NC}"
    docker run -it --rm \
        --name littercatcher \
        -p 3000:3000 \
        -p 8000:8000 \
        littercatcher
else
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi
