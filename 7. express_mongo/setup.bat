@echo off
setlocal

set "MONGO_IMAGE=mongodb/mongodb-community-server"
set "MONGO_TAG=7.0-ubuntu2204"
set "CONTAINER_NAME=mongodb"

set "ROOT_USER=root-user"
set "ROOT_PASSWORD=root-password"

set "KEY_VALUE_DB=key-value-db"
set "KEY_VALUE_USER=key-value-user"
set "KEY_VALUE_PASSWORD=key-value-password"

set "LOCALHOST_PORT=27017"
set "CONTAINER_PORT=27017"

set "NETWORK_NAME=key-value-network"

set "VOLUME_NAME=key-value-data"
set "CONTAINER_VOLUME_PATH=/data/db"

:: Stop and remove the container if it exists
docker ps -a --format "{{.Names}}" | findstr /I "%CONTAINER_NAME%" >nul 2>&1
if %ERRORLEVEL% == 0 (
    docker stop %CONTAINER_NAME%
    docker rm %CONTAINER_NAME%
)

:: Check if volume exists
docker volume inspect %VOLUME_NAME% >nul 2>&1
if %ERRORLEVEL% == 0 (
    docker volume rm %VOLUME_NAME%
)

:: Check if network exists
docker network inspect %NETWORK_NAME% >nul 2>&1
if %ERRORLEVEL% == 0 (
    docker network rm %NETWORK_NAME%
)

docker network create %NETWORK_NAME%
docker volume create %VOLUME_NAME%

docker run --name %CONTAINER_NAME% --rm ^
    -e MONGO_INITDB_DATABASE=admin ^
    -e MONGODB_INITDB_ROOT_USERNAME=%ROOT_USER% ^
    -e MONGODB_INITDB_ROOT_PASSWORD=%ROOT_PASSWORD% ^
    -e KEY_VALUE_DB=%KEY_VALUE_DB% ^
    -e KEY_VALUE_USER=%KEY_VALUE_USER% ^
    -e KEY_VALUE_PASSWORD=%KEY_VALUE_PASSWORD% ^
    -p %LOCALHOST_PORT%:%CONTAINER_PORT% ^
    -v %VOLUME_NAME%:%CONTAINER_VOLUME_PATH% ^
    -v "%CD%/db/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js" ^
    --network %NETWORK_NAME% ^
    %MONGO_IMAGE%:%MONGO_TAG%

endlocal
