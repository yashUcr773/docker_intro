FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
COPY public ./public

RUN npm run build

FROM nginx

COPY --from=build /app/build /usr/share/nginx/html

# docker build -t react .
# docker run -p 8089:80 react