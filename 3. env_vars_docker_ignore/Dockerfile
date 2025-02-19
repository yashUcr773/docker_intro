FROM node:22.12.0-alpine

WORKDIR /app

COPY . .

RUN npm install

CMD ["node", "index.js"]

# docker build -t express .
# docker run -p 9000:9000 -d --env-file .env express
# docker run -e PORT=2020 -e APP_NAME=111 -p 2020:2020 express