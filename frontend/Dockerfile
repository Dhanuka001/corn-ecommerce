# ---------- 1) Build stage (has dev tools, compiles Next) ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Only copy package files first to leverage Docker layer caching
COPY package*.json ./
RUN npm ci

# Now copy the rest of your source code
COPY . .

# Build Next.js in "standalone" mode (creates a minimal Node app)
RUN npm run build

# ---------- 2) Runtime stage (small, production only) ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Next.js standalone output produces a minimal server.js
# Copy only what is needed at runtime (keeps image small)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public

# Some Next/image native deps need this on Alpine
RUN apk add --no-cache libc6-compat

EXPOSE 3000
CMD ["node", "server.js"]
