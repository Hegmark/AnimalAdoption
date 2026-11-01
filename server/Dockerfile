# Multi-stage build for the Express/TypeScript API.

# --- build stage: compile TS -> build/ (includes build/seed.js) ---
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# --- runtime stage: production deps only, non-root ---
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/build ./build
# uploads is provided at runtime via a volume (bind mount in dev, named volume in prod)
RUN mkdir -p uploads && chown -R node:node /app
USER node
EXPOSE 5000
CMD ["node", "build/index.js"]
