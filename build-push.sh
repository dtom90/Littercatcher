#!/bin/bash
set -e

# require version number as argument
if [ -z "$1" ]; then
    echo "Usage: $0 <version> Current images:"
    docker images | grep us-south1-docker.pkg.dev/prospekt-studio/littercatcher/littercatcher-prod
    exit 1
fi

version=$1

# build for linux/amd64
docker buildx build --platform linux/amd64 -t littercatcher-prod:${version} .

docker tag littercatcher-prod:${version} us-south1-docker.pkg.dev/prospekt-studio/littercatcher/littercatcher-prod:${version}

docker push us-south1-docker.pkg.dev/prospekt-studio/littercatcher/littercatcher-prod:${version}

echo "Pushed littercatcher-prod:${version} to us-south1-docker.pkg.dev/prospekt-studio/littercatcher/littercatcher-prod:${version}"
