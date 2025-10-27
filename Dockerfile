# Multi-stage build for efficient Docker image

# Stage 1: Build React frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
# Install build dependencies for native modules
RUN apt-get update && apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*
# Configure npm to not check SSL
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npm config set strict-ssl false
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup Node.js backend and serve frontend
FROM node:20-slim
WORKDIR /app

# Install build dependencies for native modules and curl for healthcheck
RUN apt-get update && apt-get install -y python3 make g++ curl && \
    rm -rf /var/lib/apt/lists/*
# Configure npm to not check SSL
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npm config set strict-ssl false

# Copy backend files
COPY backend/package*.json ./
RUN npm install --production

COPY backend/ ./

# Copy built frontend from previous stage
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV NODE_TLS_REJECT_UNAUTHORIZED=

# Start the application
CMD ["node", "server.js"]
