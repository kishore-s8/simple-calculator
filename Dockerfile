# Stage 1: Build the application
FROM node:18-alpine AS build

# Set environment variable to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Install the latest npm version (if needed)
RUN npm install -g npm@latest

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install only production dependencies (modern alternative to --only=production)
RUN npm ci --omit=dev

# Copy the rest of the application files
COPY . .

# Clean up unnecessary files to reduce size
RUN npm prune --production && \
    find node_modules -name "*.md" -o -name "*.ts" -o -name "test" -type d | xargs rm -rf && \
    find node_modules -name "*.map" -type f | xargs rm -rf

# Stage 2: Minimal runtime image
FROM node:18-alpine AS production

# Set environment variable to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy the built application from the build stage
COPY --from=build /usr/src/app ./ 

# Remove any remaining unnecessary files
RUN rm -rf node_modules/.cache && \
    find . -type f \( -name "*.log" -o -name "*.md" -o -name "*.map" \) -delete

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
