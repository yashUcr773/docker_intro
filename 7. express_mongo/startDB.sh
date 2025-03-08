
# docker run --name mongodb -d mongodb/mongodb-community-server:7.0-ubuntu2204
# docker exec -it mongodb mongosh

MONGO_IMAGE="mongodb/mongodb-community-server"
MONGO_TAG="7.0-ubuntu2204"
CONTAINER_NAME="mongodb"

ROOT_USER="root-user"
ROOT_PASSWORD="root-password"

KEY_VALUE_DB="key-value-db"
KEY_VALUE_USER="key-value-user"
KEY_VALUE_PASSWORD="key-value-password"

LOCALHOST_PORT=27017
CONTAINER_PORT=27017

NETWORK_NAME='key-value-network'

VOLUME_NAME="key-value-data"
CONTAINER_VOLUME_PATH="/data/db"

docker stop $CONTAINER_NAME

docker volume remove  $VOLUME_NAME
docker network remove  $NETWORK_NAME

docker network create $NETWORK_NAME
docker volume create $VOLUME_NAME


docker run --name $CONTAINER_NAME --rm  \
    -e MONGO_INITDB_DATABASE=admin \
    -e MONGODB_INITDB_ROOT_USERNAME=$ROOT_USER \
    -e MONGODB_INITDB_ROOT_PASSWORD=$ROOT_PASSWORD \
    -e KEY_VALUE_DB=$KEY_VALUE_DB \
    -e KEY_VALUE_USER=$KEY_VALUE_USER \
    -e KEY_VALUE_PASSWORD=$KEY_VALUE_PASSWORD \
    -p $LOCALHOST_PORT:$CONTAINER_PORT \
    -v $VOLUME_NAME:$CONTAINER_VOLUME_PATH \
    -v ./db/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js \
    --network $NETWORK_NAME \
    $MONGO_IMAGE:$MONGO_TAG

# docker run --rm -d --name  mongodb -e MONGO_INITDB_DATABASE=admin -e MONGODB_INITDB_ROOT_USERNAME=root-user -e MONGODB_INITDB_ROOT_PASSWORD=root-password -e KEY_VALUE_DB=key-value-db -e KEY_VALUE_USER=key-value-user -e KEY_VALUE_PASSWORD=key-value-password -p 27017:27017 -v key-value-data:/data/db -v ${pwd}/db/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js --network key-value-network mongodb/mongodb-community-server:7.0-ubuntu2204

# docker run --rm --name debugsb -it --network key-value-network mongodb/mongodb-community-server:7.0-ubuntu2204 mongosh mongodb://key-value-user:key-value-password@mongodb/key-value-db