FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .
RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node","src/index.js"]
