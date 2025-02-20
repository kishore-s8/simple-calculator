# Stage 1: Build the application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /usr/src/app

Copy only necessary files for dependencies
COPY package*.json ./

# Install production dependencies
RUN npm install && npm ci --only=production


# Copy the rest of the application files
COPY . .

# # Clean up unnecessary files to reduce size
RUN npm prune --production && \
    find node_modules -name "*.md" -o -name "*.ts" -o -name "test" -type d | xargs rm -rf && \
    find node_modules -name "*.map" -type f | xargs rm -rf

# Stage 2: Minimal runtime image
FROM alpine:3.18 AS production

# Install Node.js runtime only (exclude npm)
RUN apk add --no-cache --update nodejs npm && \
    npm install -g npm@10 && \
    rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /usr/src/app

# Copy the built application from the build stage
COPY --from=build /usr/src/app ./ 

# Remove any remaining unnecessary files
RUN rm -rf node_modules/.cache && \
    find . -type f \( -name "*.log" -o -name "*.md" -o -name "*.map" \) -delete

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["node", "server.js"]
