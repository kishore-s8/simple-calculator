# Stage 1: Build the application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists)
COPY package.json ./
COPY package-lock.json ./

# Install production dependencies
RUN if [ -f package-lock.json ]; then \
        npm ci --only=production; \
    else \
        npm install --only=production; \
    fi

# Copy the rest of the application files
COPY . .

# Remove unnecessary files to reduce size
RUN npm prune --production && \
    find node_modules -name "*.md" -o -name "*.ts" -o -name "test" -type d | xargs rm -rf && \
    find node_modules -name "*.map" -type f | xargs rm -rf

# Stage 2: Minimal runtime image
FROM node:18-alpine AS production

# Set working directory
WORKDIR /usr/src/app

# Copy the built application from the build stage
COPY --from=build /usr/src/app ./ 

# Remove any remaining unnecessary files
RUN rm -rf node_modules/.cache && \
    find . -type f \( -name "*.log" -o -name "*.md" -o -name "*.map" \) -delete

# Set environment variable (optional)
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["node", "server.js"]
