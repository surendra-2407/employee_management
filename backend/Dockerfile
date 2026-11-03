# Use lightweight official Node.js Alpine image
FROM node:20-alpine

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

# Healthcheck to verify the backend is running and responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start Node.js application
CMD ["node", "src/server.js"]
