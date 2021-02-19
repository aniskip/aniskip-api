#!/bin/bash

cd "${BASH_SOURCE%/*}"

docker-compose -f ./docker-compose.yml logs -f $1