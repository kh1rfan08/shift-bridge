# Stage 1: Build client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json* ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Server
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache python3 make g++

COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install --production

COPY server/ ./server/
COPY --from=client-build /app/client/dist ./client/dist

RUN mkdir -p /app/data

EXPOSE 3000
CMD ["node", "server/index.js"]
