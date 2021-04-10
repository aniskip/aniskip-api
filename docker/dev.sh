#!/bin/bash

cd "${BASH_SOURCE%/*}"

docker-compose -f ./docker-compose.yml -f ./docker-compose.dev.yml up --build -d