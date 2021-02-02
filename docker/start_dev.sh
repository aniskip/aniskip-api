#!/bin/bash

docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.dev.yml up --build -d