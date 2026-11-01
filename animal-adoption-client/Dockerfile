# Multi-stage build for the Angular client, served by nginx.

# --- build stage: produce the static SPA bundle ---
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- runtime stage: nginx serves the SPA and proxies /api + /uploads ---
FROM nginx:1.27-alpine AS runtime
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/animal-adoption-client/browser /usr/share/nginx/html
EXPOSE 80
