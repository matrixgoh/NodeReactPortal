#!/bin/bash

echo "🚀 NodeReactPortal - Starting Application"
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""
echo "Building and starting the application..."
echo ""

# Build and start the container
docker-compose up --build

echo ""
echo "🎉 Application is running at http://localhost:5000"
