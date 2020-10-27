#!/usr/bin/env bash

set -e

DOCKER_IMAGE=link-dom-bridge
CONTAINER_NAME=link-dom-bridge

docker build -t $DOCKER_IMAGE -f docker/Dockerfile .

set +e
docker container rm $CONTAINER_NAME
set -e

docker run -it \
    --name $CONTAINER_NAME \
    --net host \
    --volume `pwd`/:/src/:rw \
    $DOCKER_IMAGE $@
#    --rm \

#docker container rm $CONTAINER_NAME
