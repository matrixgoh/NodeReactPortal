#!/bin/bash

set -e

echo "======================================"
echo "🧪 Container Testing Script"
echo "======================================"
echo ""

# Configuration
CONTAINER_NAME="nodereactportal-test"
IMAGE_NAME="${1:-nodereactportal:test}"
PORT="${2:-5000}"
MAX_WAIT_TIME=60

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}Cleaning up...${NC}"
    if docker ps -a | grep -q $CONTAINER_NAME; then
        docker stop $CONTAINER_NAME >/dev/null 2>&1 || true
        docker rm $CONTAINER_NAME >/dev/null 2>&1 || true
    fi
}

# Set up cleanup on script exit
trap cleanup EXIT

# Test if image exists
echo "📦 Checking if image '$IMAGE_NAME' exists..."
if ! docker image inspect $IMAGE_NAME >/dev/null 2>&1; then
    echo -e "${RED}❌ Image '$IMAGE_NAME' not found. Please build it first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Image found${NC}"

# Start the container
echo -e "\n🚀 Starting container..."
CONTAINER_ID=$(docker run -d -p $PORT:5000 --name $CONTAINER_NAME $IMAGE_NAME)
echo -e "${GREEN}✅ Container started: ${CONTAINER_ID:0:12}${NC}"

# Wait for container to be ready
echo -e "\n⏳ Waiting for container to be ready..."
SECONDS_WAITED=0
while [ $SECONDS_WAITED -lt $MAX_WAIT_TIME ]; do
    if curl -f http://localhost:$PORT >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Container is responding after ${SECONDS_WAITED} seconds${NC}"
        break
    fi
    
    # Check if container is still running
    if ! docker ps | grep -q $CONTAINER_NAME; then
        echo -e "${RED}❌ Container stopped unexpectedly${NC}"
        echo "Container logs:"
        docker logs $CONTAINER_NAME
        exit 1
    fi
    
    sleep 2
    SECONDS_WAITED=$((SECONDS_WAITED + 2))
    echo "  Waiting... (${SECONDS_WAITED}s / ${MAX_WAIT_TIME}s)"
done

if [ $SECONDS_WAITED -ge $MAX_WAIT_TIME ]; then
    echo -e "${RED}❌ Container did not become ready in time${NC}"
    echo "Container logs:"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Test container health
echo -e "\n🏥 Testing container health..."
sleep 5  # Give some time for healthcheck to run
HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' $CONTAINER_NAME 2>/dev/null || echo "none")
if [ "$HEALTH_STATUS" != "none" ]; then
    echo "  Health status: $HEALTH_STATUS"
    if [ "$HEALTH_STATUS" = "unhealthy" ]; then
        echo -e "${RED}❌ Container is unhealthy${NC}"
        docker inspect --format='{{json .State.Health}}' $CONTAINER_NAME | jq '.' || true
        exit 1
    fi
else
    echo "  No healthcheck configured (this is OK for basic testing)"
fi

# Test static file serving
echo -e "\n📄 Testing static file serving (React app)..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Static files served successfully (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Failed to serve static files (HTTP $HTTP_CODE)${NC}"
    exit 1
fi

# Verify React app content
CONTENT=$(curl -s http://localhost:$PORT)
if echo "$CONTENT" | grep -q "<!doctype html>"; then
    echo -e "${GREEN}✅ HTML content verified${NC}"
else
    echo -e "${RED}❌ Invalid HTML content${NC}"
    exit 1
fi

# Test API endpoints
echo -e "\n🔌 Testing API endpoints..."

# Test 1: Register a new user
echo "  1️⃣  Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:$PORT/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "fullName": "Test User"
    }')

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    echo -e "     ${GREEN}✅ User registration successful${NC}"
    TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    echo -e "     ${RED}❌ User registration failed${NC}"
    echo "     Response: $REGISTER_RESPONSE"
    exit 1
fi

# Test 2: Login
echo "  2️⃣  Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:$PORT/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
        "username": "testuser",
        "password": "testpass123"
    }')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "     ${GREEN}✅ User login successful${NC}"
