FROM node:22.12.0-alpine

WORKDIR /app

COPY index.js /app

COPY package.json /app
COPY package-lock.json /app


RUN npm install

CMD [ "node", "index.js" ]
# docker build -t express .
# docker run -p 3000:3000 express