# Container Testing Guide

This document provides detailed information about testing the NodeReactPortal Docker container to ensure it's working correctly before deployment.

## Overview

The repository includes a comprehensive testing script (`test-container.sh`) that validates:
- Container startup and initialization
- Static file serving (React app)
- All API endpoints functionality
- Authentication and authorization
- Error handling
- Concurrent request handling
- Container health monitoring

## Quick Start

### Test a Docker Image

```bash
# Build the image
docker build -t nodereactportal:test .

# Run comprehensive tests
./test-container.sh nodereactportal:test 5000
```

### Test with Docker Compose

```bash
# Start the container with docker-compose
docker compose up -d

# Wait for healthcheck to pass
sleep 15

# Check health status
docker inspect nodereactportal-app-1 --format='{{.State.Health.Status}}'

# Test API endpoints
curl http://localhost:5000
```

## Test Script Details

The `test-container.sh` script performs the following tests:

### 1. Container Startup (⏳)
- Validates image exists
- Starts container on specified port
- Waits up to 60 seconds for container to respond
- Monitors container status

### 2. Health Check (🏥)
- Verifies Docker healthcheck status if configured
- Checks container is in "healthy" state

### 3. Static File Serving (📄)
- Tests HTTP response code (expects 200)
- Validates HTML content is served correctly
- Confirms React app bundle is accessible

### 4. API Endpoint Tests (🔌)

#### Test 1: User Registration
```bash
POST /api/auth/register
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "fullName": "Test User"
}
```
**Expected**: 201 status, JWT token returned

#### Test 2: User Login
```bash
POST /api/auth/login
{
    "username": "testuser",
    "password": "testpass123"
}
```
**Expected**: 200 status, JWT token and user info returned

#### Test 3: Get User Profile (Authenticated)
```bash
GET /api/user/profile
Authorization: Bearer <token>
```
**Expected**: 200 status, user profile data returned

#### Test 4: Update User Profile
```bash
PUT /api/user/profile
Authorization: Bearer <token>
{
    "fullName": "Updated Test User",
    "bio": "This is my test bio",
    "avatar": "https://i.pravatar.cc/150?img=1"
}
```
**Expected**: 200 status, updated profile returned

#### Test 5: Dashboard Stats (Authenticated)
```bash
GET /api/dashboard/stats
Authorization: Bearer <token>
```
**Expected**: 200 status, statistics object returned

#### Test 6: Unauthorized Access Protection
```bash
GET /api/user/profile
# No Authorization header
```
**Expected**: 401 status, error message returned

#### Test 7: Invalid Credentials
```bash
POST /api/auth/login
{
    "username": "testuser",
    "password": "wrongpassword"
}
```
**Expected**: 401 status, "Invalid credentials" error

#### Test 8: Concurrent Requests
- Sends 5 simultaneous HTTP requests
- Validates server handles load correctly

### 5. Container Monitoring (📊)
- Displays CPU and memory usage
- Shows network I/O statistics
- Captures last 20 lines of container logs

## Manual Testing

### Test PWD Deployment Locally

Simulate Play-with-Docker environment:

```bash
# Pull the GHCR image
docker pull ghcr.io/matrixgoh/nodereactportal:latest

# Run with the same configuration as PWD
docker run -d -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e JWT_SECRET=test-secret \
  ghcr.io/matrixgoh/nodereactportal:latest

# Wait for container to start
sleep 5

# Test the container
curl http://localhost:5000
```

### Test with Docker Compose (PWD Stack)

```bash
# Use the GHCR compose file
curl -O https://raw.githubusercontent.com/matrixgoh/NodeReactPortal/main/docker-compose.ghcr.yml

# Start the stack
docker compose -f docker-compose.ghcr.yml up -d

# Check health
docker compose -f docker-compose.ghcr.yml ps

# Test endpoints
curl http://localhost:5000
```

## Healthcheck Details

The container includes a healthcheck that runs every 30 seconds:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:5000"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**What it does:**
- Uses `curl` to check if port 5000 responds
- Waits 40 seconds before starting checks (gives app time to initialize)
- Checks every 30 seconds
- Allows 3 failures before marking unhealthy
- Each check times out after 10 seconds

**Check health status:**
```bash
docker inspect <container-name> --format='{{.State.Health.Status}}'
```

## Troubleshooting

### Container Fails to Start

1. Check logs:
```bash
docker logs <container-name>
```

2. Verify port is not in use:
```bash
netstat -tuln | grep 5000
```

3. Check environment variables:
```bash
docker inspect <container-name> --format='{{.Config.Env}}'
```

### Healthcheck Failing

1. Check if curl is installed in container:
```bash
docker exec <container-name> which curl
```

2. Manually test healthcheck command:
```bash
docker exec <container-name> curl -f http://localhost:5000
```

3. View healthcheck logs:
```bash
docker inspect <container-name> --format='{{json .State.Health}}' | jq
```

### API Tests Failing

1. Verify server is running:
```bash
docker exec <container-name> ps aux | grep node
```

2. Check server logs:
```bash
docker logs <container-name> -f
```

3. Test connectivity:
```bash
curl -v http://localhost:5000
```

## CI/CD Integration

The GitHub Actions workflow automatically runs comprehensive tests on every build:

```yaml
- name: Run comprehensive Docker container tests
  run: |
    IMAGE_TAG=$(echo "${{ steps.meta.outputs.tags }}" | head -n 1)
    docker pull "${IMAGE_TAG}"
    chmod +x ./test-container.sh
    ./test-container.sh "${IMAGE_TAG}" 5000
```

This ensures:
- Every pushed image is validated
- All API endpoints work correctly
- Container starts and stays healthy
- Authentication and authorization work
- Error handling is correct

## Best Practices

1. **Always test locally before pushing**: Run `./test-container.sh` before committing changes
2. **Monitor CI/CD tests**: Check GitHub Actions output for any failures
3. **Test in PWD before announcing**: Deploy to Play-with-Docker manually to verify
4. **Check healthcheck status**: Ensure containers report "healthy" status
5. **Review logs**: Always check container logs for warnings or errors

## Support

If tests fail or you encounter issues:

1. Review this testing guide
2. Check container logs: `docker logs <container-name>`
3. Verify all dependencies are installed
4. Ensure port 5000 is available
5. Check environment variables are set correctly
6. Review GitHub Actions workflow output

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Play-with-Docker](https://labs.play-with-docker.com/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
