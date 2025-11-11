# If you later use TypeScript, we’ll add a build stage. For now JS only.
FROM node:20-alpine
WORKDIR /app

# Install prod deps only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy your source
COPY . .

EXPOSE 8080
CMD ["node", "src/index.js"]
