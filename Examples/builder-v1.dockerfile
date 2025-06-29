FROM node:18.16.1-alpine3.17

WORKDIR /app

# install standard dependencies
RUN apk update && \
    apk upgrade && \
    apk add --no-cache git g++ gcc libgcc libstdc++ linux-headers make curl jq python3 py3-pip py-yaml && \
    pip install awscli && \
    apk update && \
    npm install -g bower && \
    npm install -g gulp


COPY package.json .
COPY package-lock.json .
COPY bower.json .
COPY gulpfile.js .
COPY .bowerrc .
COPY .editorconfig .
COPY .gitignore .
COPY ./gulp ./gulp
COPY ./src/server ./src/server

RUN npm cache clean --force && npm install

COPY . .

CMD [ "gulp", "serve" ]

# docker build -t builder-v1 -f Dockerfile.dev .
# docker run --rm -it --env-file .env -p 8080:8080 -v ${pwd}/src/app:/app/src/app   -e CHOKIDAR_USEPOLLING=true -e CHOKIDAR_INTERVAL=100 -e CHOKIDAR_BINARY_INTERVAL=300 builder-v1
