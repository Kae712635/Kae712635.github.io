# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup the Express backend and serve
FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Copy the built frontend static files to the backend
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose the backend port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the server (which also serves the frontend)
CMD ["node", "server.js"]
