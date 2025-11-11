# ---------- Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat

# Public assets
COPY --from=builder /app/public ./public

# Standalone server output (server.js + minimal node_modules)
COPY --from=builder /app/.next/standalone ./

# Copy static bundles AFTER standalone so they aren’t overwritten
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
