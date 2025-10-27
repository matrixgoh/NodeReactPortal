# Multi-stage build for efficient Docker image

# Stage 1: Build React frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup Node.js backend and serve frontend
FROM node:20-slim
WORKDIR /app

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

# Start the application
CMD ["node", "server.js"]
