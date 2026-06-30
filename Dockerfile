# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the frontend (Vite) and compile the server (esbuild CJS)
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled build assets and CJS server bundle from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port (Cloud Run will override this dynamically with $PORT)
EXPOSE 3000

# Start the full-stack server
CMD ["npm", "start"]
