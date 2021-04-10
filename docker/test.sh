#!/bin/bash

cd "${BASH_SOURCE%/*}"

docker-compose -f ./docker-compose.yml -f ./docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from api
docker-compose -f ./docker-compose.yml -f ./docker-compose.test.yml rm --force -v test_db