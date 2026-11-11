# Use lightweight Debian-based Node.js image for high stability across cgroups/WSL2
FROM node:20-slim

# Install wget for healthcheck compatibility
RUN apt-get update && apt-get install -y --no-install-recommends wget && rm -rf /var/lib/apt/lists/*

# Set working directory inside container
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Bundle app source code
COPY . .

# Expose backend server port
EXPOSE 5000

# Set environment defaults
ENV PORT=5000
ENV NODE_ENV=production

# Healthcheck using Node.js native fetch to verify backend is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Start Node.js application
CMD ["node", "src/server.js"]

