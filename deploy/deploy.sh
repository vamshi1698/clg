#!/bin/bash
set -e

# Deployment script for Next.js College App
echo "🚀 Starting deployment..."

cd /opt/college

# Check if image file exists
if [ -f "college-app.tar" ]; then
    echo "📦 Loading new Docker image..."
    docker load -i college-app.tar
    # Clean up tar file after loading to save space
    rm college-app.tar
else
    echo "ℹ️ No local image tar found. Assuming image is already built or loaded."
fi

echo "🔄 Stopping old container..."
# Stop the web container gracefully. Data in DB/Redis and Uploads is preserved via volumes.
docker-compose stop web || true
docker-compose rm -f web || true

echo "🚢 Starting new container..."
docker-compose up -d web

echo "🧹 Cleaning up unused Docker images..."
docker image prune -f

echo "✅ Deployment complete! Check logs with: docker-compose logs -f web"
