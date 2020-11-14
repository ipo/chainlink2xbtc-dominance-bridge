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
    --volume `pwd`/key_xbtc_infura_mainnet.txt:/code/key_xbtc_infura_mainnet.txt:ro \
    --volume `pwd`/key_xbtc_infura_rinkeby.txt:/code/key_xbtc_infura_rinkeby.txt:ro \
    --volume `pwd`/key_xbtc_mainnet.txt:/code/key_xbtc_mainnet.txt:ro \
    --volume `pwd`/key_xbtc_rinkeby.txt:/code/key_xbtc_rinkeby.txt:ro \
    --volume `pwd`/key_xbtc_etherscan_api_key.txt:/code/key_xbtc_etherscan_api_key.txt:ro \
    $DOCKER_IMAGE $@
#    --rm \

#docker container rm $CONTAINER_NAME
