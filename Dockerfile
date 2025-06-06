# Build stage for Next.js client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app/client

# Copy built Next.js client and install production dependencies
COPY --from=client-builder /app/client/package*.json ./
COPY --from=client-builder /app/client/.next ./.next
COPY --from=client-builder /app/client/public ./public
COPY --from=client-builder /app/client/next.config.ts ./
RUN npm ci --only=production

# Set environment variables
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Expose port for client
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
