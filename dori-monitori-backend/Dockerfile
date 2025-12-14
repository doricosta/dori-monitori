FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY dori-monitori-backend/package*.json ./
RUN npm ci

FROM base AS production-deps
WORKDIR /app
COPY dori-monitori-backend/package*.json ./
RUN npm ci --omit=dev

# Frontend Build Stage
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY dori-monitori-frontend/package*.json ./
RUN npm ci
COPY dori-monitori-frontend .
# Set API URL to /api for Nginx proxying
ENV VITE_API_BASE_URL=/api
RUN npm run build

# Backend Build Stage
FROM node:20.12.2-alpine3.18 AS build
WORKDIR /app
COPY dori-monitori-backend/package*.json dori-monitori-backend/package-lock.json ./
RUN npm ci
COPY dori-monitori-backend .
RUN node ace build

# Production Stage
FROM node:20.12.2-alpine3.18 AS production

# Install Nginx and Supervisor
RUN apk add --no-cache nginx supervisor

WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build .
# Copy frontend build to public directory
COPY --from=frontend-build /app/dist /app/public

# Copy Nginx and Supervisor configs
COPY dori-monitori-backend/nginx.conf /etc/nginx/http.d/default.conf
COPY dori-monitori-backend/supervisord.conf /etc/supervisord.conf

# Create directory for nginx pid
RUN mkdir -p /run/nginx

EXPOSE 4318 8081

# Start Supervisor
CMD ["sh", "-lc", "echo 'Running migrations...' && node bin/console.js migration:run --force && echo 'Running clickhouse setup...' && node bin/console.js clickhouse:setup && echo 'Running initial setup...' && node bin/console.js setup:initial_user && echo 'Starting services...' && /usr/bin/supervisord -c /etc/supervisord.conf"]
