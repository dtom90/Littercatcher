# Build stage for Next.js client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Build stage for Python API
FROM python:3.11-slim AS api-builder
WORKDIR /app/api
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim
WORKDIR /app

# Install Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy API files and install dependencies
COPY api/requirements.txt ./api/
RUN pip install --no-cache-dir -r api/requirements.txt
COPY api/ ./api/

# Copy datasets
COPY datasets/ ./datasets/

# Copy built Next.js client and install production dependencies
COPY --from=client-builder /app/client/package*.json ./client/
COPY --from=client-builder /app/client/.next ./client/.next
COPY --from=client-builder /app/client/public ./client/public
COPY --from=client-builder /app/client/next.config.ts ./client/
WORKDIR /app/client
RUN npm ci --only=production

# Set environment variables
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Expose ports for both client and API
EXPOSE 3000
EXPOSE 8000

# Start both services using a shell script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh
CMD ["/app/start.sh"]
