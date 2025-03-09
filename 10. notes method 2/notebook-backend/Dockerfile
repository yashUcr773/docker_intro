FROM node:22.12.0-alpine AS development
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm i
COPY . .
CMD ["npm", "run", "dev"]



FROM node:22.12.0-alpine AS prod-deps
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm i --only=production



FROM gcr.io/distroless/nodejs22 AS production
WORKDIR /app
COPY --from=prod-deps /app/node_modules node_modules
COPY src src
CMD ["src/index.js"]