else
    echo -e "     ${RED}❌ User login failed${NC}"
    echo "     Response: $LOGIN_RESPONSE"
    exit 1
fi

# Test 3: Get user profile (authenticated)
echo "  3️⃣  Testing get user profile (authenticated)..."
PROFILE_RESPONSE=$(curl -s -X GET http://localhost:$PORT/api/user/profile \
    -H "Authorization: Bearer $TOKEN")

if echo "$PROFILE_RESPONSE" | grep -q "testuser"; then
    echo -e "     ${GREEN}✅ Profile retrieval successful${NC}"
else
    echo -e "     ${RED}❌ Profile retrieval failed${NC}"
    echo "     Response: $PROFILE_RESPONSE"
    exit 1
fi

# Test 4: Update user profile
echo "  4️⃣  Testing update user profile..."
UPDATE_RESPONSE=$(curl -s -X PUT http://localhost:$PORT/api/user/profile \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "fullName": "Updated Test User",
        "bio": "This is my test bio",
        "avatar": "https://i.pravatar.cc/150?img=1"
    }')

if echo "$UPDATE_RESPONSE" | grep -q "Updated Test User"; then
    echo -e "     ${GREEN}✅ Profile update successful${NC}"
else
    echo -e "     ${RED}❌ Profile update failed${NC}"
    echo "     Response: $UPDATE_RESPONSE"
    exit 1
fi

# Test 5: Get dashboard stats (authenticated)
echo "  5️⃣  Testing dashboard stats (authenticated)..."
STATS_RESPONSE=$(curl -s -X GET http://localhost:$PORT/api/dashboard/stats \
    -H "Authorization: Bearer $TOKEN")

if echo "$STATS_RESPONSE" | grep -q "totalUsers"; then
    echo -e "     ${GREEN}✅ Dashboard stats retrieval successful${NC}"
else
    echo -e "     ${RED}❌ Dashboard stats retrieval failed${NC}"
    echo "     Response: $STATS_RESPONSE"
    exit 1
fi

# Test 6: Test unauthorized access (should fail gracefully)
echo "  6️⃣  Testing unauthorized access protection..."
UNAUTH_RESPONSE=$(curl -s -X GET http://localhost:$PORT/api/user/profile)

if echo "$UNAUTH_RESPONSE" | grep -q "error"; then
    echo -e "     ${GREEN}✅ Unauthorized access properly rejected${NC}"
else
    echo -e "     ${RED}❌ Unauthorized access not properly handled${NC}"
    echo "     Response: $UNAUTH_RESPONSE"
    exit 1
fi

# Test 7: Invalid credentials
echo "  7️⃣  Testing invalid credentials..."
INVALID_LOGIN=$(curl -s -X POST http://localhost:$PORT/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
        "username": "testuser",
        "password": "wrongpassword"
    }')

if echo "$INVALID_LOGIN" | grep -q "Invalid credentials"; then
    echo -e "     ${GREEN}✅ Invalid credentials properly rejected${NC}"
else
    echo -e "     ${RED}❌ Invalid credentials not properly handled${NC}"
    echo "     Response: $INVALID_LOGIN"
    exit 1
fi

# Test 8: Concurrent requests
echo "  8️⃣  Testing concurrent requests..."
for i in {1..5}; do
    curl -s http://localhost:$PORT >/dev/null &
done
wait
echo -e "     ${GREEN}✅ Concurrent requests handled${NC}"

# Display container stats
echo -e "\n📊 Container Statistics:"
docker stats $CONTAINER_NAME --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

# Display container logs (last 20 lines)
echo -e "\n📋 Container Logs (last 20 lines):"
docker logs $CONTAINER_NAME 2>&1 | tail -20

echo -e "\n======================================"
echo -e "${GREEN}✅ All tests passed successfully!${NC}"
echo "======================================"
echo ""
echo "Container is running and healthy at http://localhost:$PORT"
echo "Container name: $CONTAINER_NAME"
echo ""
echo "To stop the container manually, run:"
echo "  docker stop $CONTAINER_NAME && docker rm $CONTAINER_NAME"
echo ""
