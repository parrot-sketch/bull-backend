# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Install OpenSSL and other required dependencies
RUN apk add --no-cache openssl openssl-dev libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/gateway/health || exit 1

# Start the application
CMD ["npm", "run", "start:prod"]
