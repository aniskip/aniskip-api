#!/bin/bash

cd "${BASH_SOURCE%/*}"

docker-compose -f ./docker-compose.yml up --build -d