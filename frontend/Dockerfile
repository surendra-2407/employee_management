# ==========================================
# Stage 1: Build the React Application
# ==========================================
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Install dependencies first for Docker layer caching
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Build production bundle
RUN npm run build

# ==========================================
# Stage 2: Serve with Nginx Alpine
# ==========================================
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from build stage
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port 80
EXPOSE 80

# Health check to ensure nginx is serving requests
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
