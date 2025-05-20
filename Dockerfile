# Stage 1: Build the application
FROM node:18-alpine AS build

# Update package index and install native build tools
RUN apk update && apk add --no-cache python3 make g++

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for better cache
COPY package.json package-lock.json ./

# Ensure correct ownership (optional)
RUN chown -R node:node /usr/src/app
USER node

# Install only production dependencies
RUN npm ci --only=production || npm install --only=production

# Copy the rest of the application files
COPY --chown=node:node . .

# Clean up unnecessary files to reduce image size
RUN npm prune --production && \
    find node_modules -name "*.md" -o -name "*.ts" -o -name "test" -type d | xargs rm -rf && \
    find node_modules -name "*.map" -type f | xargs rm -rf

# Stage 2: Minimal runtime image
FROM node:18-alpine AS production

WORKDIR /usr/src/app

# Copy only the final built app
COPY --from=build /usr/src/app .

# Optional cleanup
RUN rm -rf node_modules/.cache && \
    find . -type f \( -name "*.log" -o -name "*.md" -o -name "*.map" \) -delete

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
