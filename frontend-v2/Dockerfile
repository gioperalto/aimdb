# Stage 1: Build the Vite application
FROM node:23.9.0-alpine AS builder

WORKDIR /app

COPY frontend-v2/package.json frontend-v2/package-lock.json ./
RUN npm ci

COPY frontend-v2/. .
RUN npm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Add a custom Nginx configuration if needed (e.g., for React Router)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ARG VITE_API_BASE_URL="API_URL_PLACEHOLDER"

CMD ["nginx", "-g", "daemon off;"]