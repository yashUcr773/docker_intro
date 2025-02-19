FROM nginx:1.27.0

RUN apt-get update
RUN apt-get install -y vim

# /usr/share/nginx/html/index.html
COPY index.html /usr/share/nginx/html/index.html

# docker build -t nginx:original .
# docker build -t nginx:changed .
# docker run -p 8080:80 nginx:original
# docker run -p 8081:80 nginx:changed